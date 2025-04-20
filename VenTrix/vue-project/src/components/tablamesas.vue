<template>
  <div class="contenedorMesas">
    <div class="titulobuscar">
      <h1>GESTIÓN DE MESAS</h1>
      <input 
        type="text" 
        v-model="consultaBusqueda" 
        placeholder="Buscar Mesa" 
      />
    </div>

    <div v-if="!mostrar1" class="contenedorformulario">
      <form class="formulario" @submit.prevent="estaEditando ? actualizarMesa() : agregarMesa()">
        <input type="text" v-model="mesa.nombre" placeholder="Nombre de la mesa" required />
        <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
        <button class="btncancelar" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>

    <table>
      <thead class="encabezado">
        <tr>
          <th>Nombre</th>
          <th v-if="!mostrar1">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr" v-for="(mesaItem, indice) in mesasPaginadas" :key="mesaItem.id">
          <td>{{ mesaItem.nombre }}</td>
          <td v-if="!mostrar1">
            <button class="btnEditar" @click="editarMesa(indice)">Editar</button>
            <button class="btnEliminar" @click="eliminarMesa(indice)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="paginacion">
      <button :disabled="paginaActual === 1" @click="paginaActual--">Anterior</button>
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button :disabled="paginaActual === totalPaginas" @click="paginaActual++">Siguiente</button>
    </div>
  </div>
  <ModalSucursales
    v-if="cart.rol === 'ADMINISTRADOR'"
    :mostrar="mostrarModalSucursales"
    :sucursales="todasLasSucursales"
    @confirmar="handleSucursalesSeleccionadas"
    @cerrar="mostrarModalSucursales = false"
  />
</template>

<script setup>
import Swal from 'sweetalert2';
import { defineProps } from 'vue';
import { ref, computed, onMounted } from 'vue';
import { useCart } from '../stores/cart';
import axios from '@/axios';
import ModalSucursales from '@/components/ModalSucursales.vue';

const paginaActual = ref(1);
const filasPorPagina = 6;
const cart = useCart();
const nit = cart.nit; 
const mesas = ref([]);
const mesa = ref({
  nombre: '',
  estado: 'FISICA',
  sucursal: {
    id: nit
  },
  activo: 'ACTIVO'
});

const props = defineProps({
  mostrar: {
    type: Boolean,
    required: true
  }
});

const mostrar1 = ref(props.mostrar);
const estaEditando = ref(false);
const indiceEdicion = ref(null);
const consultaBusqueda = ref('');

// Cargar mesas al montar el componente
const buscarMesas = async (nit) => {
  try {
    const respuesta = await axios.get(`/mesa/id_sucursal/${nit}`);
    mesas.value = respuesta.data.filter(mesa => mesa.activo !== "INACTIVO");
  } catch (error) {
    console.error("Error al cargar mesas", error);
  }
};

const totalPaginas = computed(() => {
  if (mesasFiltradas.value.length == 0) {
    return 1;
  }
  return Math.ceil(mesasFiltradas.value.length / filasPorPagina);
});

const mesasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return mesasFiltradas.value.slice(inicio, fin);
});

onMounted(() => {
  buscarMesas(nit);
  if (cart.rol == 'ADMINISTRADOR') {
    cargarTodasLasSucursales();
  }
});

// Computed para filtrar mesas
const mesasFiltradas = computed(() => {
  return mesas.value.filter(mesaItem =>
    mesaItem.nombre.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
  );
});

const mostrarModalSucursales = ref(false);
const todasLasSucursales = ref([]);
const sucursalesSeleccionadas = ref([]);

const cargarTodasLasSucursales = async () => {
  try {
    const respuesta = await axios.get(`/sucursal/restaurante/${cart.restaurante}`);
    todasLasSucursales.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar todas las sucursales", error);
  }
};

const handleSucursalesSeleccionadas = (seleccionadas) => {
  sucursalesSeleccionadas.value = seleccionadas;
  mostrarModalSucursales.value = false;
  agregarMesa();
};

