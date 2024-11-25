<template>
    <headercuerpo></headercuerpo>
    <div class="contenido1"></div>
    <menumesa></menumesa>
    <router-view></router-view>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import menumesa from '@/components/menumesa.vue';
</script>

<style>
.contenido1 {
    position: sticky;
    top: 0px;
    z-index: 8;
    height: 90px;
    background-color: white;
}
</style>