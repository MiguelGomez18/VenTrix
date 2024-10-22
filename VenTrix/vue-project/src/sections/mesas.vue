<template>
    <div class="contenedormesas">
        <tarjetamesas></tarjetamesas>
        <comprarapida></comprarapida>
    </div>
</template>

<script setup>
import tarjetamesas from '@/components/tarjetamesas.vue';
import comprarapida from '@/components/comprarapida.vue';
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