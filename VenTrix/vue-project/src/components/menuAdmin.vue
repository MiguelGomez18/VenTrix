<template>
    <v-app>
      <div class="contenedor-boton-flotante">
        <v-btn class="boton-flotante" color="green" large @click="alternarBotones">
          <img src="../components/icons/ecommerce-price-shop-svgrepo-com.svg" class="imagen-icono" alt="Icono de Menú" />
        </v-btn>
  
        <div v-if="mostrarBotones" class="contenedor-botones">
          <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('Sucursal')">
            <img src="./icons/edit-clipboard-svgrepo-com.svg" class="imagen-icono" />
            <span>Registro Sucursal</span>
          </v-btn>
          <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('RegistroAdmin')">
            <img src="./icons/edit-svgrepo-com.svg" class="imagen-icono" />
            <span>Registro Admi</span>
          </v-btn>
          <v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('TarjetasSucursales')">
            <img src="./icons/store-bar-svgrepo-com (1).svg" class="imagen-icono" />
            <span>Sucursales</span>
          </v-btn>
          <!--<v-btn class="boton-secundario" color="green darken-2" large @click="navegarARuta('InformesAdmin')">
            <img src="./icons/data-svgrepo-com.svg" class="imagen-icono" />
            <span>Informes</span>
          </v-btn>-->
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