// Función para agregar una nueva mesa
const agregarMesa = async () => {

  if (cart.rol === 'ADMINISTRADOR' && sucursalesSeleccionadas.value.length === 0) {
    mostrarModalSucursales.value = true;
    return;
  }

  try {

    if (cart.rol == "ADMINISTRADOR") {
      
      const sucursalesAUsar = cart.rol === 'ADMINISTRADOR' ? sucursalesSeleccionadas.value : [nit];
      
      for (const sucursalId of sucursalesAUsar) {
        mesa.value.sucursal.id = sucursalId;

        const nuevaMesa = { ...mesa.value };
        const response = await axios.post('/mesa', nuevaMesa);
        mesas.value.push(response.data);
      }
        
      Swal.fire({
        icon: 'success',
        title: 'Mesa Agregada',
        text: `La Mesa se ha agregado exitosamente a ${sucursalesAUsar.length} sucursal(es).`,
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });
      resetearFormulario();

    } else {

      const nuevaMesa = { ...mesa.value };
      const response = await axios.post('/mesa', nuevaMesa);
      mesas.value.push(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Mesa Agregada',
        text: 'La mesa se ha agregado exitosamente.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });
      resetearFormulario();
    }

    
  } catch (error) {
    console.error('Error al agregar la mesa:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar la mesa.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

// Función para editar una mesa existente
const editarMesa = (indice) => {
  mesa.value = { ...mesas.value[indice] };
  estaEditando.value = true;
  indiceEdicion.value = indice;
};

// Función para actualizar una mesa
const actualizarMesa = async () => {
  try {
    const mesaActualizada = { ...mesa.value };
    const response = await axios.put(`/mesa/${mesaActualizada.id}`, mesaActualizada);
    mesas.value[indiceEdicion.value] = response.data;
    resetearFormulario();
    Swal.fire({
      icon: 'success',
      title: 'Mesa Actualizada',
      text: 'La mesa se ha actualizado exitosamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  } catch (error) {
    console.error('Error al actualizar la mesa:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar la mesa.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

// Función para eliminar una mesa
const eliminarMesa = async (indice) => {
  try {
    const mesaAEliminar = mesas.value[indice];
    await axios.delete(`/mesa/${mesaAEliminar.id}`);
    mesas.value.splice(indice, 1);
    Swal.fire({
      icon: 'success',
      title: 'Mesa Eliminada',
      text: 'La mesa ha sido eliminada exitosamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  } catch (error) {
    console.error('Error al eliminar la mesa:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar la mesa.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

// Función para cancelar la edición de una mesa
const cancelarEdicion = () => {
  resetearFormulario();
};

// Resetear formulario y estado
const resetearFormulario = () => {
  mesa.value = { nombre: '', estado: 'FISICA', sucursal: {id: nit} };
  estaEditando.value = false;
  indiceEdicion.value = null;
};
</script>

<style>
.titulobuscar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.titulobuscar h1 {
  font-size: 25px;
  color: var(--color_principal);
}
.encabezado {
  background-color: var(--color_principal);
  color: var(--color_letra_blanca);
}
.contenedorformulario {
  display: flex;
  justify-content: center;
  align-items: center;
}
.formulario input {
  width: 100%;
}
.formulario {
  width: 100%;
  display: flex;
  align-items: center;
  border: solid var(--color_principal);
  border-radius: 10px;
  gap: 10px;
  padding: 10px;
}
.contenedorMesas {
  width: 94%;
  height: auto;
  border-radius: 10px;
  padding: 30px;
  border: solid 3px var(--color_principal);
}
table {
  width: 100%;
  border-collapse: collapse;
  color: var(--color_letra_negra);
  margin-top: 20px;
}
table, th, td {
  border: 2px solid rgb(215, 226, 215);
}
th, td {
  padding: 5px;
  text-align: center;
}
.btnEditar {
  background-color: var(--color_principal);
  color: var(--color_letra_blanca);
  margin-right: 4px;
  padding: 5px;
  border-radius: 10px;
}
.btnEliminar {
  background-color: red;
  color: var(--color_letra_blanca);
  margin-left: 5px;
  padding: 5px;
  border-radius: 10px;
}
.btnAggAct {
  width: 30%;
  background-color: var(--color_principal);
  color: var(--color_letra_blanca);
  border-radius: 10px;
  padding: 4px;
}
.btncancelar {
  width: 30%;
  background-color: red;
  color: var(--color_letra_blanca);
  border-radius: 10px;
  padding: 4px;
}
.paginacion {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.paginacion button {
  background-color: var(--color_principal);
  color: var(--color_letra_blanca);
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.paginacion button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

.paginacion span {
  font-size: 14px;
  font-weight: bold;
}


@media (max-width: 1024px) and (min-width: 820px) {
  .contenedorMesas {
    padding: 20px;
  }

  .titulobuscar h1 {
    font-size: 22px;
  }

  .titulobuscar input {
    width: 40%;
  }

  .formulario {
    flex-direction: column;
    gap: 10px;
  }

  .formulario input {
    width: 100%;
  }

  .btnAggAct, .btncancelar {
    width: 100%;
    margin-top: 5px;
  }

  table {
    font-size: 14px;
  }

  .btnEditar, .btnEliminar {
    padding: 4px 8px;
    font-size: 12px;
  }

  .paginacion {
    flex-direction: column;
    gap: 5px;
  }

  .paginacion button {
    width: 100%;
  }
}

@media (max-width: 819px) {
  .contenedorMesas {
    padding: 15px;
    width: auto;
  }

  .titulobuscar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .titulobuscar h1 {
    font-size: 20px;
  }

  .titulobuscar input {
    width: 100%;
  }

  .formulario {
    flex-direction: column;
    gap: 10px;
  }

  .formulario input {
    width: 100%;
  }

  .btnAggAct, .btncancelar {
    width: 100%;
    margin-top: 5px;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 3px;
  }

  .btnEditar, .btnEliminar {
    padding: 3px 6px;
    font-size: 10px;
  }

  .paginacion {
    flex-direction: column;
    gap: 5px;
  }

  .paginacion button {
    width: 100%;
  }
}
</style>
