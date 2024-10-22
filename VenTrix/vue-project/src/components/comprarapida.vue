<template>
  <div class="compra-rapida-container">
    <v-btn
      v-if="mesaCompraRapida"
      class="compra-rapida"
      color="blue darken-1"
      large
      @click="navegarARuta(mesaCompraRapida[0].id)"
    >
      <img src="./icons/icons8-pagado-50.png" alt="Compra Rápida Icon" />
      <span>{{ mesaCompraRapida.nombre }}</span>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const mesa = ref({
  nombre: 'Mesa rapida',
  estado: 'Rapida'
});
const mesaCompraRapida = ref([]); 

const buscarMesas = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8000/mesarapida'); 
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
  const nuevaMesa = { ...mesa.value };
  const response = await axios.post('http://127.0.0.1:8000/registrar_mesa', nuevaMesa);

  mesaCompraRapida.value.push(response.data);
};

onMounted(() => {
  buscarMesas();
  agregarMesa();
});
</script>

<style>
  
  .compra-rapida-container {
    width: 18%; 
    height: 500px; 
    background-color: #f0f0f0; 
    border: 5px solid var(--color_principal);
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
    width: 100px;
    height: 100px;
  }
  </style>
  

  