<template>
  <heade v-if="visible"></heade>
  <router-view></router-view>
  <mai v-if="visible"></mai>
  <sobrenosotros v-if="visible"></sobrenosotros>
  <membresias v-if="visible"></membresias>
  <foote v-if="visible"></foote>
</template>
  
<script setup>
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import heade from '@/components/header.vue';
  import mai from '@/components/main.vue';
  import sobrenosotros from '@/components/sobrenosotros.vue';
  import membresias from '@/components/membresias.vue';
  import foote from '@/components/footer.vue';

  const rutasnomostrar=['/registro', '/cuerpo', '/cuerpo/mesas', '/cuerpo/seleccionarproductos', '/cuerpo/edicion', '/cuerpo/informes'];
  const ruta=useRoute()
  const visible = ref(true);

watch(
  () => ruta.path,
  (nuevaRuta) => {
    visible.value = !rutasnomostrar.includes(nuevaRuta);
  },
  { immediate: true }
);
  
  </script>
  
  <style>
  
  </style>