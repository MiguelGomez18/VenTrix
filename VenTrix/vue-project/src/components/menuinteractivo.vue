<template>
    <v-app>
      <div class="contenedor-boton-flotante">
        <v-btn class="boton-flotante" color="green" large @click="alternarBotones">
          <img src="../components/icons/ecommerce-price-shop-svgrepo-com.svg" class="imagen-icono" alt="Icono de Menú" />
        </v-btn>
  
        <div v-if="mostrarBotones" class="contenedor-botones">
          <v-btn class="boton-secundario" color="green darken-3" large @click="navegarARuta('RegistroSucursal')">
            <img src="./icons/edit-svgrepo-com.svg" class="imagen-icono" />
            <span>Registro</span>
          </v-btn>
          <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('Informes')">
            <img src="./icons/data-svgrepo-com.svg" class="imagen-icono" />
            <span>Informes</span>
          </v-btn>
          <v-btn class="boton-secundario" color="green darken-3" large @click="navegarARuta('Edicion')">
            <img src="./icons/edit-svgrepo-com.svg" class="imagen-icono" />
            <span>Edicion</span>
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
const nit = cart.nit;

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
  if (name == 'RegistroSucursal') {
    router.push({ name: name, params: { nit: nit } });
  }
  router.push({ name: name });
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
  
  <style>
  /* Estilos para el contenedor del botón flotante */
  .contenedor-boton-flotante {
    position: relative;
    bottom: 20px;
    left: 20px; 
    z-index: 2;
  }
  
  /* Estilos del botón flotante principal */
  .boton-flotante {
    cursor: pointer;
    background-color: #c0c6c8;
    position: fixed;
    bottom: 20px;
    left: 20px; 
    z-index: 10;
    font-size: 24px; 
    width: 70px;     
    height: 70px;    
    border-radius: 50%; 
    display: flex;
    justify-content: center; 
    align-items: center;     
  }
  .boton-flotante:hover {
    border-bottom: 8px outset rgb(50, 169, 50);
    transition: 0.1s;
  }
  
  /* Ajustar la imagen al tamaño completo del botón */
  .imagen-icono {
    width: 40px;
    height: 40px;
    object-fit: contain; 
  }
  
  /* Contenedor de los botones secundarios */
  .contenedor-botones {
    cursor: pointer;
    position: fixed;
    bottom: 100px; 
    left: 20px;    
    display: flex;
    flex-direction: column;
    gap: 15px; }
  
  /* Estilos para los botones secundarios */
  .boton-secundario {
    font-size: 14px;  
    width: 60px;      
    height: 60px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;     
    text-align: center;      
    gap: 5px;         
}
</style>