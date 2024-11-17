<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <pedidos></pedidos>
    <router-view></router-view>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import pedidos from '@/components/pedidos.vue';
</script>

<style>
.contenido {
    margin-top: 80px;
}
</style>