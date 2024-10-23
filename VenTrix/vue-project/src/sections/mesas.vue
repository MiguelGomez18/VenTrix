<template>
    <div class="contenedormesas">
        <tarjetamesas :nit="nitSucursal"></tarjetamesas>
        <comprarapida :nit="nitSucursal"></comprarapida>
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
  }
});
const { nit } = props;
console.log(nit)
const nitSucursal = nit;

</script>

<style>
.contenedormesas{
    width: 95%;
    display: flex;
    justify-content: space-evenly;
    margin-left: auto;
    margin-right: auto;
}
</style>