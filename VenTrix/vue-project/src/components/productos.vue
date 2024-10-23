<template>
  <div class="contenedorProductos">
    <div class="titulobuscar">
      <h1>GESTIÓN DE PRODUCTOS</h1>
      <input 
        type="text" 
        v-model="consultaBusqueda" 
        placeholder="Buscar Producto" 
      />
    </div>

    <div class="contenedorformulario">
      <form class="formulario" @submit.prevent="estaEditando ? actualizarProducto() : agregarProducto()">
        <input type="number" v-model="producto.id" placeholder="ID del producto" required />
        <input type="text" v-model="producto.nombre" placeholder="Nombre del producto" required />
        <input type="number" v-model="producto.precio" placeholder="Precio" required />
        <select v-model="producto.id_categoria" required>
          <option value="">Seleccione una categoría</option>
          <option v-for="cate in categoriasFiltradas" :key="cate.id" :value="cate.id">
            {{ cate.nombre }}
          </option>
        </select>
        <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
        <button class="btncancelar" type="button" @click="cancelarEdicion" v-if="estaEditando">Cancelar</button>
      </form>
    </div>

    <table>
      <thead class="encabezado">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>ID_Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(prod, indice) in productosFiltrados" :key="prod.id">
          <td>{{ prod.id }}</td>
          <td>{{ prod.nombre }}</td>
          <td>{{ prod.precio }}</td>
          <td>
            <!-- Encuentra la categoría correspondiente al id_categoria del producto -->
            {{ categoriasFiltradas.find(cate => cate.id === prod.id_categoria)?.nombre || 'Sin Categoría' }}
          </td>
          <td>
            <button class="btnEditar" @click="editarProducto(indice)">Editar</button>
            <button class="btnEliminar" @click="eliminarProducto(indice)">Eliminar</button>
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
const nit = cart.getNit;
const productos = ref([]);
const categorias = ref([]);
const producto = ref({
  id: '',
  nombre: '',
  precio: '',
  id_categoria: '',
  id_sucursal: nit
});

const estaEditando = ref(false);
const indiceEdicion = ref(null);
const consultaBusqueda = ref('');
const consultaBusqueda1 = ref('');

const buscar = async (nit) => {
  try {
    console.log('Buscando productos para NIT:', nit);
    const respuesta = await axios.get(`http://127.0.0.1:8000/productos/${nit}`);
    console.log('Productos cargados:', respuesta.data); // Añade este log para ver los datos
    productos.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar productos", error);
  }
};

const buscarcategorias = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8000/categoria'); 
    categorias.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar categorias", error);
  }
};



onMounted(() => {
  console.log('NIT al montar el componente:', nit);
  buscar(nit);
  buscarcategorias();
});


const productosFiltrados = computed(() => {
  const searchTerm = consultaBusqueda.value.toLowerCase();
  return productos.value.filter(prod => 
    prod.nombre.toLowerCase().includes(searchTerm)
  );
});


const categoriasFiltradas = computed(() => {
  return categorias.value.filter(cate =>
    cate.nombre.toLowerCase().includes(consultaBusqueda1.value.toLowerCase())
  );
});

const agregarProducto = async () => {
  try {
    const nuevoProducto = { ...producto.value };
    console.log(producto.value);
    
    const response = await axios.post('http://127.0.0.1:8000/registrar_producto', nuevoProducto);

    productos.value.push(response.data);
    Swal.fire({
      icon: 'success',
      title: 'Producto Agregado',
      text: 'El producto se ha agregado exitosamente.'
    });
    resetearFormulario();
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar el producto.'
    });
  }
};

const editarProducto = (indice) => {
  producto.value = { ...productos.value[indice] };
  estaEditando.value = true;
  indiceEdicion.value = indice;
};

const actualizarProducto = async () => {
  try {
    const productoActualizado = { ...producto.value };
    const response = await axios.put('http://127.0.0.1:8000/actualizar_producto', productoActualizado);

    productos.value[indiceEdicion.value] = response.data;
    Swal.fire({
      icon: 'success',
      title: 'Producto Actualizado',
      text: 'El producto se ha actualizado exitosamente.'
    });
    resetearFormulario();
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el producto.'
    });
  }
};

const eliminarProducto = async (indice) => {
  try {
    const productoAEliminar = productos.value[indice];
    await axios.delete(`http://127.0.0.1:8000/eliminar_producto/${productoAEliminar.id}`);
    productos.value.splice(indice, 1);

    Swal.fire({
      icon: 'success',
      title: 'Producto Eliminado',
      text: 'El producto ha sido eliminado exitosamente.'
    });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar el producto.'
    });
  }
};

const cancelarEdicion = () => {
  resetearFormulario();
};

const resetearFormulario = () => {
  producto.value = { 
    id: '', nombre: '',
    precio: '', 
    id_categoria: '', 
    id_sucursal : nit 
  };
  estaEditando.value = false;
  indiceEdicion.value = null;
};
</script>

  
<style>
  .titulobuscar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .titulobuscar h1{
    font-size: 25px;
    color: var(--color_principal);
  
  }
  .encabezado{
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
  }
  .contenedorformulario{
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  .formulario input{
    width: 100%;
  }
  .formulario {
    width: 100%;
    display: flex ;
    align-items: center;
    border: solid var(--color_principal);
    border-radius: 10px;
    gap: 10px;
    padding: 10px;
  }
  .contenedorProductos{
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
  .btnAggAct{
    width: 30%;
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
    border-radius: 10px;
    padding: 4px;
  }
  
  .btncancelar{
    width: 30%;
    background-color:red;
    color: var(--color_letra_blanca);
    border-radius: 10px;
    padding: 4px;
  }
  </style>