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
  
      <div class="contenedorformulario">
        <form class="formulario" @submit.prevent="estaEditando ? actualizarMesa() : agregarMesa()">
          <input type="text" v-model="mesa.nombre" placeholder="Nombre de la mesa" required />
          <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
          <button class="btncancelar" type="button" @click="cancelarEdicion" v-if="estaEditando">Cancelar</button>
        </form>
      </div>
  
      <table>
        <thead class="encabezado">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mesaItem, indice) in mesasFiltradas" :key="mesaItem.id">
            <td>{{ mesaItem.id }}</td>
            <td>{{ mesaItem.nombre }}</td>
            <td>
              <button class="btnEditar" @click="editarMesa(indice)">Editar</button>
              <button class="btnEliminar" @click="eliminarMesa(indice)">Eliminar</button>
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
  
  const mesas = ref([]);
  const mesa = ref({
    nombre: ''
  });
  
  const estaEditando = ref(false);
  const indiceEdicion = ref(null);
  const consultaBusqueda = ref('');
  
  const buscarMesas = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8000/mesas'); 
    mesas.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar mesas", error);
  }
};

  
import { onMounted } from 'vue';

onMounted(() => {
  buscarMesas();
});

  
  const mesasFiltradas = computed(() => {
    return mesas.value.filter(mesaItem =>
      mesaItem.nombre.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
    );
  });
  
  const agregarMesa = async () => {
    try {
      const nuevaMesa = { ...mesa.value };
      const response = await axios.post('http://127.0.0.1:8000/registrar_mesa', nuevaMesa);
  
      mesas.value.push(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Mesa Agregada',
        text: 'La mesa se ha agregado exitosamente.'
      });
      resetearFormulario();
    } catch (error) {
      console.error('Error al agregar la mesa:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al agregar la mesa.'
      });
    }
  };
  
  const editarMesa = (indice) => {
    mesa.value = { ...mesas.value[indice] };
    estaEditando.value = true;
    indiceEdicion.value = indice;
  };
  
  const actualizarMesa = async () => {
    try {
      const mesaActualizada = { ...mesa.value };
      const response = await axios.put('http://127.0.0.1:8000/actualizar_mesa', mesaActualizada);
  
      mesas.value[indiceEdicion.value] = response.data;
      Swal.fire({
        icon: 'success',
        title: 'Mesa Actualizada',
        text: 'La mesa se ha actualizado exitosamente.'
      });
      resetearFormulario();
    } catch (error) {
      console.error('Error al actualizar la mesa:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar la mesa.'
      });
    }
  };
  
  const eliminarMesa = async (indice) => {
    try {
      const mesaAEliminar = mesas.value[indice];
      await axios.delete(`http://127.0.0.1:8000/eliminar_mesa/${mesaAEliminar.id}`);
      mesas.value.splice(indice, 1);
  
      Swal.fire({
        icon: 'success',
        title: 'Mesa Eliminada',
        text: 'La mesa ha sido eliminada exitosamente.'
      });
    } catch (error) {
      console.error('Error al eliminar la mesa:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar la mesa.'
      });
    }
  };
  
  const cancelarEdicion = () => {
    resetearFormulario();
  };
  
  const resetearFormulario = () => {
    mesa.value = { nombre: '' };
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
  </style>
  