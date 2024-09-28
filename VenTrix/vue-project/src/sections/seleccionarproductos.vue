<template>
    
    <div class="section">
        <menucategorias></menucategorias>
        <tarjetaproductos></tarjetaproductos>
    </div>
    <pago></pago>
</template>

<script setup>
import menucategorias from '@/components/menucategorias.vue';
import tarjetaproductos from '@/components/tarjetaproductos.vue';
import pago from '@/components/pago.vue';
</script>

<style>
.section {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;;
}
</style>

