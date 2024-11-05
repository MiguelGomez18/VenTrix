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
import { useRouter } from 'vue-router';

const props = defineProps({
  idrestaurante: {
    type: String,
    required: true
  }
});
const router = useRouter();
const mesa = ref({
  nombre: 'Mesa rapida',
  estado: 'RAPIDA',
  sucursal: {
    id: props.idrestaurante
  }
});
const mesaCompraRapida = ref([]); 

console.log(props.idrestaurante)

const buscarMesas = async (idrestaurante) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/mesa_rapida/${props.idrestaurante}`); 
    mesaCompraRapida.value = respuesta.data;
    console.log(mesaCompraRapida.value)
  } catch (error) {
    console.error("Error al cargar mesas", error);
  }
};

const navegarARuta = (mesaId) => {
  window.dispatchEvent(new Event('ocultarInicio'));
  router.push({ name: 'SeleccionarProductos', params: { id_mesa: mesaId } });
};

const agregarMesa = async () => {
  if (mesaCompraRapida.value == []) {
    const nuevaMesa = { ...mesa.value };
    console.log(mesa.value)
    const response = await axios.post('http://127.0.0.1:8080/mesa_rapida', nuevaMesa);
    mesaCompraRapida.value.push(response.data);
    console.log(mesaCompraRapida.value)
  }
  
};

onMounted(() => {
  buscarMesas(props.idrestaurante);
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
  

  