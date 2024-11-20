<template>
    <div class="contenedorpadre">
        <productos></productos>
        <tablacategoria></tablacategoria>
        <tablamesas></tablamesas>
        <pagosedicion></pagosedicion>
    </div>
</template>

<script setup>
import productos from '@/components/productos.vue';
import tablacategoria from '@/components/tablacategoria.vue';
import tablamesas from '@/components/tablamesas.vue';
import pagosedicion from '@/components/pagosedicion.vue';
</script>

<style>
.contenedorpadre{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 90%;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 80px;
}
</style>