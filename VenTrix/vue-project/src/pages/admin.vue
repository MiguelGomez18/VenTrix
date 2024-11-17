<template>
    <headercuerpo></headercuerpo>
    <div class="contenido"></div>
    <router-view></router-view>
    <menuAdmin></menuAdmin>
    <div class="contenido"></div>
</template>

<script setup>
import headercuerpo from '@/components/headercuerpo.vue';
import menuAdmin from '@/components/menuAdmin.vue';
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