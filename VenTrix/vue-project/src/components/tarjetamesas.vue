<template>
  <div class="mesas-container">
    <v-btn
      v-for="mesa in mesas"
      :key="mesa.id"
      class="mesas"
      color="green darken-1"
      large
      @click="navegarARuta('/cuerpo/seleccionarproductos')"
    >
      <img src="./icons/table-svgrepo-com (1).svg" alt="Mesa Icon" />
      <span>{{ mesa.nombre }}</span>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const mesas = ref([]); 


const navegarARuta = (ruta) => {
  window.dispatchEvent(new Event('ocultarInicio'));
  router.push(ruta);
};


const obtenerMesas = async () => {
  try {
    const response = await axios.get('http://localhost:8000/mesas'); 
    mesas.value = response.data; 
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
  }
};


onMounted(() => {
  obtenerMesas();
});
</script>

<style scoped>
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
}

.mesas img {
  width: 100px;
  height: 100px;
}
</style>