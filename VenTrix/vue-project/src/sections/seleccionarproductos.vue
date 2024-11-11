<template>
    <div class="cuadro1">
      <div class="section1">
        <menucategorias :idrestaurante="idrestaurante"></menucategorias>
        <tarjetaproductos :idrestaurante="idrestaurante"></tarjetaproductos>
      </div>
      <div class="section2">
        <carritocompras @open-payment-modal="openModal"></carritocompras>
        <pago v-if="showModal" @close-modal="closeModal"></pago>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import menucategorias from '@/components/menucategorias.vue';
  import carritocompras from '@/components/carritocompras.vue';
  import tarjetaproductos from '@/components/tarjetaproductos.vue';
  import pago from '@/components/pago.vue';
  import { useCart } from '@/stores/cart';

  const cart = useCart();
  const idrestaurante = cart.restaurante;
  console.log(idrestaurante)
  
  const showModal = ref(false);
  
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
      margin-left: auto;
      margin-right: auto;
      width: 88%;
      display: flex;
      justify-content: space-evenly;
      align-items: start;
      flex-wrap: nowrap;
      gap: 15px;
  }
  .section1 {
      width: 60%;
      display: flex;
      justify-content: start;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
  }
  .section2 {
      width: 40%;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
  }
  </style>
  