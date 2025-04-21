<template>
    <div class="body1">
        <div class="container1">
            <form class="sign-up1" @submit.prevent="registerRestaurant">
                <h2>REGISTRAR RESTAURANTE</h2>
                <select v-model="mesesSeleccionados" class="register-select">
                    <option value="" disabled>Seleccione una Membresia</option>
                    <option value="3">3 meses - $24.900</option>
                    <option value="6">6 meses - $54.900</option>
                    <option value="12">12 meses - $169.900</option>
                </select>
                <div class="container-input1">
                    <img src="../components/icons/face_id_icon_148536.png" alt="Id">
                    <input type="text" placeholder="ID Restaurante" v-model="id" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-usuario-50.png" alt="Nombre">
                    <input type="text" placeholder="Nombre" v-model="nombre" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/description_icon_144381.png" alt="Descripcion">
                    <input type="text" placeholder="Descripcion" v-model="descripcion" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/phone-handset_icon-icons.com_48252.png" alt="Telefono">
                    <input type="text" placeholder="Teléfono" v-model="telefono" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/direction_gps_location_map_maps_navigation_pin_icon_123198.png" alt="Direccion">
                    <input type="text" placeholder="Dirección" v-model="direccion" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-correo-50.png" alt="Correo">
                    <input type="email" placeholder="Correo" v-model="correo" required>
                </div>
                <div class="custom-file-input1">
                    <label for="file-upload" class="custom-label1">
                        <img src="../components/icons/icons8-attach-24.png" alt="">
                        <span v-if="!file">Agrega un logo!!</span>
                        <span v-else>{{ file.name }}</span>
                    </label>
                    <input
                        id="file-upload"
                        class="hidden-file-input1"
                        type="file"
                        @change="onFileChange"
                        ref="fileInput"
                    />
                </div>
                <div v-if="calcularFechaFinalizacion" class="container-input1">
                    <img src="../components/icons/3586371-calendar-date-event-schedule_107943.png" alt="Fecha_finalizacion">
                    <input 
                        type="text" 
                        placeholder="Fecha finalizacion" 
                        v-model="fecha_finalizacion" 
                        readonly
                        required
                        disabled
                    >
                    <small style="font-size: 12px; color: #666;">
                        Fecha De Finalizacion
                    </small>
                </div>
                <router-link to="/registro">Volver..</router-link>
                <button class="button1" type="submit">REGISTRAR</button>
            </form>
        </div>
    </div>
</template>
    
<script setup>
import Swal from 'sweetalert2';
import { ref, defineProps, computed } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';
import { useCart } from '@/stores/cart';

const props = defineProps({
    usuario: {
        type: String,
        required: true
    }
});

const file = ref(null);
const fileInput = ref(null);
const cart = useCart();
const id = ref('');
const nombre = ref('');
const descripcion = ref('');
const telefono = ref('');
const direccion = ref('');
const correo = ref('')
const date = new Date();
const dia = (date.getDate() < 10 ? '0':'') + date.getDate();
const mes = ((date.getMonth() + 1) < 10 ? '0':'') + (date.getMonth() + 1);
const año = date.getFullYear();
const fecha_creacion = ref(`${año}-${mes}-${dia}`);
const fecha_finalizacion = ref('');
const usuario = props.usuario;
const router = useRouter();
const mesesSeleccionados = ref('');

const limpiarInputs = () => {
    id.value = '';
    nombre.value = '';
    descripcion.value = '';
    telefono.value = '';
    direccion.value = '';
    correo.value = '';
    fecha_creacion.value = '';
    fecha_finalizacion.value = '';
    mesesSeleccionados.value = '';
};

const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        // Validar el tamaño del archivo (10 MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024; // 10 MB en bytes
        if (selectedFile.size > maxSize) {
            // Mostrar mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Archivo demasiado grande',
                text: 'El archivo no puede superar los 10 MB.',
                backdrop: false,  // Evita problemas con el fondo modal
                allowOutsideClick: false, 
            });
            // Limpiar el input de archivo
            file.value = null;
            fileInput.value.value = ''; // Limpiar el input file
        } else {
            // Si el archivo es válido, asignarlo a la variable `file`
            file.value = selectedFile;
        }
    }
};

