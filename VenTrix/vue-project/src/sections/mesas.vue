<template>
    <div class="contenedor-principal">
    <!-- MESAS A LA IZQUIERDA -->
    <div class="contenedor-mesas">
      <tarjetamesas :nit="nit" :rol="rol" />
    </div>

    <!-- MESA RÁPIDA A LA DERECHA -->
    <div class="contenedor-mesa-rapida">
      <comprarapida :nit="nit" :rol="rol" />
    </div>
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
</script>

<style scoped>
.contenedor-principal {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
}

/* LADO IZQUIERDO - MESAS */
.contenedor-mesas {
  flex: 1;
  min-width: 300px;
}

/* LADO DERECHO - MESA RÁPIDA */
.contenedor-mesa-rapida {
  width: 300px;
  min-width: 250px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  z-index: 10;
}

/* RESPONSIVE */
@media (max-width: 819px) {
  .contenedor-principal {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .contenedor-mesa-rapida {
    width: 100%;
    position: relative;
    top: 0;
    order: -1; /* Mover arriba */
    margin-bottom: 20px;
  }

  .contenedor-mesas {
    width: 100%;
  }
}


</style>
