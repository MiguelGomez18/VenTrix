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
    flex-wrap: nowrap;
    justify-content: space-around;
    margin-left: auto;
    margin-right: auto;
  }
  
  .sidebar {
    width: 28%;
    color: black;
    padding: 1rem;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar .li{
    padding: 8px 12px;
    cursor: pointer;
    color: black;
    transition: background-color 0.3s;
    border-bottom: 1px solid;
    font-weight: bold;
    transition: ease-in 0.4s;
  }
  
  .sidebar .li:hover {
    background-color: #c7c7c7;
    border-radius: 10px;
    border: none;
    font-weight: bold;
    transition: ease-in 0.4s;
  }
  
  .content {
    width: 80%;
    padding: 1rem;
  }
</style>
  