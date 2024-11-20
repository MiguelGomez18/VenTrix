<template>
    <div>
      <div class="container-form3">
        <form class="sign-up3" @submit.prevent="actualizar">
          <h2>Información personal</h2>
          <input type="text" placeholder="Documento" v-model="userData.documento" disabled>
          <input type="text" placeholder="Nombre" v-model="userData.nombre" :disabled="!editMode">
          <input type="text" placeholder="Rol" v-model="rol" disabled>
          <input type="email" placeholder="Email" v-model="userData.correo" :disabled="!editMode">
          <input type="password" placeholder="Password" v-model="userData.password" :disabled="!editMode">
          <div class="butons">
            <button class="button3" type="submit" :disabled="!editMode">Actualizar información</button>
            <button class="edit" type="button" @click="editar">
              <img src="../components/icons/icons8-edit-48.png" alt="Editar">
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useCart } from '@/stores/cart';
  
  const userData = ref([]);
  const cart = useCart();
  const editMode = ref(false);
  const rol = ref('');
  
  const buscar = async () => {
    try {   
      const response = await axios.get(`http://127.0.0.1:8080/usuario/${cart.documento}`);
      userData.value = response.data;
      if (userData.value.rol === "ADMINISTRADOR_SUCURSAL") {
        rol.value = "ADMINISTRADOR SUCURSAL";
      } else {
        rol.value = userData.value.rol;
      }
    } catch (error) {
      console.error('Error buscar user data:', error);
    }
  };
  
  const editar = () => {
    editMode.value = !editMode.value;
  };
  
  const actualizar = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:8080/usuario/${userData.value.documento}`, userData.value);
      await buscar();
      editMode.value = false; 
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };
  
  onMounted(() => {
    buscar();
  });
  </script>
  

<style scoped>
.container-form3 {
    padding: 20px 40px;
    width: 80%;
    display: flex;
    justify-content: start;
    margin-left: auto;
    margin-right: auto;
}

.container-form3 .sign-up3{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 25px;
    transition: transform 0.8s ease-in;
}

.sign-up3 h2{
    font-size: 30px;
    margin-bottom: 10px;
}


.sign-up3 input{
    width: 50%;
    padding: 10px 10px;
    font-size: 15px;
    background-color: rgba(234, 234, 234, 0.673);
    border: 1px solid rgba(219, 219, 219, 0.973);
    border-radius: 10px
}

.container-form3 a{
    color: black;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 5px;
}

.butons {
  width: 50%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
  align-items: center;
  gap: 15px;
  margin-top: 7px;
}

.edit {
    padding: 5px;
    background-color: #989898;
    border: none;
    border-radius: 5px;
}

.edit:hover {
    background-color: #cdcdcd;
}
.edit img {
    width: 25px;
}

.button3{
    padding: 15px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #0def5c;
    color: black;
}

.button3:hover {
    background-color: #2bff75;
}
</style>