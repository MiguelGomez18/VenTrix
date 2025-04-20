<template>
  <div class="dashboard">
    <aside class="sidebar">
      <ul>
        <li class="li" @click="clic('EditUsuario')">Usuario</li>
        <li v-if="!habilitado1" class="li" @click="clic('EditSucursal')">Sucursal</li>
        <li v-if="!habilitado2" class="li" @click="clic('EditRestaurante')">Restaurante</li>
        <li v-if="!habilitado3" class="li" @click="clic('Empleados')">Empleados</li>
      </ul>
    </aside>
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { useCart } from '@/stores/cart';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const cart = useCart();
  const habilitado1 = ref(true);
  const habilitado2 = ref(true);
  const habilitado3 = ref(true);
  
  const clic = (name) => {
    console.log(name);
    console.log(cart.rol);
    
    if (cart.rol === "CAJERO" || cart.rol == "MESERO" && name === 'EditUsuario') {
      router.push({ name: 'EditUsuarioMesero' })
    } else if (cart.rol === "COCINERO" && name === 'EditUsuario') {
      router.push({ name: 'EditUsuarioCocinero' })
    } 
    
    if (cart.rol == "ADMINISTRADOR_SUCURSAL" ) {
      router.push({ name: name })  
    }

    if (cart.rol == "ADMINISTRADOR" && name === 'EditUsuario') {
      router.push({ name: 'EditUser' })
    } else if (cart.rol == "ADMINISTRADOR" && name === 'EditSucursal') {
      router.push({ name: 'EditSucu' })
    } else if (cart.rol == "ADMINISTRADOR" && name === 'EditRestaurante') {
      router.push({ name: 'EditResta' })
    } else if (cart.rol == "ADMINISTRADOR" && name === 'Empleados') {
      router.push({ name: 'Empleadoss' })
    }
    
  }

  if (cart.rol == "ADMINISTRADOR_SUCURSAL") {
    habilitado1.value = false;
    habilitado3.value = false;
  } else if (cart.rol == "ADMINISTRADOR") {
    habilitado2.value = false;
    habilitado3.value = false;
  } {
    
  }
</script>
  
<style scoped>
  .dashboard {
    width: 85%;
    display: flex;
    flex-wrap: nowrap; /* Cambiado de nowrap a wrap para responsive */
    justify-content: space-around;
    margin-left: auto;
    margin-right: auto;
  }
  
  .sidebar {
    width: 28%; /* Ocupa todo el ancho en móvil */
    color: black;
    padding: 1rem;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
    display: flex; /* Convierte la lista en horizontal */
    flex-wrap: wrap; /* Evita que los items se envuelvan */
    gap: 10px; /* Espacio entre items */
  }
  
  .sidebar .li {
    padding: 8px 12px;
    width: 100%;
    cursor: pointer;
    color: black;
    transition: background-color 0.3s;
    border-bottom: 1px solid;
    font-weight: bold;
    transition: ease-in 0.4s;
    white-space: nowrap; /* Evita que el texto se divida en múltiples líneas */
  }
  
  .sidebar .li:hover {
    background-color: #c7c7c7;
    border-radius: 10px;
    border: none;
    font-weight: bold;
    transition: ease-in 0.4s;
  }
  
  .content {
    width: 100%; /* Ocupa todo el ancho en móvil */
    padding: 1rem;
  }

  /* Estilos para pantallas grandes (escritorio) */
  @media (max-width: 768px) {
    .contenido {
      margin-top: 20px;
    }
    .dashboard {
      margin-top: 0;
      margin-bottom: 80px;
      flex-wrap: wrap; /* Vuelve a la disposición original */
    }
    
    .sidebar {
      width: 100%; /* Ancho original para desktop */
    }
    
    .sidebar ul {
      display: block; /* Vuelve a lista vertical */
    }
    
    .content {
      width: 100%; /* Ancho original para desktop */
      padding: 0;
    }
    
    .sidebar .li {
      border-bottom: 1px solid; /* Restaura el borde inferior */
      margin-bottom: 5px; /* Espacio entre items verticales */
    }
  }
</style>
  