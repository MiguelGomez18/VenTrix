<template>
  <div class="padre">

    <informesemana></informesemana>
    <informeanual></informeanual>

  </div>
  <div class="padredos">

    <informeproductosdia></informeproductosdia>
    <informecategoria></informecategoria>

  </div>

  
</template>

<script setup>
import informesemana from '@/components/informesemana.vue';
import informeanual from '@/components/informeanual.vue';
import informeproductosdia from '@/components/informeproductosdia.vue';
import informecategoria from '@/components/informecategoria.vue';
</script>

<style>
.padre{
  display: flex;
  width: 100%;
}

.padredos{
  display: flex;
  width: 100%;
}
</style>