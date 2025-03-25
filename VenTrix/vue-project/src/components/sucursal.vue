<template>
    <div class="container1">
        <form class="sign-up1" @submit.prevent="loginSucursal">
            <h2>REGISTRAR SUCURSAL</h2>
            <div class="container-input1">
                <img src="../components/icons/barcodescan_120400.png" alt="Id">
                <input type="text" placeholder="Nit" v-model="id" required :disabled="editMode">
            </div>
            <div class="container-input1">
                <img src="../components/icons/icons8-usuario-50.png" alt="Nombre">
                <input type="text" placeholder="Nombre" v-model="nombre" required>
            </div>
            <div class="container-input1">
                <img src="../components/icons/direction_gps_location_map_maps_navigation_pin_icon_123198.png" alt="Direccion">
                <input type="text" placeholder="Direccion" v-model="direccion" required>
            </div>
            <div class="container-input1">
                <img src="../components/icons/4213476-apartment-architecture-building-city-company-house-officel_115390.png" alt="Ciudad">
                <input type="text" placeholder="Ciudad" v-model="ciudad" required>
            </div>
            <div class="container-input1">
                <img src="../components/icons/phone-handset_icon-icons.com_48252.png" alt="Telefono">
                <input type="text" placeholder="Telefono" v-model="telefono" required>
            </div>
            <div class="container-input1">
                <img src="../components/icons/admin_user_icon_188317.png" alt="Telefono">
                <input type="text" placeholder="Administrador (opcional)" v-model="usuario">
            </div>
            <div class="butons">
                <button class="button3" type="submit">{{ editMode ? 'ACTUALIZAR' : 'REGISTRAR' }}</button>
                <button class="edit" type="button" @click="editar">
                    <img src="../components/icons/icons8-edit-48.png" alt="Editar">
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCart } from '../stores/cart'

const usuario = ref('');
const cart = useCart(); 
const data = ref([]);
const editMode = ref(false);
const router = useRouter();
const id = ref('');
const nombre = ref('');
const direccion = ref('');
const ciudad = ref('');
const telefono = ref('');
const date = new Date();
const dia = (date.getDate() < 10 ? '0':'') + date.getDate();
const mes = ((date.getMonth() + 1) < 10 ? '0':'') + (date.getMonth() + 1);
const año = date.getFullYear();
const fecha_apertura = ref(`${año}-${mes}-${dia}`);
const menError = ref('');
const sucursal = ref({
  id: '',
  nombre: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  fecha_apertura: '',
  estado: '',
  id_restaurante: ''
});

const limpiarInputs = () => {
  id.value = '';
  nombre.value = '';
  direccion.value = '';
  ciudad.value = '';
  telefono.value = '';
  usuario.value = '';
};

const loginSucursal = async () => {
    try {
        if (usuario.value) {
            const response1 = await axios.get(`http://127.0.0.1:8080/usuario/${usuario.value}`);
        
            if (!response1.data || response1.data.value === '' || response1.data.rol !== "ADMINISTRADOR_SUCURSAL") {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error en el administrador',
                    text: 'La Usuario no existe o No es Administrador Sucursal.',
                    backdrop: false,  // Evita problemas con el fondo modal
                    allowOutsideClick: false, 
                });
                return; 
            }
        }
        
        const response = await axios.post('http://127.0.0.1:8080/sucursal', {
            id: id.value,
            nombre: nombre.value,
            direccion: direccion.value,
            ciudad: ciudad.value,
            telefono: telefono.value,
            fecha_apertura: fecha_apertura.value,
            estado: 'ACTIVO',
            administrador: usuario.value,
            restaurante: {
                "id": cart.restaurante
            }
        });

        console.log('Registro OK');

        Swal.fire({
            icon: 'success',
            title: 'Sucursal Registradoa',
            text: 'Se registró de manera exitosa',
            backdrop: false,  // Evita problemas con el fondo modal
            allowOutsideClick: false, 
        });
        cart.nit = id.value;
        editMode.value = false;
        limpiarInputs();

    } catch (error) {

        console.error("Error al registrar", error);
        menError.value = "Error al registrar sucursal.";
        Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'No se pudo registrar la sucursal. Por favor, revisa la informacion.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
        });
        limpiarInputs();
    }
};

const editar = async () => {
    if (editMode.value) {
        editMode.value = false;
        limpiarInputs();
    } else {
        editMode.value = true;
        const response = await axios.get(`http://127.0.0.1:8080/sucursal/${id.value}`);
        data.value = response.data;
        id.value = data.value.id;
        nombre.value = data.value.nombre;
        direccion.value = data.value.direccion;
        ciudad.value = data.value.ciudad;
        telefono.value = data.value.telefono;
        usuario.value = data.value.administrador;
    }
}


</script>

<style scoped>
.container1{
    margin-bottom: 80px;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.container1 .sign-up1{
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    transition: transform 0.8s ease-in;
    background-color: #F0F4F3;
    box-shadow: 0 0 10px rgb(0,0,0,0.3);
    border-radius: 15px;
}

.container1 h2{
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 30px;
}

.container1 a:hover{
    color: blue;
    text-decoration: underline;
}

.container1 span{
    font-size: 15px;
    margin-bottom: 15px;
}

.container-input1{
    width: 450px;
    height: 50px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 0 15px;
    background-color: #eeeeee;
}

.container-input1 input{
    border: none;
    outline: none;
    width: 100%;
    height: 40px;
    font-size: 17px;
    background-color: #eeeeee;
}

.container-input1 img{
    width: 10%;
    height: 25px;
}

.container1 a{
    color: black;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 5px;
}

.butons {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 35px;
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
    width: 30px;
}

.button3{
    padding: 18px 25px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #0def5c;
    color: black;
}



@media (max-width: 1024px) and (min-width: 820px) {
  .container1 {
    width: 80%; 
  }

  .sign-up1 {
    padding: 20px;
    max-width: 100%;
  }

  .sign-up1 h2 {
    font-size: 26px; 
    margin-bottom: 20px;
  }

  .container-input1 {
    width: 100%;
    height: 45px; 
    margin-bottom: 12px;
  }

  .container-input1 img {
    width: 20px;
    height: 20px;
  }

  .container-input1 input {
    font-size: 15px; 
  }

  .button3 {
    padding: 12px 20px; 
    font-size: 15px;
  }

  .edit img {
    width: 25px; 
    height: 25px;
  }

  .butons {
    gap: 20px; 
  }
}

@media (max-width: 819px) {
  .container1 {
    width: 90%; 
    margin-bottom: 40px; 
  }

  .sign-up1 {
    padding: 15px; 
    border-radius: 10px;
  }

  .sign-up1 h2 {
    font-size: 22px; 
    margin-bottom: 15px;
  }

  .container-input1 {
    width: 100%; 
    height: 40px; 
    margin-bottom: 10px;
    padding: 0 10px;
  }

  .container-input1 img {
    width: 18px; 
    height: 18px;
  }

  .container-input1 input {
    font-size: 14px; 
  }

  .button3 {
    padding: 10px 15px; 
    font-size: 14px;
  }

  .edit img {
    width: 22px; 
    height: 22px;
  }

  .butons {
    gap: 15px; 
    flex-direction: column; 
  }

  .edit {
    padding: 5px; 
  }
}

</style>