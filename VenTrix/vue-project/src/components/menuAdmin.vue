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
    <div v-if="mostrarBotones" class="boton-salir" :class="{ show: mostrarBotones }" ref="mostrarbotonRef"></div>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'; 
import { useCart } from '@/stores/cart';

const mostrarBotones = ref(false);
const mostrarbotonRef = ref(null);
const router = useRouter(); 
const cart = useCart();
const restaurante = cart.restaurante;

const alternarBotones = () => {
  mostrarBotones.value = !mostrarBotones.value;
};

const handleClickOutside = (event) => {
  if (mostrarbotonRef.value && !mostrarbotonRef.value.contains(event.target)) {
    const userIcon = document.querySelector('.contenedor-boton-flotante');
    const boton = document.querySelector('.contenedor-botones');
    if (event.target !== userIcon && !userIcon.contains(event.target) || boton.contains(event.target)) {
      mostrarBotones.value = false;
    }
  }
};

const navegarARuta = (name) => {
  window.dispatchEvent(new Event('ocultarInicio')); 
  if (name == 'TarjetasSucursales') {
    router.push({ name: name, params: { idrestaurante: restaurante } });
  } 
  router.push({ name: name});
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Contenedor principal */
.contenedor-boton-flotante {
  position: fixed;
  margin-top: 7px;
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
  left: 15px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-end;
}

.boton-secundario {
  font-size: 14px;
  min-width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 5px;
  padding: 8px;
}

.boton-salir {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  padding: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-evenly;
  transition: all 0.3s ease;
}

.boton-salir.show {
  opacity: 0;
  pointer-events: auto;
}

@media (max-width: 819px) {
    .contenedor-boton-flotante {
      margin: 0;
      bottom: 10px;
      left: 10px; 
    }
    .boton-flotante {
      bottom: auto;
      left: auto; 
      width: 60px;     
      height: 60px;      
    }
    .imagen-icono {
      width: 35px;
      height: 35px; 
    }
    .contenedor-botones {
      bottom: 80px; 
      left: auto;    
      gap: 5px; 
    }
    
    .boton-secundario {
      font-size: 11px;  
      gap: 1px;      
      width: 60px;
      height: 60px;
      min-width: 30px;
      min-height: 60px;
      height: auto;
      background-color: #c0c6c8;
      padding: 2px;
    }
    .boton-secundario img {
      width: 30px;
      height: 30px; 
    }
}
</style>