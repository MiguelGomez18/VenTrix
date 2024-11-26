<template>
  <div class="cuadro1" :style="{ '--tamaño-section2': `${tamaño}%` }">
    <div class="section1">
      <menucategorias v-if="nomostrar" :nit="nit"></menucategorias>
      <tarjetaproductos v-if="nomostrar" :pedido="props.pedido" :nit="nit"></tarjetaproductos>
    </div>
    <div class="section2">
      <carritocompras :pedido="props.pedido" :rol="rol" @open-payment-modal="openModal"></carritocompras>
      <pago v-if="showModal" @close-modal="closeModal" :pedido="props.pedido"></pago>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import menucategorias from '@/components/menucategorias.vue';
import carritocompras from '@/components/carritocompras.vue';
import tarjetaproductos from '@/components/tarjetaproductos.vue';
import pago from '@/components/pago.vue';
import { useCart } from '@/stores/cart';

const props = defineProps({
  pedido: {
    type: String,
    required: true
  }
});

const cart = useCart();
const nit = cart.nit;
const rol = cart.rol;
const rapida = cart.rapida;

const showModal = ref(false);
const nomostrar = ref(false);
let tamaño = 100; 

if (cart.rol === "MESERO" || cart.rapida == "RAPIDA") {
  nomostrar.value = true;
  tamaño = 40;
}

const openModal = () => {
  showModal.value = true; 
  console.log("Modal abierto:", showModal.value);
};

const closeModal = () => {
  showModal.value = false;
  console.log("Modal cerrado desde el padre:", showModal.value);
};
</script>
  
  <style>
  .cuadro1 {
  margin: 0 auto 80px;
  width: 88%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 15px;
  flex-wrap: nowrap;
}

.section1 {
  width: calc(100% - var(--tamaño-section2, 40%));
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.section2 {
  position: sticky;
  top: 75px;
  width: var(--tamaño-section2, 40%); 
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
  background: #fff;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .cuadro1 {
    flex-direction: column;
  }
  .section1,
  .section2 {
    width: 100%;
  }
  .section2 {
    position: relative;
  }
}

  </style>
  
  