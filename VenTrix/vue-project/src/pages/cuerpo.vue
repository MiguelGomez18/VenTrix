<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <menuinteractivo></menuinteractivo>
    <router-view></router-view>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import menuinteractivo from '@/components/menuinteractivo.vue';
</script>

<style>
.contenido {
    margin-top: 80px;
}
</style>