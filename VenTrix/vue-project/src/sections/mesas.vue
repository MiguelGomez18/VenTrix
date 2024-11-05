<template>
    <div class="contenedormesas">
        <tarjetamesas :idrestaurante="nitSucursal"></tarjetamesas>
        <comprarapida :idrestaurante="nitSucursal"></comprarapida>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import tarjetamesas from '@/components/tarjetamesas.vue';
import comprarapida from '@/components/comprarapida.vue';
const props = defineProps({
  idrestaurante: {
    type: String,
    required: true
  }
});
const { idrestaurante } = props;
console.log(idrestaurante)
const nitSucursal = idrestaurante;

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