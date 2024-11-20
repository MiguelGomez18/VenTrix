<template>
  <header class="header1">
    <nav class="nav1">
      <div class="logo1">
        <img src="" alt="" />
        <a href="">VENTRIX</a>
      </div>
      <a href="#menu" class="target">
        <img
          src="../components/icons/Menu_icon_2_icon-icons.com_71856.svg"
          class="icon"
        />
      </a>
      <ul class="ul">
        <a href=""><img src="../components/icons/icons8-whatsapp-48.png" alt="WhatsApp"></a>
        <a href=""><img src="../components/icons/icons8-instagram-48.png" alt="Instagram"></a>
        <a href=""><img src="../components/icons/icons8-facebook-48 (1).png" alt="Facebook"></a>
        <li><a class="a1" href=""><router-link class="link" to="">SOPORTE</router-link></a></li>
      </ul>
      <div class="user-container">
        <img 
          class="user1" 
          src="./icons/icons8-user-48.png" 
          alt="User" 
          @click="toggleUserMenu"
        />
        <div v-if="showUserMenu" class="user-menu">
          <p><strong>Nombre:</strong> {{ userData.nombre }}</p>
          <p><strong>Email:</strong> {{ userData.correo }}</p>
          <p><strong>Rol:</strong> {{ userData.rol }}</p>
          <div class="butons">
            <button class="up" @click="logout">Cerrar sesión</button>
            <button class="set" @click="settings"><img src="../components/icons/icons8-settings-48.png" alt=""></button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useCart } from '@/stores/cart';
import router from '@/routers/rutas';

const showUserMenu = ref(false);
const userData = ref([]);
const cart = useCart();

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const fetchUserData = async () => {
  try {    
    const response = await axios.get(`http://127.0.0.1:8080/usuario/${cart.documento}`);
    userData.value = response.data;
    if (userData.value.rol == "ADMINISTRADOR_SUCURSAL") {
      userData.value.rol = "ADMINISTRADOR SUCURSAL"
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const logout = () => {
  console.log('Cerrando sesión...');
  cart.resetCart();
  router.push({ name: "Registro" })
  showUserMenu.value = false;
};

const settings = () => {
  console.log('Ajustes abiertos...');
  if (cart.rol == "MESERO" || cart.rol == "CAJERO") {
    router.push({ name: "EditUsuarioMesero" })
  } else if (cart.rol == "ADMINISTRADOR_SUCURSAL") {
    router.push({ name: "EditUsuario" })
  } else if (cart.rol == "COCINERO") {
    router.push({ name: "EditUsuarioCocinero" })
  } else {
    router.push({ name: 'EditUser' })
  }
  
  showUserMenu.value = false;
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.header1 {
  background-color: var(--color_principal);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 15px 0 30px;
  box-shadow: 0px 2px 10px 4px gray;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  color: var(--color_letra_blanca);
  z-index: 3;
}

.nav1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px;
}

.logo1 {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 60%;
}

.logo1 img {
  width: 6%;
}

.logo1 a {
  text-decoration: none;
  font-size: 33px;
  font-family: fuente_principal;
  color: var(--color_letra_blanca);
}

.ul {
  list-style: none;
  display: flex;
  width: 40%;
  justify-content: right;
  align-items: center;
}

.ul img{
  width: 100%;
  height: 28px;
}

.user1{
  width: 60%;
}

.user1:hover{
  background-image: url(./icons/icons8-usuario-48.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.user-container {
  position: relative;
}

.user1 {
  width: 60%;
  cursor: pointer;
}

.user-menu {
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
}

.user-menu p {
  margin: 5px 0;
  color: black;
  font-size: 14px;
  display: flex; 
  flex-direction: column;
  align-items: start;
}

.user-menu strong {
  margin-bottom: 5px;
}

.user-menu .butons {
  display: flex;
  flex-wrap: nowrap;
  gap: 5px;
  margin-top: 7px;
}

.user-menu .up {
  width: 110px;
  background-color: #e60000;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
}

.user-menu .set {
  background-color: #7f7f7f;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.set img{
  width: 20px;
}

.user-menu .up:hover {
  background-color: #ff4d4d;
}

.user-menu .set:hover {
  background-color: #bababa;
}

.ul a{
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ul a:hover {
  border-radius: 10px;
  filter: drop-shadow(0px 0px 3px rgb(51, 51, 51));
}

.ul li{
  text-decoration: none;
  color: var(--color_letra);
  font-size: 18px;
  font-family: fuente_principal;
  transition: 0.7s;
  margin: 0 15px;
}

.ul li a:hover {
  color: var(--color_letra);
  border-radius: 10px;
  font-size: 18px;
  font-family: fuente_principal;
  filter: drop-shadow(0px 0px 3px rgb(51, 51, 51));
}
</style>