<template>
    <div class="contenedormesas">
        <tarjetamesas :nit="nit"></tarjetamesas>
        <comprarapida :nit="nit"></comprarapida>
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