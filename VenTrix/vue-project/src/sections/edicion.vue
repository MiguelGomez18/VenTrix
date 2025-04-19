<template>
    <div class="contenedorpadre1">
        <productos :mostrar="mostrar"></productos>
        <tablacategoria :mostrar="mostrar"></tablacategoria>
        <tablamesas :mostrar="mostrar"></tablamesas>
        <pagosedicion :mostrar="mostrar"></pagosedicion>
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
.contenedorpadre1 {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1000px;
  width: 90%;
  margin: auto;
  margin-bottom: 80px;
  padding: 0 20px;
}

.contenedor-boton-flotante1 {
  position: fixed;
  top:50px;
  right: 20px;
  z-index: 20;
}

/* Botón flotante estilo */
.boton-flotante1 {
  cursor: pointer;
  background-color: #d8d8d8;
  font-size: 24px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Botón en flujo normal solo visible en pantallas pequeñas */
.boton-informes-responsive {
  display: none;
  text-align: right;
  margin-top: 20px;
  margin-right: 20px;
}

/* Mostrar versión responsiva y ocultar botón flotante si ancho <= 819px */
@media (max-width: 819px) {
  .boton-flotante1 {
    width: 60px;
    height: 60px;
    font-size: 20px;
  }

  .boton-flotante1 img {
    width: 24px;
    height: 24px;
  }
}

  

</style>