<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <tarjetassucursales></tarjetassucursales>
    <menuinteractivo></menuinteractivo>
    <router-view></router-view>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import menuinteractivo from '@/components/menuinteractivo.vue';
import tarjetassucursales from '@/components/tarjetassucursales.vue';
</script>

<style>
.contenido {
    margin-top: 80px;
}
</style>