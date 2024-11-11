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

    <div class="contenedorformulario">
      <form class="formulario" @submit.prevent="estaEditando ? actualizarTipoPago() : agregarTipoPago()">
        <input type="text" v-model="tipoPago.descripcion" placeholder="Descripción del tipo de pago" required />
        <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
        <button class="btncancelar" type="button" @click="cancelarEdicion" v-if="estaEditando">Cancelar</button>
      </form>
    </div>

    <table>
      <thead class="encabezado">
        <tr>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tp, indice) in tiposPagoFiltrados" :key="tp.id">
          <td>{{ tp.descripcion }}</td>
          <td>
            <button class="btnEditar" @click="editarTipoPago(indice)">Editar</button>
            <button class="btnEliminar" @click="eliminarTipoPago(indice)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useCart } from '@/stores/cart';

const cart = useCart();
const restaurante = cart.restaurante;
const nit = cart.nit;
// Variables reactivas
const tiposPago = ref([]); // Lista de tipos de pago
const tipoPago = ref({
  id: '',         // ID del tipo de pago
  descripcion: '', // Descripción del tipo de pago
  sucursal: nit
});

const estaEditando = ref(false); // Estado de edición
const indiceEdicion = ref(null); // Índice para saber cuál elemento se está editando
const consultaBusqueda = ref(''); // Campo de búsqueda

// Función para cargar los tipos de pago
const buscarTiposPago = async () => {
  try {
    const respuesta1 = await axios.get(`http://127.0.0.1:8080/sucursal/id_sucursal/${restaurante}`);
    const sucursales = respuesta1.data;

    const tiposPagosPromises = sucursales.map(async (sucursal) => {
      const respuesta = await axios.get(`http://127.0.0.1:8080/tipo_pago/id_sucursal/${sucursal.id}`);
      return respuesta.data;
    });

    tiposPago.value = (await Promise.all(tiposPagosPromises))
      .flat()
      .sort((a, b) => a.id - b.id); 

    console.log("Tipos pagos cargados:", tiposPago.value);
  } catch (error) {
    console.error("Error al cargar tipos de pago", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los tipos de pago.'
    });
  }
};

// Llamar a buscarTiposPago cuando el componente se monte
onMounted(() => {
  buscarTiposPago();
});

// Función computada para filtrar los tipos de pago según la búsqueda
const tiposPagoFiltrados = computed(() => {
  return tiposPago.value.filter(tp =>
    tp.descripcion.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
  );
});

// Función para agregar un nuevo tipo de pago
const agregarTipoPago = async () => {
  try {
    const nuevoTipoPago = { ...tipoPago.value };
    const response = await axios.post('http://127.0.0.1:8080/tipo_pago/registrar', nuevoTipoPago); // Cambiar URL aquí
    tiposPago.value.push(response.data); // Agregar nuevo tipo de pago a la lista

    Swal.fire({
      icon: 'success',
      title: 'Tipo de Pago Agregado',
      text: 'El tipo de pago se ha agregado exitosamente.'
    });

    resetearFormulario();
  } catch (error) {
    console.error('Error al agregar el tipo de pago:', error.response ? error.response.data : error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar el tipo de pago.'
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
    await axios.put(`http://127.0.0.1:8000/tipo_pago/${tipoPagoActualizado.id}`, tipoPagoActualizado); // Cambiar URL aquí

    await buscarTiposPago(); // Volver a cargar toda la lista de tipos de pago

    Swal.fire({
      icon: 'success',
      title: 'Tipo de Pago Actualizado',
      text: 'El tipo de pago se ha actualizado exitosamente.'
    });
    resetearFormulario();
  } catch (error) {
    console.error('Error al actualizar el tipo de pago:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el tipo de pago.'
    });
  }
};

// Función para eliminar un tipo de pago
const eliminarTipoPago = async (indice) => {
  try {
    const tipoPagoAEliminar = tiposPago.value[indice];
    // Enviar la solicitud DELETE con el ID del tipo de pago
    await axios.delete(`http://127.0.0.1:8000/tipo_pago/${tipoPagoAEliminar.id}`); // Cambiar URL aquí
    tiposPago.value.splice(indice, 1); // Eliminar el tipo de pago de la lista

    Swal.fire({
      icon: 'success',
      title: 'Tipo de Pago Eliminado',
      text: 'El tipo de pago ha sido eliminado exitosamente.'
    });
  } catch (error) {
    console.error('Error al eliminar el tipo de pago:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar el tipo de pago.'
    });
  }
};

// Función para cancelar la edición
const cancelarEdicion = () => {
  resetearFormulario();
};

// Función para resetear el formulario
const resetearFormulario = () => {
  tipoPago.value = { id: '', descripcion: '' };
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
</style>