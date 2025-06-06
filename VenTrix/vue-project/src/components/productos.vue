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

    <div v-if="!mostrar1" class="contenedorformulario">
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
        <button class="btncancelar" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>

    <div class="table-container">
      <table>
        <thead class="encabezado">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th v-if="!mostrar1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tr" v-for="(prod, indice) in productosPaginados" :key="prod.id_producto">
            <td>{{ prod.nombre }}</td>
            <td>{{ prod.precio }}</td>
            <td>
              {{ categoriasFiltradas.find(cate => cate.producto.some(pro => pro.id_producto === prod.id_producto))?.nombre || 'Sin Categoría' }}
            </td>
            <td><img :src="getImagen(prod.imagen)" alt="Imagen del producto" /></td>
            <td v-if="!mostrar1">
              <button class="btnEditar" @click="editarProducto(indice)">Editar</button>
              <button class="btnEliminar" @click="eliminarProducto(indice)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
import getBaseUrl from '@/getBaseUrl'
import { useCart } from '@/stores/cart';
import ModalSucursales from '@/components/ModalSucursales.vue';


const props = defineProps({
  mostrar: {
    type: Boolean,
    required: true
  }
});

const mostrar1 = ref(props.mostrar);
const paginaActual = ref(1);
const filasPorPagina = 6;
const cart = useCart();
const nit = cart.nit;
const file = ref(null);
const fileInput = ref(null);
const getImagen = (path) => `${getBaseUrl()}${path}`
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
    const respuesta = await axios.get(`/producto/id_sucursal/${nit}`);
    productos.value = respuesta.data.filter(producto => producto.activo !== "INACTIVO");
  } catch (error) {
    console.error("Error al cargar productos", error);
  }
};

