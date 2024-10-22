<template>
  <div class="container">
    <div class="mesas-container">
      <v-btn
        v-for="mesa in mesas"
        :key="mesa.id"
        class="mesas"
        color="green darken-1"
        large
        @click="navegarARuta(mesa.id)"
      >
        <img src="./icons/table-svgrepo-com (1).svg" alt="Mesa Icon" />
        <span>{{ mesa.nombre }}</span>
      </v-btn>
    </div>

    <div class="compra-rapida-container">
      <v-btn
        v-if="mesaCompraRapida"
        class="compra-rapida"
        color="blue darken-1"
        large
        @click="navegarARuta(mesaCompraRapida.id)"
      >
        <img src="./icons/icons8-pagado-50.png" alt="Compra Rápida Icon" />
        <span>{{ mesaCompraRapida.nombre }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const mesas = ref([]);
const mesaCompraRapida = ref(null); // Aquí almacenamos la mesa de compra rápida

const navegarARuta = (mesaId) => {
  window.dispatchEvent(new Event('ocultarInicio'));
  router.push({ name: 'SeleccionarProductos', params: { id_mesa: mesaId } });
};

const obtenerMesas = async () => {
  try {
    const response = await axios.get('http://localhost:8000/compra_rapida');
    const todasLasMesas = response.data;

    
    mesas.value = todasLasMesas.filter(mesa => mesa.nombre.trim().toLowerCase() !== 'compra rapida');
    mesaCompraRapida.value = todasLasMesas.find(mesa => mesa.nombre.trim().toLowerCase() === 'compra rapida') || null;

  } catch (error) {
    console.error('Error al obtener las mesas:', error);
  }
};

onMounted(() => {
  obtenerMesas();
});
</script>


  
  <style scoped>
  .container {
    display: flex; 
  }
  
  .mesas-container {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
  }
  
  .mesas {
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f0f0f0;
    border: 5px solid var(--color_principal);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin: 20px;
    background-color: black;
    padding: 5px;
  }
  
  .compra-rapida-container {
    position: fixed; /* Fija el contenedor a la pantalla */
    right: 0; /* Posición desde el lado derecho */
    top: 100px; /* Ajusta según la altura de cualquier encabezado */
    width: 150px; 
    background-color: #f0f0f0; 
    border: 5px solid var(--color_principal);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin-right: 30px;
  }
  
  .compra-rapida {
    width: 90%; 
    height: 300px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0; 
  }
  
  .mesas img, .compra-rapida img {
    width: 100px;
    height: 100px;
  }
  </style>
  

  