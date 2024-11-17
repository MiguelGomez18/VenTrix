<template>
    <v-app>
      <div class="contenedor-boton-flotante">
        <v-btn class="boton-flotante" color="green" large @click="navegarARuta('MesasMesero')">
          <img src="../components/icons/table-svgrepo-com.svg" class="imagen-icono" alt="Icono de Menú" />
        </v-btn>
      </div>
    </v-app>
  </template>
  
  <script setup>
import { useRouter } from 'vue-router'; 
import { useCart } from '@/stores/cart';

const router = useRouter(); 
const cart = useCart();
const nit = cart.nit;

const navegarARuta = (name) => {
  window.dispatchEvent(new Event('ocultarInicio')); 
  router.push({ name: name, params: { nit: nit, rol: "MESERO" } });
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