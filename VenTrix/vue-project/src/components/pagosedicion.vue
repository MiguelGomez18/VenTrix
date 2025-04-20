<template>
  <div class="contenedorTipoPago">
    <div class="titulobuscar">
      <h1>GESTIÓN DE TIPOS DE PAGO</h1>
      <input 
        type="text" 
        v-model="consultaBusqueda" 
        placeholder="Buscar Tipo de Pago" 
      />
    </div>

    <div v-if="!mostrar1" class="contenedorformulario">
      <form class="formulario" @submit.prevent="estaEditando ? actualizarTipoPago() : agregarTipoPago()">
        <input type="text" v-model="tipoPago.descripcion" placeholder="Descripción del tipo de pago" required />
        <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
        <button class="btncancelar" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>

    <table>
      <thead class="encabezado">
        <tr>
          <th>Descripción</th>
          <th v-if="!mostrar1">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr" v-for="(tp, indice) in tiposPagoPaginados" :key="tp.id">
          <td>{{ tp.descripcion }}</td>
          <td v-if="!mostrar1">
            <button class="btnEditar" @click="editarTipoPago(indice)">Editar</button>
            <button class="btnEliminar" @click="eliminarTipoPago(indice)">Eliminar</button>
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
import axios from '@/axios';
import { useCart } from '@/stores/cart';
import ModalSucursales from '@/components/ModalSucursales.vue';

const paginaActual = ref(1);
const filasPorPagina = 6;
const cart = useCart();
const nit = cart.nit;
// Variables reactivas
const tiposPago = ref([]); // Lista de tipos de pago
const tipoPago = ref({
  id: '',         // ID del tipo de pago
  descripcion: '', // Descripción del tipo de pago
  sucursal: nit,
  activo: 'ACTIVO'
});

const props = defineProps({
  mostrar: {
    type: Boolean,
    required: true
  }
});

const mostrar1 = ref(props.mostrar);
const estaEditando = ref(false); // Estado de edición
const indiceEdicion = ref(null); // Índice para saber cuál elemento se está editando
const consultaBusqueda = ref(''); // Campo de búsqueda

// Función para cargar los tipos de pago
const buscarTiposPago = async () => {
  try {
    const respuesta = await axios.get(`/tipo_pago/id_sucursal/${nit}`);
    tiposPago.value = respuesta.data.filter(tipo_pago => tipo_pago.activo !== "INACTIVO");

  } catch (error) {
    console.error("Error al cargar tipos de pago", error);
  }
};

const totalPaginas = computed(() => {
  if (tiposPagoFiltrados.value.length == 0) {
    return 1;
  }
  return Math.ceil(tiposPagoFiltrados.value.length / filasPorPagina);
});

const tiposPagoPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return tiposPagoFiltrados.value.slice(inicio, fin);
});

// Llamar a buscarTiposPago cuando el componente se monte
onMounted(() => {
  buscarTiposPago();
  if (cart.rol == 'ADMINISTRADOR') {
    cargarTodasLasSucursales();
  }
});

// Función computada para filtrar los tipos de pago según la búsqueda
const tiposPagoFiltrados = computed(() => {
  return tiposPago.value.filter(tp =>
    tp.descripcion.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
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
  agregarTipoPago();
};

// Función para agregar un nuevo tipo de pago
const agregarTipoPago = async () => {

  if (cart.rol === 'ADMINISTRADOR' && sucursalesSeleccionadas.value.length === 0) {
    mostrarModalSucursales.value = true;
    return;
  }

  try {

    if (cart.rol == "ADMINISTRADOR") {
      const sucursalesAUsar = cart.rol === 'ADMINISTRADOR' ? sucursalesSeleccionadas.value : [nit];
      
      for (const sucursalId of sucursalesAUsar) {
        tipoPago.value.sucursal = sucursalId;

        const nuevoTipoPago = { ...tipoPago.value };
        const response = await axios.post('/tipo_pago/registrar', nuevoTipoPago); 
      }

      await buscarTiposPago()
      Swal.fire({
        icon: 'success',
        title: 'Mesa Agregada',
        text: `El Tipo de pago se ha agregado exitosamente a ${sucursalesAUsar.length} sucursal(es).`,
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });
      resetearFormulario();
    } else {

      const nuevoTipoPago = { ...tipoPago.value };
      const response = await axios.post('/tipo_pago/registrar', nuevoTipoPago); 
      await buscarTiposPago()

      Swal.fire({
        icon: 'success',
        title: 'Tipo de Pago Agregado',
        text: 'El tipo de pago se ha agregado exitosamente.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });

      resetearFormulario();
    }
    
  } catch (error) {
    console.error('Error al agregar el tipo de pago:', error.response ? error.response.data : error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar el tipo de pago.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

// Función para editar un tipo de pago
const editarTipoPago = (indice) => {
  tipoPago.value = { ...tiposPago.value[indice] }; // Cargar datos en el formulario
  estaEditando.value = true;
  indiceEdicion.value = indice;
};

// Función para actualizar un tipo de pago
const actualizarTipoPago = async () => {
  try {
    const tipoPagoActualizado = { ...tipoPago.value };
    await axios.put(`/tipo_pago/${tipoPagoActualizado.id}`, tipoPagoActualizado); // Cambiar URL aquí

    await buscarTiposPago(); // Volver a cargar toda la lista de tipos de pago

    Swal.fire({
      icon: 'success',
      title: 'Tipo de Pago Actualizado',
      text: 'El tipo de pago se ha actualizado exitosamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
    resetearFormulario();
  } catch (error) {
    console.error('Error al actualizar el tipo de pago:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el tipo de pago.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

// Función para eliminar un tipo de pago
const eliminarTipoPago = async (indice) => {
  try {
    const tipoPagoAEliminar = tiposPago.value[indice];
    // Enviar la solicitud DELETE con el ID del tipo de pago
    await axios.delete(`/tipo_pago/${tipoPagoAEliminar.id}`); // Cambiar URL aquí
    await buscarTiposPago() // Eliminar el tipo de pago de la lista

    Swal.fire({
      icon: 'success',
      title: 'Tipo de Pago Eliminado',
      text: 'El tipo de pago ha sido eliminado exitosamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  } catch (error) {
    console.error('Error al eliminar el tipo de pago:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar el tipo de pago.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

// Función para cancelar la edición
const cancelarEdicion = () => {
  resetearFormulario();
};

// Función para resetear el formulario
const resetearFormulario = () => {
  tipoPago.value = { id: '', descripcion: '', sucursal: nit };
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
  
  .contenedorTipoPago {
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
    width: 10%;
    padding: 5px;
    text-align: center;
  }
  .td1{
    width: 4%;
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
  .contenedorTipoPago {
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
  .contenedorTipoPago {
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