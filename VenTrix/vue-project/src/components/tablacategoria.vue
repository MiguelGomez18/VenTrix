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

    <div class="contenedorformulario">
      <form class="formulario" @submit.prevent="estaEditando ? actualizarCategoria() : agregarCategoria()">
        <input type="text" v-model="categoria.nombre" placeholder="Nombre de la categoría" required />
        <input type="text" v-model="categoria.descripcion" placeholder="Descripcion" required />
        <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
        <button class="btncancelar" type="button" @click="cancelarEdicion" v-if="estaEditando">Cancelar</button>
      </form>
    </div>

    <table>
      <thead class="encabezado">
        <tr>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cate, indice) in categoriasFiltradas" :key="cate.id">
          <td>{{ cate.nombre }}</td>
          <td>{{ cate.descripcion }}</td>
          <td>
            <button class="btnEditar" @click="editarCategoria(indice)">Editar</button>
            <button class="btnEliminar" @click="eliminarCategoria(indice)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useCart } from '@/stores/cart';

const cart = useCart();
const nit = cart.nit;
const categorias = ref([]);
const categoria = ref({
  id: '',
  descripcion:'',
  nombre: '',
  sucursal: nit
});

const estaEditando = ref(false);
const indiceEdicion = ref(null);
const consultaBusqueda = ref('');

const buscarCategorias = async () => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/categoria/id_sucursal/${nit}`);
    categorias.value = respuesta.data;

    console.log("Categorias cargadas:", categorias.value);
  } catch (error) {
    console.error("Error al cargar categorias", error);
  }
};

buscarCategorias();

const categoriasFiltradas = computed(() => {
  return categorias.value.filter(cate =>
    cate.nombre.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
  );
});

const agregarCategoria = async () => {
  try {
    const nuevaCategoria = { ...categoria.value };
    console.log(nuevaCategoria);
    const response = await axios.post('http://127.0.0.1:8080/categoria', nuevaCategoria);

    categorias.value.push(response.data);
    Swal.fire({
      icon: 'success',
      title: 'Categoría Agregada',
      text: 'La categoría se ha agregado exitosamente.'
    });
    resetearFormulario();
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar la categoría.'
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
    const response = await axios.put(`http://127.0.0.1:8080/categoria/${categoriaActualizada.id}`, categoriaActualizada);

    categorias.value[indiceEdicion.value] = response.data;
    Swal.fire({
      icon: 'success',
      title: 'Categoría Actualizada',
      text: 'La categoría se ha actualizado exitosamente.'
    });
    resetearFormulario();
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar la categoría.'
    });
  }
};

const eliminarCategoria = async (indice) => {
  try {
    const categoriaAEliminar = categorias.value[indice];
    await axios.delete(`http://127.0.0.1:8080/categoria/${categoriaAEliminar.id}`);
    categorias.value.splice(indice, 1);

    Swal.fire({
      icon: 'success',
      title: 'Categoría Eliminada',
      text: 'La categoría ha sido eliminada exitosamente.'
    });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar la categoría.'
    });
  }
};

const cancelarEdicion = () => {
  resetearFormulario();
};

const resetearFormulario = () => {
  categoria.value = { nombre: '' };
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
    width: 80%;
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
</style>
