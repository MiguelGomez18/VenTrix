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
        <input type="text" v-model="producto.nombre" placeholder="Nombre del producto" required />
        <input type="number" v-model="producto.precio" placeholder="Precio" required />
        <select v-model="producto.categoria.id" required>
          <option value="">Seleccione una categoría</option>
          <option v-for="cate in categoriasFiltradas" :key="cate.id" :value="cate.id">
            {{ cate.nombre }}
          </option>
        </select>
        <div class="custom-file-input">
          <label for="file-upload" class="custom-label">
            <span v-if="!file">Imagen</span>
            <span v-else>Imagen ✅</span>
          </label>
          <input
            id="file-upload"
            class="hidden-file-input"
            type="file"
            @change="onFileChange"
            ref="fileInput"
          />
        </div>
        <div class="custom-checkbox">
          <input
            id="checkbox-disponibilidad"
            type="checkbox"
            v-model="producto.disponibilidad"
            class="hidden-checkbox"
          />
          <label for="checkbox-disponibilidad" class="custom-checkbox-label">
            Disponible
            <span class="checkbox-indicator">
              <span v-if="producto.disponibilidad" class="checkbox-checkmark">✔</span>
            </span>
          </label>
        </div>
        <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
        <button class="btncancelar" type="button" @click="cancelarEdicion" v-if="estaEditando">Cancelar</button>
      </form>
    </div>

    <table>
      <thead class="encabezado">
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr" v-for="(prod, indice) in productosPaginados" :key="prod.id_producto">
          <td>{{ prod.nombre }}</td>
          <td>{{ prod.precio }}</td>
          <td>
            {{ categoriasFiltradas.find(cate => cate.producto.some(pro => pro.id_producto === prod.id_producto))?.nombre || 'Sin Categoría' }}
          </td>
          <td><img :src="`http://127.0.0.1:8080${prod.imagen}`" alt=""></td>
          <td>
            <button class="btnEditar" @click="editarProducto(indice)">Editar</button>
            <button class="btnEliminar" @click="eliminarProducto(indice)">Eliminar</button>
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
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useCart } from '@/stores/cart';

const paginaActual = ref(1);
const filasPorPagina = 6;
const cart = useCart();
const nit = cart.nit;
const file = ref(null);
const fileInput = ref(null);
const productos = ref([]);
const categorias = ref([]);
const onFileChange = (event) => {
  file.value = event.target.files[0];
};
const producto = ref({
  id_producto: '',
  precio: '',
  categoria:{
    id: ''
  },
  nombre: '',
  imagen : '',
  disponibilidad : false
});

const estaEditando = ref(false);
const indiceEdicion = ref(null);
const indiceEd = ref(null);
const consultaBusqueda = ref('');
const consultaBusqueda1 = ref('');

const buscar = async () => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/producto/id_sucursal/${nit}`);
    productos.value = respuesta.data
  } catch (error) {
    console.error("Error al cargar productos", error);
  }
};

const buscarcategorias = async () => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/categoria/id_sucursal/${nit}`);
    categorias.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar categorias", error);
  }
};

const totalPaginas = computed(() => {
  if (productosFiltrados.value.length == 0) {
    return 1;
  }
  return Math.ceil(productosFiltrados.value.length / filasPorPagina);
});

const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return productosFiltrados.value.slice(inicio, fin);
});

