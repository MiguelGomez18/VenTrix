<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <router-view></router-view>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
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