<template>
  <v-app>
    <div class="contenedor-boton-flotante">
      <v-btn class="boton-flotante" color="green" large @click="alternarBotones">
        
        <img src="../components/icons/ecommerce-price-shop-svgrepo-com.svg" class="imagen-icono" alt="Icono de Menú" />
      </v-btn>

      <div v-if="mostrarBotones" class="contenedor-botones">
        <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('RegistroProductos')">
          <img src="./icons/edit-svgrepo-com.svg" class="imagen-icono" />
          <span>Registro Productos</span>
        </v-btn>
        <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('Sucursal')">
          <img src="./icons/edit-clipboard-svgrepo-com.svg" class="imagen-icono" />
          <span>Registro Sucursal</span>
        </v-btn>
        <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('RegistroAdmin')">
          <img src="./icons/edit-svgrepo-com.svg" class="imagen-icono" />
          <span>Registro Admin</span>
        </v-btn>
        <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('TarjetasSucursales')">
          <img src="./icons/store-bar-svgrepo-com (1).svg" class="imagen-icono" />
          <span>Sucursales</span>
        </v-btn>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { useCart } from '@/stores/cart';

const mostrarBotones = ref(false);
const router = useRouter(); 
const cart = useCart();
const restaurante = cart.restaurante;

const alternarBotones = () => {
  mostrarBotones.value = !mostrarBotones.value;
};

const navegarARuta = (name) => {
  window.dispatchEvent(new Event('ocultarInicio')); 
  if (name == 'TarjetasSucursales') {
    router.push({ name: name, params: { idrestaurante: restaurante } });
  } 
  router.push({ name: name});
};
</script>

<style scoped>
/* Contenedor principal */
.contenedor-boton-flotante {
  position: fixed;
  
  margin-top: 7px;/* Cambiado de margin-top a top para mejor control */
  z-index: 1000;
}

/* Botón flotante principal (verde) */
.boton-flotante {
  cursor: pointer;
  background-color: #c0c6c8;
  position: relative;
  z-index: 10;
  font-size: 24px;
  width: 70px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.boton-flotante:hover {
  border-bottom: 8px outset rgb(50, 169, 50);
  transition: 0.1s;
}

/* Resto de tus estilos se mantienen igual */
.imagen-icono {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.contenedor-botones {
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: 80px;
  display: flex;
  margin-left: 72px;
  flex-direction: column;
  gap: 15px;
  align-items: flex-end;
}

.boton-secundario {
  font-size: 14px;
  min-width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 5px;
  padding: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  white-space: normal;
  word-wrap: break-word;
}


@media (max-width: 819px) {
  .contenedor-boton-flotante {
  position: fixed;
  left: 10px;
  top: 93%; /* Cambiado de margin-top a top para mejor control */
  z-index: 1000;
}

}
</style>