<template>
    <div class="contenedormesas">
        <tarjetamesas :nit="nit" :rol="rol"></tarjetamesas>
        <comprarapida :nit="nit" :rol="rol"></comprarapida>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import tarjetamesas from '@/components/tarjetamesas.vue';
import comprarapida from '@/components/comprarapida.vue';
const props = defineProps({
  nit: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  }
});
const { nit } = props;
const { rol } = props;
console.log(rol);

</script>

<style>
.contenedormesas{
    width: 95%;
    display: flex;
    justify-content: space-evenly;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 80px;
}
</style>