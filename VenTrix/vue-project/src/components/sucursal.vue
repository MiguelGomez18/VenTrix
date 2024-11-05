<template>
<div class="body1">
    <div :class="{ toggle1: isToggled1 } " class="container1">
        <div class="container-form1">
            <form class="sign-in1" @submit.prevent="loginSucursal">
                <h2>SUCURSAL</h2>
                <select v-model="nit2" required>
                    <option value="">Seleccione su sucursal</option>
                    <option v-for="sucu in sucursalesFiltradas" :key="sucu.id" :value="sucu.id">
                        {{ sucu.nombre }}
                    </option>
                </select>
                <router-link to="/registro">Volver..</router-link>
                <button class="button1" type="submit">{{ frmlogin1 ? 'INICIAR' : 'REGISTRAR' }}</button>
            </form>
        </div>

        <div class="container-form1">
            <form class="sign-up1" @submit.prevent="loginSucursal">
                <h2>REGISTRAR SUCURSAL</h2>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Id">
                    <input type="text" placeholder="Nit" v-model="id" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-usuario-50.png" alt="Nombre">
                    <input type="text" placeholder="Nombre" v-model="nombre" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Direccion">
                    <input type="text" placeholder="Direccion" v-model="direccion" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Ciudad">
                    <input type="text" placeholder="Ciudad" v-model="ciudad" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Telefono">
                    <input type="text" placeholder="Telefono" v-model="telefono" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-correo-50.png" alt="Correo">
                    <input type="Date" placeholder="Fecha apertura" v-model="fecha_apertura" required>
                </div>
                <router-link to="/registro">Volver..</router-link>
                <button class="button1" type="submit">{{ frmlogin1 ? 'INICIAR' : 'REGISTRAR' }}</button>
            </form>
        </div>

        <div class="container-welcome1">
            <div class="welcome-sign-up1 welcome1">
                <h3>¡Bienvenido!</h3>
                <p>Registra tu sucursal con tus datos personales para empezar a usar todas las funciones del sitio.</p>
                <button @click="toggleSignIn1" class="button1" id="btn-sign-up1">REGISTRAR SUCURSAL</button>
            </div>
            <div class="welcome-sign-in1 welcome1">
                <h3>Hola</h3>
                <p>Por favor, elige tu sucursal para acceder a todas las funciones del sitio.</p>
                <button @click="toggleSignUp1" class="button1" id="btn-sign-in1">INICIAR</button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, computed, onMounted, defineProps } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCart } from '../stores/cart'

const props = defineProps({
    idrestaurante: {
    type: String,
    required: true
  }
});

// Ahora puedes usar `props.documento` o desestructurarlo
const { idrestaurante } = props;
const cart = useCart(); // Instancia de la tienda del carrito
const router = useRouter();
const id = ref('');
const nit2 = ref('');
const nombre = ref('');
const direccion = ref('');
const ciudad = ref('');
const telefono = ref('');
const fecha_apertura = ref('');
const id_restaurante = ref('');
const frmlogin1 = ref(true);
const menError = ref('');
const isToggled1 = ref(false);
const sucursales = ref([]);
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
const consultaBusqueda = ref('');


const limpiarInputs = () => {
  id.value = '';
  nombre.value = '';
  direccion.value = '';
  ciudad.value = '';
  telefono.value = '';
  fecha_apertura.value = '';
};

const buscar = async (idrestaurante) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/sucursal/id_sucursal/${idrestaurante}`); 
    sucursales.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar sucursales", error);
  }
};

buscar(idrestaurante);

const sucursalesFiltradas = computed(() => {
  return sucursales.value.filter(sucur =>
    sucur.nombre.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
  );
});

const loginSucursal = async () => {
    try {
        if (frmlogin1.value) {

        Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido a su sucursal'
        });

        cart.nit = nit2.value; // Asigna el nit seleccionado
        router.push({ name: 'Mesas', params: { idrestaurante: nit2.value } });

        } else {
            console.log(idrestaurante)
            const response = await axios.post('http://127.0.0.1:8080/sucursal', {
                id: id.value,
                nombre: nombre.value,
                direccion: direccion.value,
                ciudad: ciudad.value,
                telefono: telefono.value,
                fecha_apertura: fecha_apertura.value,
                estado: 'ACTIVO',
                restaurante: {
                    "id": idrestaurante
                }
            });

            buscar(idrestaurante);

            console.log('Registro OK');

            Swal.fire({
                icon: 'success',
                title: 'Sucursal Registradoa',
                text: 'Se registró de manera exitosa'
            });

            limpiarInputs();
            toggleSignUp1();
        }
    } catch (error) {

        console.error("Error al iniciar sesión", error);
        menError.value = "Error al iniciar sesión. Por favor, revisa el nombre de usuario y la contraseña.";
        Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'No se pudo iniciar sesión. Por favor, revisa el nombre y contraseña.'
        });
        limpiarInputs();
        toggleSignIn1();
    }
};

onMounted(async () => {
    if (!frmlogin1.value) {
        try {
            const response = await axios.get('http://127.0.0.1:8080/propietario/documento/');
            console.log("Documentos de los propietarios ", response.data);
        } catch (error) {
            console.error("Error en la consulta de documentos", error);
            menError.value = "Error al consultar documentos";
        }
    }
});


function toggleSignIn1() {
    frmlogin1.value = false;
    isToggled1.value = true;
}

function toggleSignUp1() {
    frmlogin1.value = true;
    isToggled1.value = false;
}

</script>

<style>
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
    width: 80%;
    display: flex;
    position: relative;
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
}

.container-form1 {
    padding: 20px 40px;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.container-form1 .sign-in1{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 10px;
    transition: transform 0.8s ease-in;
}

.container-form1 .sign-up1{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.8s ease-in;
}

.container-form1 h2{
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 30px;
}

.sign-in1 h2{
    font-size: 40px;
    margin-bottom: 80px;
}

.sign-in1 select{
    width: 100%;
    padding: 15px;
    margin-bottom: 40px;
    font-size: 20px;
    text-align: center;
}

.container-form1 a:hover{
    color: blue;
    text-decoration: underline;
}

.container-form1 span{
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

.container-form1 a{
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

.sign-up1{
    transform: translate(-100%);
}
.container1.toggle1 .sign-in1{
    transform: translateX(100%);
}
.container1.toggle1 .sign-up1{
    transform: translateX(0);
}


/*welcome*/
.container-welcome1{
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    transform: translateX(100%);
    background-color:#1e6838 ;
    transition: transform 0.5 ease-in-out,border-radius 0.5s ease-in-out;
    overflow: hidden;
}

.container1.toggle1 .container-welcome1{
    transform: translateX(0);
    background-color: #1e6838;
}

.container-welcome1 .welcome1{
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0 50px;
    color: white;
    transition: transform 0.8s ease-in-out;
}

.welcome-sign-in1{
    transform: translateX(100%);
}


.container-welcome1 h3{
    font-size: 40px;
}

.container-welcome1 p{
    font-size: 17px;
    text-align: center;
}

.container-welcome1 .button1{
    border: 2px solid white;
    padding: 5px;
}

.container1.toggle1 .welcome-sign-in1{
    transform: translateX(0);
}

.container1.toggle1 .welcome-sign-up1{
    transform: translateX(-100%);
}

</style>