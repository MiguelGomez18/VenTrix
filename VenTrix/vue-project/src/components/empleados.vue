<template>
    <div class="contenedorEmpleados">
        <div class="titulobuscar">
        <h1>Empleados</h1>
        <input 
            type="text" 
            v-model="consultaBusqueda" 
            placeholder="Buscar Empleado por documento" 
        />
        </div>
        <table>
        <thead class="encabezado">
            <tr>
            <th>Documento</th>
            <th v-if="!habilitado">Nit</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr class="tr" v-for="(user, indice) in empleadosPaginados" :key="user.documento">
            <td>{{ user.documento }}</td>
            <td v-if="!habilitado">{{ user.sucursal }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.correo }}</td>
            <td>{{ user.rol }}</td>
            <td>
                <button class="btnEliminar" @click="eliminarEmpleado(indice)">Eliminar</button>
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
import axios from '@/axios';
import { useCart } from '@/stores/cart';

const habilitado = ref(true);
const paginaActual = ref(1);
const filasPorPagina = 10;
const cart = useCart();
const empleados = ref([]);
const nit = cart.nit;
const consultaBusqueda = ref('');

const buscar = async () => {
  try {
    if (cart.rol == "ADMINISTRADOR") {
      const respuesta1 = await axios.get(`/sucursal/restaurante/${cart.restaurante}`);
      const sucursales = respuesta1.data.filter(sucursal => sucursal.estado !== "INACTIVO");
      habilitado.value = false;

      const empleadosPromises = sucursales.map(async (sucursal) => {
        const respuesta = await axios.get(`/usuario/sucursales/${sucursal.id}`);
        return respuesta.data;
      });
      empleados.value = (await Promise.all(empleadosPromises))
        .flat()
        .sort((a, b) => a.documento - b.documento);
        
      for (let index = 0; index < empleados.value.length; index++) {
          if (empleados.value[index].rol == "ADMINISTRADOR_SUCURSAL") {
              empleados.value[index].rol = "ADMINISTRADOR SUCURSAL"
          }
      }

    } else {
      const respuesta1 = await axios.get(`/usuario/sucursales/${nit}`);
      empleados.value = respuesta1.data.filter(usuario => usuario.estado !== "INACTIVO");
    
      for (let index = 0; index < empleados.value.length; index++) {
        if (empleados.value[index].rol == "ADMINISTRADOR_SUCURSAL") {
          empleados.value.splice(index,1);
        }
      }
      
    }
    
  } catch (error) {
    console.error("Error al cargar empleados", error);
  }
};

const totalPaginas = computed(() => {
  if (empleadosFiltrados.value.length == 0) {
    return 1;
  }
  return Math.ceil(empleadosFiltrados.value.length / filasPorPagina);
});

const empleadosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return empleadosFiltrados.value.slice(inicio, fin);
});

onMounted(() => {
  buscar();
});

const empleadosFiltrados = computed(() => {
  const searchTerm = consultaBusqueda.value.toLowerCase();
  return empleados.value.filter(emple => 
    emple.documento.includes(searchTerm)
  );
});

const eliminarEmpleado = async (indice) => {
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
        console.log(indice);
        
      const empleadoAEliminar = empleados.value[indice];
      console.log(empleadoAEliminar);
      
      await axios.delete(`/usuario/${empleadoAEliminar.documento}`);
      await buscar();

      Swal.fire('Eliminado', 'El empleado ha sido eliminado.', 'success', 'backdrop: false', 'allowOutsideClick: false', );
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el empleado.', 'error', 'backdrop: false', 'allowOutsideClick: false', );
    }
  }
};
</script>

<style scoped>
 .titulobuscar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
  }

  .titulobuscar h1{
    font-size: 25px;
    color: black;
  }

  .titulobuscar input{
    width: 35%;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid;
  }

  .encabezado{
    background-color: rgb(220, 220, 220);
    color: var(--color_letra_negra);
  }
  .contenedorEmpleados{
    width: 80%;
    height: auto;
    border-radius: 10px;
    padding: 30px;
    border: none;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    color: var(--color_letra_negra);
    margin-top: 20px;
  }
  table, th, td {
    border: 1px solid black;
  }
  th, td {
    width: 10%;
    padding: 5px 10px;
    text-align: center;
  }
  .tr:hover {
    background-color: white;
  }
  td img{
    width: 80px;
  }
  .btnEliminar {
    background-color: red;
    color: var(--color_letra_blanca);
    margin-left: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
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
  .contenedorEmpleados {
    width: 90%; /* Aumentamos el ancho del contenedor */
    padding: 20px; /* Reducimos el padding */
  }

  .titulobuscar {
    flex-direction: column; /* Apilamos el título y el campo de búsqueda */
    align-items: flex-start; /* Alineamos a la izquierda */
    gap: 10px; /* Espacio entre elementos */
    margin-bottom: 20px; /* Reducimos el margen inferior */
  }

  .titulobuscar input {
    width: 100%; /* El campo de búsqueda ocupa todo el ancho */
  }

  table {
    font-size: 14px; /* Reducimos el tamaño de la fuente */
  }

  th, td {
    padding: 5px; /* Reducimos el padding de las celdas */
  }

  .btnEliminar {
    padding: 4px 8px; /* Reducimos el padding del botón */
    font-size: 12px; /* Reducimos el tamaño de la fuente */
  }

  .paginacion {
    flex-direction: column; /* Apilamos los botones de paginación */
    gap: 5px; /* Reducimos el espacio entre botones */
  }

  .paginacion button {
    width: 100%; /* Los botones ocupan todo el ancho */
  }
}


@media (max-width: 819px) {
  .contenedorEmpleados {
    width: 100%; /* El contenedor ocupa todo el ancho */
    padding: 15px; /* Reducimos el padding */
  }

  .titulobuscar {
    flex-direction: column; /* Apilamos el título y el campo de búsqueda */
    align-items: flex-start; /* Alineamos a la izquierda */
    gap: 10px; /* Espacio entre elementos */
    margin-bottom: 20px; /* Reducimos el margen inferior */
  }

  .titulobuscar h1 {
    font-size: 20px; /* Reducimos el tamaño del título */
  }

  .titulobuscar input {
    width: 100%; /* El campo de búsqueda ocupa todo el ancho */
    font-size: 14px; /* Reducimos el tamaño de la fuente */
  }

  table {
    font-size: 12px; /* Reducimos el tamaño de la fuente */
  }

  th, td {
    padding: 3px; /* Reducimos el padding de las celdas */
  }

  .btnEliminar {
    padding: 3px 6px; /* Reducimos el padding del botón */
    font-size: 10px; /* Reducimos el tamaño de la fuente */
  }

  .paginacion {
    flex-direction: column; /* Apilamos los botones de paginación */
    gap: 5px; /* Reducimos el espacio entre botones */
  }

  .paginacion button {
    width: 100%; /* Los botones ocupan todo el ancho */
  }

  /* Ocultar columnas no esenciales */
  th:nth-child(2), td:nth-child(2) {
    display: none; /* Ocultamos la columna "Nit" */
  }
}
</style>