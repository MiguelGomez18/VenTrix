<template>
    <div>
      <div class="container-form3">
        <form class="sign-up3" @submit.prevent="actualizar">
          <h2>Información personal</h2>
          <label for="">Documento</label>
          <input type="text" placeholder="Documento" v-model="userData.documento" disabled>
          <label for="">Nombre</label>
          <input type="text" placeholder="Nombre" v-model="userData.nombre" :disabled="!editMode">
          <label for="">Rol</label>
          <input type="text" placeholder="Rol" v-model="rol" disabled>
          <label for="">Correo</label>
          <input type="email" placeholder="Email" v-model="userData.correo" :disabled="!editMode">
          <label for="">Contraseña</label>
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
  import Swal from 'sweetalert2';
  import { ref, onMounted } from 'vue';
  import axios from '@/axios';
  import { useCart } from '@/stores/cart';
  
  const userData = ref([]);
  const cart = useCart();
  const editMode = ref(false);
  const rol = ref('');
  
  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¡¿])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¡¿]{8,}$/;
    return regex.test(password);
  };

  const buscar = async () => {
    try {   
      const response = await axios.get(`/usuario/${cart.documento}`);
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
      if (!validarPassword(userData.value.password)) {
        Swal.fire({
            icon: 'error',
            title: 'Error de contraseña',
            text: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras con almenos una mayuscula, números y caracteres especiales.',
            backdrop: false,  // Evita problemas con el fondo modal
            allowOutsideClick: false, 
        });
        return; 
      }
      const response = await axios.put(`/usuario/${userData.value.documento}`, userData.value);
      await buscar();
      editMode.value = false; 
      Swal.fire({
          icon: 'success',
          title: 'Actualizacion Correcta',
          text: 'Tu informacion a sido actualizada exitosamente',
          timer: 2000,
          backdrop: false,  // Evita problemas con el fondo modal
          allowOutsideClick: false, 
      });
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


@media (max-width: 1024px) and (min-width: 820px) {
  .container-form3 {
    width: 90%; /* Aumentamos el ancho para aprovechar mejor el espacio */
    padding: 20px;
  }

  .sign-up3 input {
    width: 70%; /* Aumentamos el ancho de los inputs */
  }

  .butons {
    width: 70%; /* Ajustamos el ancho del contenedor de botones */
  }

  .button3 {
    padding: 12px 18px; /* Reducimos el padding del botón */
    font-size: 14px; /* Reducimos el tamaño de la fuente */
  }

  .edit img {
    width: 20px; /* Reducimos el tamaño del ícono de editar */
  }
}


@media (max-width: 819px) {
  .container-form3 {
    width: 80%;
    padding: 15px;
  }

  .sign-up3 h2 {
    font-size: 24px; /* Reducimos el tamaño del título */
    margin-bottom: 25px;
  }

  .sign-up3 input{
    width: 90%;
    padding: 8px;
    margin-bottom: 10px;
  }

  .butons {
    width: 100%; /* Los botones ocupan todo el ancho */
    flex-direction: column; /* Apilamos los botones verticalmente */
    gap: 10px; /* Reducimos el espacio entre botones */
  }

  .button3 {
    width: 100%; /* El botón ocupa todo el ancho */
    padding: 10px 15px; /* Reducimos el padding */
    font-size: 14px; /* Reducimos el tamaño de la fuente */
  }

  .edit {
    width: 100%; /* El botón de editar ocupa todo el ancho */
    text-align: center; /* Centramos el ícono */
  }

  .edit img {
    width: 18px; /* Reducimos el tamaño del ícono */
  }
}
</style>