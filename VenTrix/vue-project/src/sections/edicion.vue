<template>
    <div class="contenedorpadre">
        <productos></productos>
        <tablacategoria></tablacategoria>
        <tablamesas></tablamesas>
        <pagosedicion></pagosedicion>
    </div>
    <div v-if="mostrar" class="contenedor-boton-flotante1">
        <v-btn class="boton-flotante1" color="green" large @click="navegarARuta('InformesAdmin')">
          <img src="../components/icons/data-svgrepo-com.svg" class="imagen-icono" alt="Icono de Menú" />
        </v-btn>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { useCart } from '@/stores/cart';
import productos from '@/components/productos.vue';
import tablacategoria from '@/components/tablacategoria.vue';
import tablamesas from '@/components/tablamesas.vue';
import pagosedicion from '@/components/pagosedicion.vue';

const router = useRouter(); 
const cart = useCart();
const mostrar = ref(false)

if (cart.rol == "ADMINISTRADOR") {
    mostrar.value = true;
}

const navegarARuta = (name) => {
  window.dispatchEvent(new Event('ocultarInicio')); 
  router.push({ name: name });
};
</script>

<style>
.contenedorpadre{
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 80%;
    margin-left: 140px;
    margin-bottom: 80px;
}

.contenedor-boton-flotante1 {
    position: relative;
    top: 100px;
    right: 50px; 
    z-index: 10;
  }

  .boton-flotante1 {
    cursor: pointer;
    background-color: #d8d8d8;
    position: fixed;
    top: 100px;
    right: 50px; 
    z-index: 10;
    font-size: 24px; 
    width: 70px;     
    height: 70px;    
    border-radius: 50%; 
    display: flex;
    justify-content: center; 
    align-items: center;  
  }

</style>