const calcularFechaFinalizacion = computed(() => {
    if (!mesesSeleccionados.value) return;
    
    const today = new Date();
    const mesNumero = parseInt(mesesSeleccionados.value);
    
    if (isNaN(mesNumero)) {
        console.error('El valor de mes no es un número válido');
        return;
    }
    
    const nuevaFecha = new Date(today);
    nuevaFecha.setMonth(today.getMonth() + mesNumero);
    
    const año = nuevaFecha.getFullYear();
    const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = nuevaFecha.getDate().toString().padStart(2, '0');
    
    return fecha_finalizacion.value = `${año}-${mes}-${dia}`;
});

const registerRestaurant = async () => {
    try { 

        if (file.value && file.value.size > 10 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo demasiado grande',
                text: 'El archivo no puede superar los 10 MB.',
                backdrop: false,  // Evita problemas con el fondo modal
                allowOutsideClick: false, 
            });
            return; 
        }

        const formData = new FormData();
        formData.append("id", id.value);
        formData.append("nombre", nombre.value);
        formData.append("descripcion", descripcion.value);
        formData.append("telefono", telefono.value);
        formData.append("direccion", direccion.value);
        formData.append("correo", correo.value);
        formData.append("imagen", file.value);
        formData.append("fecha_creacion", fecha_creacion.value);
        formData.append("fecha_finalizacion", fecha_finalizacion.value);
        formData.append("estado", 'ACTIVO');
        formData.append("usuario", JSON.stringify({ documento: usuario }));

        const response = await axios.post(
        '/restaurante', 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        cart.restaurante = id.value;

        Swal.fire({
            icon: 'success',
            title: 'Restaurante Registrado',
            text: 'Se registró de manera exitosa',
            backdrop: false,  // Evita problemas con el fondo modal
            allowOutsideClick: false, 
        });

        router.push({ name: 'TarjetasSucursales', params: { idrestaurante: id.value } });
        limpiarInputs();

    } catch (error) {
        console.error("Error al registrar el restaurante", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: 'Ocurrió un problema al registrar el restaurante. Intenta nuevamente.',
            backdrop: false,  // Evita problemas con el fondo modal
            allowOutsideClick: false, 
        });
    }
};

</script>
    
    <style scoped>
    .body1{
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F0F4F3;
        box-shadow: 0 0 10px rgb(0,0,0,0.3);
    }
    
    .container1{
        padding: 20px 40px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: white;
        border-radius: 15px;
    }
    
    .container1 .sign-up1{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        transition: transform 0.8s ease-in;
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

    .register-select {
        width: 100%;
        padding: 0.75rem 1rem;
        margin-bottom: 1.25rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        background-color: #f9f9f9;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
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

    .custom-file-input1 {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: start;
    }

    .hidden-file-input1 {
        display: none;
    }

    .custom-label1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        gap: 20px;
        background-color: rgba(234, 234, 234, 0.673);
        border: 1px solid rgba(219, 219, 219, 0.973);
        color: black;
        padding: 6px 20px;
        border-radius: 5px;
        margin-bottom: 15px;
    }

    .custom-label1 span {
        max-width: 400px;
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
    
    .button1{
        width: 170px;
        height: 60px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        background-color: #0def5c;
        color: black;
    }

    @media (max-width: 819px) {
  .body1 {
    height: auto;
    padding: 40px 0;
    align-items: flex-start;
  }

  .container1 {
    flex-direction: column;
    padding: 20px;
    width: 90%;
    box-sizing: border-box;
  }

  .container1 h2 {
    font-size: 24px;
    text-align: center;
  }

  .container-input1 {
    width: 100%;
    height: 50px;
    padding: 5px;
    gap: 10px;
  }

  .container-input1 input {
    height: 45px;
    font-size: 16px;
  }

  .container-input1 img {
    width: 25px;
    height: 25px;
  }

  .register-select {
    width: 100%;
    font-size: 16px;
  }

  .custom-label1 {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    font-size: 14px;
  }

  .custom-label1 span {
    font-size: 14px;
  }

  .button1 {
    width: 100%;
    height: 50px;
    font-size: 16px;
  }

  .container1 a {
    font-size: 14px;
    margin-top: 10px;
  }
}

    
    </style>
    