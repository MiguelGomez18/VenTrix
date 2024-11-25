<template>
  <div v-if="!Rol" class="compra-rapida-container">
    <v-btn
      v-for="mesa in mesaCompraRapida"
      :key="mesa.id" 
      class="compra-rapida"
      color="blue darken-1"
      large
      @click="navegarARuta(mesa.id)"
    >
      <img src="./img/mesa.png" alt="Compra Rápida Icon" />
      <span style="color: white;">{{ mesa.nombre }}</span>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useCart } from '@/stores/cart';

const cart = useCart();
const route = useRoute();
const router = useRouter();
const nit = ref(route.params.nit);
const Rol = ref(false);
const rol = ref(route.params.rol);
const mesaCompraRapida = ref([]);
const mesa = ref({
  nombre: 'Mesa Rapida',
  estado: 'RAPIDA',
  sucursal: {
    id: nit.value
  }
});
const date = new Date();
const dia = (date.getDate() < 10 ? '0':'') + date.getDate();
const mes = date.getMonth() + 1;
const año = date.getFullYear();
const hora = date.getHours();
const minutos = date.getMinutes();

const buscarMesas = async (nit) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/mesa/mesa_rapida/id_sucursal/${nit.value}`);
    mesaCompraRapida.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar mesas", error);
  }
};

const navegarARuta = async (mesaId) => {
  window.dispatchEvent(new Event('ocultarInicio'));
  const user = ref([]);
  const response = await axios.get(`http://127.0.0.1:8080/usuario/${cart.documento}`);
  user.value = response.data;
  const pedidos = {
    fecha_pedido: `${año}-${mes}-${dia}`,
    hora_pedido: `${hora}:${minutos}`,
    mesa: {
      id: mesaId,
    },
    nombre: user.value.nombre,
    sucursal: nit.value,
  }
  
  const respuesta = await axios.post('http://127.0.0.1:8080/pedidos', pedidos);
  const pedido = respuesta.data;

  router.push({ name: 'SeleccionarProductos', params: { id_mesa: mesaId , pedido: pedido } });
  
};

const agregarMesa = async () => {
  if (mesaCompraRapida.value.length === 0) {
    try {
      const nuevaMesa = { ...mesa.value };
      const response = await axios.post('http://127.0.0.1:8080/mesa', nuevaMesa);
      await buscarMesas(nit); 
    } catch (error) {
      console.error("Error al agregar mesa rápida", error);
    }
  }
};

if (rol.value == "MESERO") {
  Rol.value = ref(true);
}

onMounted(async () => {
  await buscarMesas(nit);
  await agregarMesa(); 
});
</script>


<style>
  
  .compra-rapida-container {
    width: 16%; 
    height: 500px; 
    background-color: var(--color_principal); 
    border: 5px solid #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .compra-rapida {
    height: 500px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0; 
  }
  
  .compra-rapida img {
    width: 100%;
    height: 350px;
  }
  </style>
  

  