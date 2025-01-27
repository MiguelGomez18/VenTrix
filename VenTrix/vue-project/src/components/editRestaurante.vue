<template>
  <div>
    <div class="container-form3">
      <form class="sign-up3" @submit.prevent="actualizar">
        <h2>Restaurante</h2>
        <input type="text" placeholder="Id" v-model="userData.id" disabled>
        <input type="text" placeholder="Nombre" v-model="userData.nombre" :disabled="!editMode">
        <input type="text" placeholder="Descripcion" v-model="userData.descripcion" :disabled="!editMode">
        <input type="text" placeholder="Telefono" v-model="userData.telefono" :disabled="!editMode">
        <input type="text" placeholder="Direccion" v-model="userData.direccion" :disabled="!editMode">
        <input type="text" placeholder="Correo" v-model="userData.correo" :disabled="!editMode">
        <div class="custom-file-input">
          <label for="file-upload" class="custom-label">
              <img src="../components/icons/icons8-attach-24.png" alt="">
              <span v-if="!file">Agrega un logo!!</span>
              <span v-else>{{ file.name }}</span>
          </label>
          <input
              id="file-upload"
              class="hidden-file-input"
              type="file"
              @change="onFileChange"
              ref="fileInput"
              :disabled="!editMode"
          />
        </div>
        <div class="butons">
          <button class="button3" type="submit" :disabled="!editMode">Actualizar información</button>
          <button class="edit" type="button" @click="editar">
            <img src="../components/icons/icons8-edit-48.png" alt="Editar">
          </button>
        </div>
      </form>
      <div class="content-img"><img :src="`http://127.0.0.1:8080${userData.imagen}`" alt=""></div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useCart } from '@/stores/cart';

const file = ref(null);
const fileInput = ref(null);
const onFileChange = (event) => {
  file.value = event.target.files[0];
};
const userData = ref([]);
const cart = useCart();
const editMode = ref(false);

const buscar = async () => {
  try {   
    const response = await axios.get(`http://127.0.0.1:8080/restaurante/${cart.restaurante}`);
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
    const formData = new FormData();
    formData.append("nombre", userData.value.nombre);
    formData.append("descripcion", userData.value.descripcion);
    formData.append("telefono", userData.value.telefono);
    formData.append("direccion", userData.value.direccion);
    formData.append("correo", userData.value.correo);

    if (file.value != null) {

      formData.append('imagen', file.value);

    } else {

      try {
        const imagenUrl = `http://127.0.0.1:8080${userData.value.imagen}`;
        const respuesta = await fetch(imagenUrl);
        
        if (!respuesta.ok) {
          throw new Error('No se pudo obtener la imagen');
        }

        const imagenBlob = await respuesta.blob();
        const imagenFile = new File([imagenBlob], userData.value.imagen.split('/imagenes/restaurantes/'+userData.value.id+'-').pop(), { type: imagenBlob.type });

        formData.append('imagen', imagenFile);
      } catch (error) {
        console.error('Error al obtener la imagen existente:', error);
      }
    }

    const response = await axios.put(`http://127.0.0.1:8080/restaurante/${userData.value.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    Swal.fire({
      icon: 'success',
      title: 'Restaurante Actualizado',
      text: 'Se actualizo de manera exitosa',
      timer: 1700,
    });

    await buscar();
    editMode.value = false; 
  } catch (error) {
    console.error('Error al actualizar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: 'Ocurrió un problema al actualizar el restaurante. Intenta nuevamente.'
    });
  }
};

onMounted(() => {
  buscar();
});
</script>


<style scoped>
.container-form3 {
  padding: 20px 40px 20px 80px;
  width: 100%;
  display: flex;
  justify-content: start;
  margin-left: auto;
  margin-right: auto;
}

.container-form3 .sign-up3{
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 25px;
  transition: transform 0.8s ease-in;
}

.content-img {
width: 40%;
max-height: fit-content;
border: 10px solid rgb(217, 217, 217);
border-radius: 20px;
margin-left: 40px;
display: flex;
align-items: center;
justify-content: center;
padding: 10px;
}

.content-img img {
width: 100%;
border-radius: 10px;
}

.sign-up3 h2{
  font-size: 30px;
  margin-bottom: 10px;
}


.sign-up3 input{
  width: 85%;
  padding: 10px 10px;
  font-size: 15px;
  background-color: rgba(234, 234, 234, 0.673);
  border: 1px solid rgba(219, 219, 219, 0.973);
  border-radius: 10px
}

.hidden-file-input {
  display: none;
}

.custom-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  gap: 10px;
  background-color: rgba(234, 234, 234, 0.673);
  border: 1px solid rgba(219, 219, 219, 0.973);
  color: black;
  padding: 6px 10px;
  border-radius: 5px;
}

.container-form3 a{
  color: black;
  font-size: 14px;
  margin-bottom: 10px;
  margin-top: 5px;
}

.butons {
width: 80%;
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