const buscarcategorias = async () => {
  try {
    const respuesta = await axios.get(`/categoria/id_sucursal/${nit}`);
    categorias.value = respuesta.data.filter(categoria => categoria.activo !== "INACTIVO");
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
  if (cart.rol == 'ADMINISTRADOR') {
    cargarTodasLasSucursales();
  }
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
  agregarProducto();
};

const agregarProducto = async () => {

  if (cart.rol === 'ADMINISTRADOR' && sucursalesSeleccionadas.value.length === 0) {
    mostrarModalSucursales.value = true;
    return;
  }

  try {
    if (!file.value) {
      Swal.fire({
        icon: 'error',
        title: 'Imagen requerida',
        text: 'No puede agregar si no hay una imagen de referencia.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });
      return;
    }

    if (cart.rol == "ADMINISTRADOR") {
      const nombreCategoria = categorias.value.find(c => c.id === producto.value.categoria.id)?.nombre;
      if (!nombreCategoria) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error de categoria encontrada.',
          backdrop: false,  // Evita problemas con el fondo modal
          allowOutsideClick: false, 
        });
        return;
      }

      const formData = new FormData();
      formData.append("nombre", producto.value.nombre);
      formData.append("precio", producto.value.precio);
      formData.append("disponibilidad", producto.value.disponibilidad);
      formData.append("imagen", file.value);

      const sucursalesAUsar = cart.rol === 'ADMINISTRADOR' ? sucursalesSeleccionadas.value : [nit];
      
      for (const sucursalId of sucursalesAUsar) {
        // Buscar la categoría correspondiente en cada sucursal
        const categoriasSucursal = await axios.get(`/categoria/id_sucursal/${sucursalId}`);
        const categoriaSucursal = categoriasSucursal.data.find(c => c.nombre === nombreCategoria);
        
        if (!categoriaSucursal) {
          console.warn(`No se encontró la categoría "${nombreCategoria}" en la sucursal ${sucursalId}`);
          continue;
        }

        formData.set("id_categoria", categoriaSucursal.id);
        formData.set("id_sucursal", sucursalId);
        formData.append("activo", 'ACTIVO');

        await axios.post('/producto/registrar_producto', 
          formData, 
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado',
        text: `El Producto se ha agregado exitosamente a ${sucursalesAUsar.length} sucursal(es).`,
        backdrop: false,
        allowOutsideClick: false, 
      });

      await buscar();
      await buscarcategorias();
      resetearFormulario();
      sucursalesSeleccionadas.value = [];

    } else {
      const formData = new FormData();
      formData.append("nombre", producto.value.nombre);
      formData.append("precio", producto.value.precio);
      formData.append("disponibilidad", producto.value.disponibilidad);
      formData.append("id_categoria", producto.value.categoria.id);
      formData.append("id_sucursal", nit);
      formData.append("imagen", file.value);
      formData.append("activo", 'ACTIVO');
      
      const response = await axios.post(
        '/producto/registrar_producto', 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado',
        text: 'El producto se ha agregado exitosamente.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
      });

      await buscar()
      await buscarcategorias()
      resetearFormulario();
    }

  } catch (error) {
    console.error('Error al agregar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar el producto.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

const editarProducto = (indicePagina) => {
  const indiceReal = (paginaActual.value - 1) * filasPorPagina + indicePagina;
  const id_categoria = categorias.value.find(cate => cate.producto.some(prod => prod.id_producto === productos.value[indiceReal].id_producto))?.id;

  const { id_producto, nombre, precio, imagen, disponibilidad } = productos.value[indiceReal];

  producto.value = { id_producto, nombre, precio, categoria: { id: id_categoria }, imagen, disponibilidad };
  
  estaEditando.value = true;
  indiceEdicion.value = id_producto; 
  indiceEd.value = indiceReal;
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
            const imagenUrl = computed(() => `${getBaseUrl()}${productoEncontrado.imagen}`)
            const respuesta = await fetch(imagenUrl.value)
            
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

        const response = await axios.put(`/producto/${producto.value.id_producto}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

    await buscar()
    await buscarcategorias()
    Swal.fire({
      icon: 'success',
      title: 'Producto Actualizado',
      text: 'El producto se ha actualizado exitosamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
    
    resetearFormulario();
    
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el producto.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

const eliminarProducto = async (indicePagina) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    backdrop: false,  // Evita problemas con el fondo modal
    allowOutsideClick: false, 
  });
  
  if (result.isConfirmed) {
    try {
      const indiceReal = (paginaActual.value - 1) * filasPorPagina + indicePagina;
      const productoAEliminar = productos.value[indiceReal];
      await axios.delete(`/producto/${productoAEliminar.id_producto}`);
      await buscar();
      await buscarcategorias();

      Swal.fire({
        title: 'Eliminado',
        text: 'El producto ha sido eliminado.',
        icon: 'success',
        backdrop: false,
        allowOutsideClick: false
      });
      if (productosPaginados.value.length === 0 && paginaActual.value > 1) {
        paginaActual.value--;
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar el producto.',
        icon: 'error',
        backdrop: false,
        allowOutsideClick: false
      });
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
    disponibilidad: false, 
    activo: 'ACTIVO'
  };
  file.value = null;
  fileInput.value.value = null;
  estaEditando.value = false;
  indiceEdicion.value = null;
  sucursalesSeleccionadas.value = [];
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
  .table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* Para un mejor scroll en iOS */
    margin-top: 20px;
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


/* Media Queries */
@media (max-width: 1024px) and (min-width: 820px) {
  .contenedorProductos {
    width: 90%;
    padding: 20px;
  }

  .titulobuscar h1 {
    font-size: 22px;
  }

  .titulobuscar input {
    width: 100%;
  }

  .formulario {
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
  }

  .formulario input,
  .formulario select,
  .custom-file-input,
  .custom-checkbox {
    flex: 1 1 45%;
  }

  .btnAggAct,
  .btncancelar {
    width: 45%;
    font-size: 14px;
  }

  table {
    font-size: 14px;
  }

  td img {
    width: 60px;
  }

  .btnEditar,
  .btnEliminar {
    padding: 4px 8px;
    font-size: 14px;
  }

  .paginacion {
    gap: 8px;
  }

  .paginacion button {
    padding: 4px 8px;
    font-size: 14px;
  }
}

@media (max-width: 819px) {
  .contenedorProductos {
    padding: 15px;
    width: auto;
  }

  .titulobuscar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 5px;
  }

  .titulobuscar h1 {
    font-size: 20px;
  }

  .titulobuscar input {
    width: 95%;
  }

  .formulario {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  .formulario input,
  .formulario select,
  .custom-file-input,
  .custom-checkbox {
    width: 100%;
  }

  .btnAggAct,
  .btncancelar {
    width: 100%;
    font-size: 14px;
  }

  table {
    font-size: 14px;
  }

  th,
  td {
    padding: 4px;
  }

  td img {
    width: 60px;
  }

  .btnEditar,
  .btnEliminar {
    padding: 4px 8px;
    font-size: 12px;
  }

  .paginacion {
    flex-direction: column;
    gap: 8px;
  }

  .paginacion button {
    width: 100%;
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>