<template>
  <div>
    <div class="container-form3">
      <form class="sign-up3" @submit.prevent="actualizar">
        <h2>Restaurante</h2>
        <label for="">Identificador</label>
        <input type="text" placeholder="Id" v-model="userData.id" disabled>
        <label for="">Nombre</label>
        <input type="text" placeholder="Nombre" v-model="userData.nombre" :disabled="!editMode">
        <label for="">Descripción</label>
        <input type="text" placeholder="Descripcion" v-model="userData.descripcion" :disabled="!editMode">
        <label for="">Telefono</label>
        <input type="text" placeholder="Telefono" v-model="userData.telefono" :disabled="!editMode">
        <label for="">Dirección</label>
        <input type="text" placeholder="Direccion" v-model="userData.direccion" :disabled="!editMode">
        <label for="">Correo</label>
        <input type="text" placeholder="Correo" v-model="userData.correo" :disabled="!editMode">
        <div class="fecha">
          <label for="">Fecha de Caducidad de la Membresia</label>
          <input type="text" placeholder="Fecha Membresia" v-model="userData.fecha_finalizacion" disabled>
          <v-btn 
            class="fecha_pago" 
            :class="{ 'disabled-btn': !boleano }"
            large 
            @click="navegarARuta('Pagos', boleano)"
            :disabled="!boleano"
          >
            <span>Pagar</span>
            <img src="../components/icons/icons8-tarjeta-24.png" alt="">
          </v-btn>
        </div>
        
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
      <div class="content-img"><img :src="getImagen(userData.imagen)" alt="Imagen del producto" /></div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import getBaseUrl from '@/getBaseUrl'
import { useCart } from '@/stores/cart';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 
const file = ref(null);
const fileInput = ref(null);
const onFileChange = (event) => {
  file.value = event.target.files[0];
};
const getImagen = (path) => `${getBaseUrl()}${path}`;
const userData = ref([]);
const cart = useCart();
const editMode = ref(false);
const boleano = ref(false);

const pagar = () => {
  if (!userData.value.fecha_finalizacion) {
    boleano.value = false;
    return;
  }
  
  const fechaFinalizacion = new Date(userData.value.fecha_finalizacion);
  const hoy = new Date();
  
  // Si la fecha de finalización ya pasó o está a 4 días o menos
  boleano.value = fechaFinalizacion <= hoy || 
                  (fechaFinalizacion - hoy) <= (5 * 24 * 60 * 60 * 1000);
};

const navegarARuta = (name,boleano) => {
  if (boleano) {
    window.dispatchEvent(new Event('ocultarInicio')); 
    router.push({ name: name, params: { idrestaurante: cart.restaurante } });
  };
}

const buscar = async () => {
  try {   
    const response = await axios.get(`/restaurante/${cart.restaurante}`);
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
    formData.append("fecha_finalizacion", userData.value.fecha_finalizacion);
    formData.append("correo", userData.value.correo);

    if (file.value != null) {

      formData.append('imagen', file.value);

    } else {

      try {
        const imagenUrl = computed(() => `${getBaseUrl()}${userData.value.imagen}`);
        const respuesta = await fetch(imagenUrl.value);
        
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

    const response = await axios.put(`/restaurante/${userData.value.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    Swal.fire({
      icon: 'success',
      title: 'Restaurante Actualizado',
      text: 'Se actualizo de manera exitosa',
      timer: 1700,
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });

    await buscar();
    editMode.value = false; 
  } catch (error) {
    console.error('Error al actualizar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: 'Ocurrió un problema al actualizar el restaurante. Intenta nuevamente.',
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  }
};

onMounted( async () => {
  await buscar();
  pagar();
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
  margin-bottom: 35px;
}

.sign-up3 label {
  color: rgba(128, 128, 128, 0.923);
  font-size: 18px;
  padding-left: 5px;
  margin-bottom: 5px;
}

.sign-up3 input{
  width: 85%;
  padding: 10px 10px;
  margin-bottom: 20px;
  font-size: 15px;
  background-color: rgba(234, 234, 234, 0.673);
  border: 1px solid rgba(219, 219, 219, 0.973);
  border-radius: 10px
}

.fecha {
  width: 85%;
  display: flex;
  flex-wrap: wrap;
}

.fecha label {
  width: 100%;
  margin-bottom: 10px;
}

.fecha input {
  width: 40%;
}

.fecha .fecha_pago {
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-weight: 900;
  margin-left: 30px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #04376e;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  color: white;
}

.fecha_pago.disabled-btn {
  background-color: #989898;
  color: #e0e0e0;
  cursor: not-allowed;
  box-shadow: none;
}

.fecha_pago[disabled] {
  opacity: 1;
}

/* Estilo para el tooltip */
[v-tooltip] {
  position: relative;
}

[v-tooltip]::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

[v-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}

.hidden-file-input {
  display: none;
}

.custom-file-input {
  margin: 5px 0 10px 0;
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
  margin-bottom: 30px;
}

.edit:hover {
  background-color: #cdcdcd;
}
.edit img {
  width: 25px;
}

.button3{
  padding: 15px 20px;
  margin-bottom: 30px;
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
    padding: 20px; /* Reducimos el padding */
    flex-direction: column; /* Apilamos el formulario y la imagen */
    align-items: center; /* Centramos los elementos */
  }

  .sign-up3 {
    width: 80%; /* Aumentamos el ancho del formulario */
  }

  .content-img {
    width: 60%; /* Reducimos el ancho de la imagen */
    margin-left: 0; /* Eliminamos el margen izquierdo */
    margin-top: 20px; /* Añadimos margen superior */
  }

  .sign-up3 input {
    width: 100%; /* Los inputs ocupan todo el ancho */
  }

  .butons {
    width: 100%; /* Los botones ocupan todo el ancho */
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
    padding: 0px; /* Reducimos el padding */
    flex-direction: column; /* Apilamos el formulario y la imagen */
    align-items: center; /* Centramos los elementos */
  }

  .container-form3 .sign-up3 {
    width: 80%; /* El formulario ocupa todo el ancho */
    justify-content: flex-start;
  }

  .content-img {
    width: 80%; /* Reducimos el ancho de la imagen */
    margin-left: 0; /* Eliminamos el margen izquierdo */
    margin-top: 20px; /* Añadimos margen superior */
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

  .fecha {
    width: 100%;
  }

  .fecha label {
    text-align: center;
  }

  .fecha input {
    width: 40%;
  }

  .fecha .fecha_pago {
    height: 35px;
    padding: 0 10px;
    margin-left: 10px;
  }

  .fecha_pago.disabled-btn {
    background-color: #989898;
    color: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
  }

  .fecha_pago[disabled] {
    opacity: 1;
  }

  /* Estilo para el tooltip */
  [v-tooltip] {
    position: relative;
  }

  [v-tooltip]::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
  }

  [v-tooltip]:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .custom-label {
    color: black;
    padding: 4px 10px;
  }

  .custom-label span {
    font-size: 14px;
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
    margin: 0;
  }

  .edit {
    width: 100%; /* El botón de editar ocupa todo el ancho */
    text-align: center; /* Centramos el ícono */
    margin: 0;
  }

  .edit img {
    width: 18px; /* Reducimos el tamaño del ícono */
  }
  .content-img {
    width: 70%;
    border: 6px solid rgb(217, 217, 217);
  }
}
</style>