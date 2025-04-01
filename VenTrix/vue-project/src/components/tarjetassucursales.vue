<template>
    <div class="sucursales-container">
      <h2>Sucursales de {{ restauranteNombre }}</h2>
      
      <!-- Mostrar mensaje de error si ocurre un problema al cargar las sucursales -->
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Mostrar las tarjetas de sucursales -->
      <div class="cards-container">
        <div v-for="sucursal in sucursales" :key="sucursal.id" class="card">
          <h3>{{ sucursal.nombre }}</h3>
          <p><strong>Nit:</strong> {{ sucursal.id }}</p>
          <p><strong>Dirección:</strong> {{ sucursal.direccion }}</p>
          <p><strong>Ciudad:</strong> {{ sucursal.ciudad }}</p>
          <p><strong>Teléfono:</strong> {{ sucursal.telefono }}</p>
          <p><strong>Fecha de Apertura:</strong> {{ sucursal.fecha_apertura }}</p>
          <p><strong>Estado:</strong> {{ sucursal.estado }}</p>
          <p><strong>Administrador:</strong> {{ sucursal.administradorNombre }}</p>
          <button @click="verDetalles(sucursal.id)">Ver detalles</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import { defineProps } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCart } from '@/stores/cart';

  const props = defineProps({
    idrestaurante: {
      type: String,
      required: true
    }
  });
  
  const cart = useCart();
  const router = useRouter();
  const restauranteId = ref(props.idrestaurante); 
  const sucursales = ref([]);
  const loading = ref(true);
  const error = ref('');
  const restauranteNombre = ref('');
  
  // Obtener las sucursales desde la API
  const obtenerSucursales = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/sucursal/restaurante/${restauranteId.value}`);
    const sucursalesConAdministradores = await Promise.all(
      response.data.map(async (sucursal) => {
        let administradorNombre = "No tiene";
        if (sucursal.administrador) {
          try {
            const administradorResponse = await axios.get(`http://localhost:8080/usuario/nombre/${sucursal.administrador}`);
            administradorNombre = administradorResponse.data || "No tiene";
          } catch (error) {
            console.error(`Error al obtener el administrador para la sucursal ${sucursal.id}:`, error);
          }
        }
        return {
          ...sucursal,
          administradorNombre
        };
      })
    );

    sucursales.value = sucursalesConAdministradores.filter(sucursal => sucursal.estado !== "INACTIVO");

    const respuesta1 = await axios.get(`http://localhost:8080/restaurante/nombre/${restauranteId.value}`);
    restauranteNombre.value = respuesta1.data || 'Restaurante no encontrado';
    loading.value = false;
  } catch (error) {
    console.error("Error al cargar las sucursales:", error);
    error.value = 'No se pudieron cargar las sucursales. Intenta nuevamente.';
    loading.value = false;
  }
};

  
  // Función para manejar el clic en "Ver detalles"
  const verDetalles = (id) => {
    cart.nit = id;
    router.push({ name: 'EdicionAdmin' });
  };

  onMounted(() => {
    obtenerSucursales();
  });
  </script>
  
  <style scoped>
  .sucursales-container {
    text-align: center;
    padding: 20px;
    margin-bottom: 80px;
  }
  
  .loading {
    font-size: 18px;
    color: gray;
  }
  
  .error {
    font-size: 18px;
    color: red;
  }
  
  .cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    width: 250px;
    padding: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .card h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .card p {
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  .card button {
    background-color: #0def5c;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
  }
  
  .card button:hover {
    background-color: #0bcb4f;
  }
  </style>
  