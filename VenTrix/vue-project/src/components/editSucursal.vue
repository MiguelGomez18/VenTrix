<template>
    <div>
      <div class="container-form3">
        <form class="sign-up3" @submit.prevent="actualizar">
          <h2>Sucursal</h2>
          <label for="">Nit</label>
          <input type="text" placeholder="Nit" v-model="userData.id" disabled>
          <label for="">Nombre</label>
          <input type="text" placeholder="Nombre" v-model="userData.nombre" :disabled="!editMode">
          <label for="">Dirección</label>
          <input type="text" placeholder="Direccion" v-model="userData.direccion" :disabled="!editMode">
          <label for="">Ciudad</label>
          <input type="text" placeholder="Ciudad" v-model="userData.ciudad" :disabled="!editMode">
          <label for="">Telefono</label>
          <input type="text" placeholder="Telefono" v-model="userData.telefono" :disabled="!editMode">
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
  import axios from '@/axios';
  import { useCart } from '@/stores/cart';
  
  const userData = ref([]);
  const cart = useCart();
  const editMode = ref(false);
  
  const buscar = async () => {
    try {   
      const response = await axios.get(`/sucursal/${cart.nit}`);
      userData.value = response.data;
    } catch (error) {
      console.error('Error buscar user data:', error);
    }
  };
  
  const editar = () => {
    editMode.value = !editMode.value;
  };
  
  const actualizar = async () => {
    try {
        const response = await axios.put(`/sucursal/${userData.value.id}`, userData.value);
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
    transition: transform 0.8s ease-in;
}

.sign-up3 h2{
    font-size: 30px;
    margin-bottom: 35px;
}

.sign-up3 label {
  color: rgba(128, 128, 128, 0.923);
  font-size: 18px;
  padding-left: 5px;
  margin-bottom: 5px;
}

.sign-up3 input{
    width: 50%;
    padding: 10px 10px;
    margin-bottom: 20px;
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