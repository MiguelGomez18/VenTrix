<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <tarjetassucursales :idrestaurante="idrestaurante"></tarjetassucursales>
    <menuinteractivo></menuinteractivo>
    <router-view></router-view>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import menuinteractivo from '@/components/menuinteractivo.vue';
import tarjetassucursales from '@/components/tarjetassucursales.vue';
import { defineProps } from 'vue';

const props = defineProps({
  idrestaurante: {
    type: String,
    required: true
  }
});
const { idrestaurante } = props;
</script>

<style>
.contenido {
    margin-top: 80px;
}
</style>