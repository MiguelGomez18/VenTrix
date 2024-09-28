<template>
    <div class="cuadro1">
      <div class="section">
        <menucategorias></menucategorias>
        <tarjetaproductos></tarjetaproductos>
      </div>
      <div class="section1">
        <carritocompras @open-payment-modal="openModal"></carritocompras>
      </div>
      <pago v-if="showModal" @close-modal="closeModal"></pago>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import menucategorias from '@/components/menucategorias.vue';
  import carritocompras from '@/components/carritocompras.vue';
  import tarjetaproductos from '@/components/tarjetaproductos.vue';
  import pago from '@/components/pago.vue';
  
  const showModal = ref(false);
  
  const openModal = () => {
  showModal.value = true; // Abre el modal
  console.log("Modal abierto:", showModal.value);
};

const closeModal = () => {
  showModal.value = false; // Cierra el modal
  console.log("Modal cerrado desde el padre:", showModal.value);
};

  </script>
  
  
  <style>
  .cuadro1 {
      margin-left: auto;
      margin-right: auto;
      width: 95%;
      display: flex;
      justify-content: space-evenly;
      align-items: start;
      flex-wrap: nowrap;
      gap: 10px;
  }
  .section {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
  }
  .section1 {
      width: 30%;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
  }
  </style>
  