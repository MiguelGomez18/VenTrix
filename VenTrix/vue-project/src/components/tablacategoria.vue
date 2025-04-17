<template>
  <div class="contenedorCategorias">
    <div class="titulobuscar">
      <h1>GESTIÓN DE CATEGORÍAS</h1>
      <input 
        type="text" 
        v-model="consultaBusqueda" 
        placeholder="Buscar Categoría" 
      />
    </div>

    <div v-if="!mostrar1" class="contenedorformulario">
      <form class="formulario" @submit.prevent="estaEditando ? actualizarCategoria() : agregarCategoria()">
        <input type="text" v-model="categoria.nombre" placeholder="Nombre de la categoría" required />
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
        <tr class="tr" v-for="(cate, indice) in categoriasPaginadas" :key="cate.id">
          <td>{{ cate.nombre }}</td>
          <td v-if="!mostrar1">
            <button class="btnEditar" @click="editarCategoria(indice)">Editar</button>
            <button class="btnEliminar" @click="eliminarCategoria(indice)">Eliminar</button>
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
const categorias = ref([]);
const categoria = ref({
  id: '',
  nombre: '',
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
const estaEditando = ref(false);
const indiceEdicion = ref(null);
const consultaBusqueda = ref('');

const buscarCategorias = async () => {
  try {
    const respuesta = await axios.get(`/categoria/id_sucursal/${nit}`);
    categorias.value = respuesta.data.filter(categoria => categoria.activo !== "INACTIVO");

  } catch (error) {
    console.error("Error al cargar categorias", error);
  }
};

onMounted(() => {
  buscarCategorias();
  if (cart.rol == 'ADMINISTRADOR') {
    cargarTodasLasSucursales();
  }
});


const totalPaginas = computed(() => {
  if (categoriasFiltradas.value.length == 0) {
    return 1;
  }
  return Math.ceil(categoriasFiltradas.value.length / filasPorPagina);
});

const categoriasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return categoriasFiltradas.value.slice(inicio, fin);
});

const categoriasFiltradas = computed(() => {
  return categorias.value.filter(cate =>
    cate.nombre.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
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
  agregarCategoria();
};

const agregarCategoria = async () => {

  if (cart.rol === 'ADMINISTRADOR' && sucursalesSeleccionadas.value.length === 0) {
    mostrarModalSucursales.value = true;
    return;
  }

  try {
    if (cart.rol == "ADMINISTRADOR") {
      const sucursalesAUsar = cart.rol === 'ADMINISTRADOR' ? sucursalesSeleccionadas.value : [nit];
      
      for (const sucursalId of sucursalesAUsar) {
        categoria.value.sucursal = sucursalId;

        const nuevaCategoria = { ...categoria.value };
        const response = await axios.post('/categoria', nuevaCategoria);
      }

      await buscarCategorias()
      Swal.fire({
        icon: 'success',
        title: 'Categoría Agregada',
        text: `La Categoria se ha agregado exitosamente a ${sucursalesAUsar.length} sucursal(es).`,
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });
      resetearFormulario();
    } else {
      const nuevaCategoria = { ...categoria.value };
      const response = await axios.post('/categoria', nuevaCategoria);

      await buscarCategorias()
      Swal.fire({
        icon: 'success',
        title: 'Categoría Agregada',
        text: 'La categoría se ha agregado exitosamente.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });
      resetearFormulario();
    }
    
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar la categoría.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

const editarCategoria = (indice) => {
  categoria.value = { ...categorias.value[indice] };
  estaEditando.value = true;
  indiceEdicion.value = indice;
};

const actualizarCategoria = async () => {
  try {
    const categoriaActualizada = { ...categoria.value };
    const response = await axios.put(`/categoria/${categoriaActualizada.id}`, categoriaActualizada);

    await buscarCategorias();
    Swal.fire({
      icon: 'success',
      title: 'Categoría Actualizada',
      text: 'La categoría se ha actualizado exitosamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
    resetearFormulario();
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar la categoría.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

const eliminarCategoria = async (indice) => {
  try {
    const categoriaAEliminar = categorias.value[indice];
    await axios.delete(`/categoria/${categoriaAEliminar.id}`);
    await buscarCategorias();

    Swal.fire({
      icon: 'success',
      title: 'Categoría Eliminada',
      text: 'La categoría ha sido eliminada exitosamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar la categoría.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

const cancelarEdicion = () => {
  resetearFormulario();
};

const resetearFormulario = () => {
  categoria.value = { id: '', nombre: '', sucursal: nit };
  estaEditando.value = false;
  indiceEdicion.value = null;
};
</script>

<style>
  /* Estilos organizados y simplificados */
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
  .titulobuscar input {
    width: 30%;
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
  .formulario input, select {
    width: 100%;
    padding: 5px;
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
  .contenedorCategorias {
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
  .tr:hover {
    background-color: rgba(128, 128, 128, 0.399);
  }
  .td1 {
    width: 4%;
  }
  .btnEditar, .btnEliminar, .btnAggAct, .btncancelar {
    color: var(--color_letra_blanca);
    padding: 5px 10px;
    border-radius: 10px;
  }
  .btnEditar {
    background-color: var(--color_principal);
    margin-right: 4px;
  }
  .btnEliminar {
    background-color: red;
    margin-left: 5px;
  }
  .btnAggAct {
    background-color: var(--color_principal);
  }
  .btncancelar {
    background-color: red;
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
  .contenedorCategorias {
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
  .contenedorCategorias {
    padding: 15px;
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
