<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <menuinteractivo></menuinteractivo>
    <router-view></router-view>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import menuinteractivo from '@/components/menuinteractivo.vue';
</script>

<style>
.contenido {
    margin-top: 80px;
}
@media (max-width: 768px) {
  .contenido {
    margin-top: 60px;
  }
}
</style>