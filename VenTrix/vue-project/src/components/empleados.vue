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
import axios from 'axios';
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
      const respuesta1 = await axios.get(`http://127.0.0.1:8080/sucursal/restaurante/${cart.restaurante}`);
      const sucursales = respuesta1.data;
      habilitado.value = false;

      const empleadosPromises = sucursales.map(async (sucursal) => {
        const respuesta = await axios.get(`http://127.0.0.1:8080/usuario/sucursales/${sucursal.id}`);
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
      const respuesta1 = await axios.get(`http://127.0.0.1:8080/usuario/sucursales/${nit}`);
      empleados.value = respuesta1.data;
    
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
      
      await axios.delete(`http://127.0.0.1:8080/usuario/${empleadoAEliminar.documento}`);
      await buscar();

      Swal.fire('Eliminado', 'El empleado ha sido eliminado.', 'success');
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el empleado.', 'error');
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
    border-radius: 10px;
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
</style>