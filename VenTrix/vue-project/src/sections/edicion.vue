<template>
    <div class="contenedorpadre">
        <productos></productos>
        <tablacategoria></tablacategoria>
        <tablamesas></tablamesas>
    </div>
    
</template>

<script setup>
import productos from '@/components/productos.vue';
import tablacategoria from '@/components/tablacategoria.vue';
import tablamesas from '@/components/tablamesas.vue';
</script>

<style>
.contenedorpadre{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 80%;
    justify-content: center;
    margin-left: 10%;
}
</style>