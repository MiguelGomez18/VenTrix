<template>
    <div class="contenedor-principal">
    <!-- MESAS A LA IZQUIERDA -->
    <div class="contenedor-mesas" :style="{ '--tamaño-section3': `${mesa}%` }">
      <tarjetamesas :nit="nit" :rol="rol" />
    </div>

    <!-- MESA RÁPIDA A LA DERECHA -->
    <div class="contenedor-mesa-rapida" :style="{ '--tamaño-section4': `${rapida}%` }">
      <comprarapida :nit="nit" :rol="rol" />
    </div>
  </div>
 
</template>



<script setup>
import { defineProps } from 'vue';
import tarjetamesas from '@/components/tarjetamesas.vue';
import comprarapida from '@/components/comprarapida.vue';
import { useCart } from '@/stores/cart';

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
const cart = useCart();
const rol = cart.rol;

let mesa = 65; 
let rapida = 25;

if (cart.rol == "MESERO") {
  mesa = 100;
  rapida = 0;
}
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
    position: relative;
    top: 60px;
    flex-wrap: nowrap;
    justify-content: center;
    padding: 0px;
    gap: 0;
  }

  .contenedor-mesa-rapida {
    width: var(--tamaño-section4);
    min-width: 0%;
    margin-bottom: 20px;
  }

  .contenedor-mesas {
    width: var(--tamaño-section3);
    min-width: 0%;
  }
}


</style>