onMounted(() => {
  buscar();
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
    if (!file.value) {
      Swal.fire({
        icon: 'error',
        title: 'Imagen requerida',
        text: 'No puede agregar si no hay una imagen de referencia.'
      });
      return;
    }
    const formData = new FormData();
    formData.append("nombre", producto.value.nombre);
    formData.append("precio", producto.value.precio);
    formData.append("disponibilidad", producto.value.disponibilidad);
    formData.append("id_categoria", producto.value.categoria.id);
    formData.append("id_sucursal", nit)
    formData.append("imagen", file.value);
    

    const response = await axios.post(
      'http://127.0.0.1:8080/producto/registrar_producto', 
      formData, 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    
    Swal.fire({
      icon: 'success',
      title: 'Producto Agregado',
      text: 'El producto se ha agregado exitosamente.'
    });

    await buscar()
    await buscarcategorias()
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

  const id_categoria = categorias.value.find(cate => cate.producto.some(prod => prod.id_producto === productos.value[indice].id_producto))?.id;

  const { id_producto, nombre, precio, imagen, disponibilidad } = productos.value[indice];

  producto.value = { id_producto, nombre, precio, categoria: { id: id_categoria }, imagen, disponibilidad };
  
  estaEditando.value = true;
  indiceEdicion.value = id_producto; 
  indiceEd.value = indice;
};

const actualizarProducto = async () => {
  try {

    const formData = new FormData();
        formData.append('nombre', producto.value.nombre);
        formData.append('precio', producto.value.precio);
        formData.append("id_categoria", producto.value.categoria.id);
        formData.append('disponibilidad', producto.value.disponibilidad);


        if (file.value != null) {

          formData.append('imagen', file.value);

        } else {

          const productoEncontrado = productos.value.find(p => p.id_producto === producto.value.id_producto);

          try {
            const imagenUrl = `http://127.0.0.1:8080${productoEncontrado.imagen}`;
            const respuesta = await fetch(imagenUrl);
            
            if (!respuesta.ok) {
              throw new Error('No se pudo obtener la imagen');
            }

            const imagenBlob = await respuesta.blob();
            const imagenFile = new File([imagenBlob], productoEncontrado.imagen.split('/imagenes/productos/'+productoEncontrado.id_producto+'-').pop(), { type: imagenBlob.type });

            formData.append('imagen', imagenFile);
          } catch (error) {
            console.error('Error al obtener la imagen existente:', error);
          }
        }

        const response = await axios.put(`http://127.0.0.1:8080/producto/${producto.value.id_producto}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

    await buscar()
    await buscarcategorias()
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
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  
  if (result.isConfirmed) {
    try {
      const productoAEliminar = productos.value[indice];
      await axios.delete(`http://127.0.0.1:8080/producto/${productoAEliminar.id_producto}`);
      productos.value.splice(indice, 1);

      Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
    }
  }
};

const cancelarEdicion = () => {
  resetearFormulario();
};

const resetearFormulario = () => {
  producto.value = { 
    id_producto: '',
    precio: '',
    categoria: { id: '' },
    nombre: '',
    imagen: '',      
    disponibilidad: false 
  };
  file.value = null;
  fileInput.value.value = null;
  estaEditando.value = false;
  indiceEdicion.value = null;
};
</script>

  
<style scoped>
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

  .titulobuscar input{
    width: 30%;
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
  .formulario input,select{
    width: 100%;
    padding: 5px;
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
  td img{
    width: 80px;
  }
  .hidden-file-input {
    display: none;
  }
  .custom-file-input {
    position: relative;
  }
  .custom-label {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 5px;
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
    padding: 6px;
    border-radius: 5px;
    border: 1px solid;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .hidden-checkbox {
    display: none;
  }
  .custom-checkbox-label {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    font-size: 16px;
    color: var(--color_letra_negra);
  }
  .checkbox-indicator {
    width: 15px;
    height: 15px;
    border: 2px solid var(--color_principal);
    border-radius: 4px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
  .hidden-checkbox:checked + .custom-checkbox-label .checkbox-indicator {
    background-color: var(--color_principal);
    border-color: var(--color_letra_negra);
  }
  .checkbox-checkmark {
    color: var(--color_letra_blanca);
    font-size: 10px;
    font-weight: bold;
  }
  .btnEditar {
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
    margin-right: 4px;
    padding: 5px 10px;
    border-radius: 10px;
  }
  .btnEliminar {
    background-color: red;
    color: var(--color_letra_blanca);
    margin-left: 5px;
    padding: 5px 10px;
    border-radius: 10px;
  }
  .btnAggAct{
    width: 30%;
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
    border-radius: 10px;
    padding: 5px 10px;
  }
  .btncancelar{
    width: 30%;
    background-color:red;
    color: var(--color_letra_blanca);
    border-radius: 10px;
    padding: 5px 10px;
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
</style>