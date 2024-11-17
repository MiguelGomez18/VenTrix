<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <menumesa></menumesa>
    <router-view></router-view>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import menumesa from '@/components/menumesa.vue';
</script>

<style>
.contenido {
    margin-top: 80px;
}
</style>