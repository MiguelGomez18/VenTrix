<template>
  <div class="compra-rapida-container">
    <v-btn
      v-if="mesaCompraRapida"
      class="compra-rapida"
      color="blue darken-1"
      large
      @click="navegarARuta(mesaCompraRapida[0].id)"
    >
      <img src="./img/mesa.png" alt="Compra Rápida Icon" />
      <span>{{ mesaCompraRapida.nombre }}</span>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import { useCart } from '../stores/cart';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = useCart();
const nit = cart.nit; 
const mesa = ref({
  nombre: 'Mesa Rapida',
  estado: 'RAPIDA',
  sucursal: {
    id: nit
  }
});
const mesaCompraRapida = ref([]); 

console.log(nit)

const buscarMesas = async (nit) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/mesa/mesa_rapida/id_sucursal/${nit}`); 
    mesaCompraRapida.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar mesas", error);
  }
};

const navegarARuta = (mesaId) => {
  window.dispatchEvent(new Event('ocultarInicio'));
  router.push({ name: 'SeleccionarProductos', params: { id_mesa: mesaId, nit } });
};

const agregarMesa = async () => {
  if (mesaCompraRapida.value == []) {
    const nuevaMesa = { ...mesa.value };
    console.log(mesa.value)
    const response = await axios.post('http://127.0.0.1:8080/mesa', nuevaMesa);
    mesaCompraRapida.value.push(response.data);
    console.log(mesaCompraRapida.value)
  }
};

onMounted(() => {
  buscarMesas(nit);
  agregarMesa();
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
  

  