<template>
    <div class="section">
        <tarjetaproductos></tarjetaproductos>
    </div>
    <pago></pago>
</template>

<script setup>
import tarjetaproductos from '@/components/tarjetaproductos.vue';
import pago from '@/components/pago.vue';
</script>

<style>
.section {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 10px;;
}
</style>

