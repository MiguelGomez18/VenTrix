<template>
    <div class="body">
    <div :class="{ toggle: isToggled } " class="container">
    <div class="container-form">
        <form class="sign-in" @submit.prevent="loginPropietario">
        <h2>INICIAR SESIÓN</h2>
        <div class="redes-sociales">
            <img src="../components/icons/icons8-whatsapp-50.png" alt="WhatsApp">
            <img src="../components/icons/icons8-instagram-50.png" alt="Instagram">
            <img src="../components/icons/icons8-facebook-nuevo-50 (1).png" alt="Facebook">
        </div>
        <span>Use su correo y su contraseña</span>
        <div class="container-input">
            <img src="../components/icons/icons8-correo-50.png" alt="Correo">
            <input type="email" placeholder="Email" v-model="correo" required>
        </div>
        <div class="container-input">
            <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña">
            <input type="password" placeholder="Password" v-model="password" required>
        </div>
        <a href="#">¿Olvidaste tu contraseña?</a>
        <router-link to="/">Volver..</router-link>
        <button class="button" type="submit">{{ frmlogin ? 'INICIAR SESIÓN' : 'REGISTRARSE' }}</button>
        </form>
    </div>

    <div class="container-form">
        <form class="sign-up" @submit.prevent="loginPropietario">
        <h2>REGISTRARSE</h2>
        <div class="redes-sociales">
            <img src="../components/icons/icons8-whatsapp-50.png" alt="WhatsApp">
            <img src="../components/icons/icons8-instagram-50.png" alt="Instagram">
            <img src="../components/icons/icons8-facebook-nuevo-50 (1).png" alt="Facebook">
        </div>
        <span>Use su correo electrónico para registrarse</span>
        <div class="container-input">
            <img src="../components/icons/icons8-tarjeta-de-identificación-50.png" alt="Documento">
            <input type="text" placeholder="Documento" v-model="documento" required>
        </div>
        <div class="container-input">
            <img src="../components/icons/icons8-usuario-50.png" alt="Usuario">
            <input type="text" placeholder="Nombre" v-model="nombre" required>
        </div>
        <div class="container-input">
            <img src="../components/icons/icons8-correo-50.png" alt="Correo">
            <input type="email" placeholder="Email" v-model="correo" required>
        </div>
        <div class="container-input">
            <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña">
            <input type="password" placeholder="Password" v-model="password" required>
        </div>
        <select v-model="rol" required>
            <option value="" disabled>Seleccione su rol...</option>
            <option v-for="ro in roles" :key="ro" :value="ro">
                {{ ro }}
            </option>
        </select>
        <router-link to="/">Volver..</router-link>
        <button class="button" type="submit">{{ frmlogin ? 'INICIAR SESIÓN' : 'REGISTRARSE' }}</button>
        </form>
    </div>

    <div class="container-welcome">
        <div class="welcome-sign-up welcome">
            <h3>¡Bienvenido!</h3>
            <p>Por favor, introduce tus datos personales para acceder a todas las funciones del sitio.</p>
            <button @click="toggleSignIn" class="button" id="btn-sign-up">CREAR CUENTA</button>
        </div>
        <div class="welcome-sign-in welcome">
            <h3>Hola</h3>
            <p>Crea una cuenta con tus datos personales para empezar a usar todas las funciones del sitio.</p>
            <button @click="toggleSignUp" class="button" id="btn-sign-in">INICIAR SESIÓN</button>
        </div>
    </div>
    </div>
</div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCart } from '@/stores/cart';

const cart = useCart();
const router = useRouter();
const documento = ref('');
const documento1 = ref('');
const rol1 = ref('');
const idrestaurante = ref('');
const sucursal1 = ref('');
const nombre = ref('');
const correo = ref('');
const password = ref('');
const roles = ["ADMINISTRADOR","ADMINISTRADOR_SUCURSAL","CAJERO","MESERO","COCINERO"];
const rol = ref('');
const date = new Date();
const dia = (date.getDate() < 10 ? '0':'') + date.getDate();
const mes = date.getMonth() + 1;
const año = date.getFullYear();
const fecha_creacion = ref(`${año}-${mes}-${dia}`);
const frmlogin = ref(true);
const menError = ref('');
const isToggled = ref(false);

const limpiarInputs = () => {
  documento.value = '';
  nombre.value = '';
  correo.value = '';
  password.value = '';
  rol.value = '';
};

const validarPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?¡¿@#<>$%^&*])[A-Za-z\d!?¡¿@<>#$%^&*]{8,}$/;
    return regex.test(password);
};

const loginPropietario = async () => {
    try {
        if (frmlogin.value) {
        const response = await axios.post('http://127.0.0.1:8080/usuario/login', {
            correo: correo.value,
            password: password.value
        });

        await buscarRol(correo.value);
        await buscardocumento(correo.value);
        if (rol1.value == roles[0]) {
            await buscarid_restaurante(documento1.value);

            if (idrestaurante.value == '') {
                router.push({ name: 'Restaurante', params: { usuario: documento1.value } });

            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido a tu cuenta'
                });
                cart.restaurante = idrestaurante.value;
                router.push({ name: 'Admin', params: { idrestaurante: idrestaurante.value } });
            }

        } else if (rol1.value == roles[1]) {
            await buscarSucursal(documento1);
            
            if (sucursal1.value == '') {
                router.push({ name: 'Sucursal', params: { usuario: documento1.value } });

            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido a tu cuenta'
                });
                cart.restaurante = idrestaurante.value;
                cart.nit = sucursal1.value;
                router.push({ name: 'Mesas', params: { nit: sucursal1.value } });
            }
            
        } else if (rol1.value == roles[3]) {
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido a tu cuenta'
            });
            cart.restaurante = 1414;
            cart.nit = 1111;
            cart.rol = rol1.value;
            router.push({ name: 'MesasMesero', params: { nit: 1111, rol: rol1.value } });
            
        } else if (rol1.value == roles[4]) {
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido a tu cuenta'
            });
            cart.restaurante = idrestaurante.value;
            cart.nit = sucursal1.value;
            router.push({ name: 'Cocinero' });
        }

        limpiarInputs();

        } else {

            if (!validarPassword(password.value)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de contraseña',
                    text: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y caracteres especiales.'
                });
                return; 
            }
            const response = await axios.post('http://127.0.0.1:8080/usuario', {
                documento: documento.value,
                nombre: nombre.value,
                correo: correo.value,
                password: password.value,
                rol: rol.value,
                fecha_creacion: fecha_creacion.value
            });
            console.log('Registro OK');
            Swal.fire({
                icon: 'success',
                title: 'Propietario Registrado',
                text: 'Se registró de manera exitosa'
            });

            limpiarInputs();
            toggleSignUp();
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
        toggleSignIn();
    }
};

onMounted(async () => {
if (!frmlogin.value) {
    try {
    const response = await axios.get('http://127.0.0.1:8000/propietario/documento/');
    console.log("Documentos de los propietarios ", response.data);
    } catch (error) {
    console.error("Error en la consulta de documentos", error);
    menError.value = "Error al consultar documentos";
    }
}
});

const buscardocumento = async (correo) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/usuario/correo/${correo}`); 
    documento1.value = respuesta.data;
  } catch (error) {
    console.error("Error al el documento", error);
  }
};

const buscarRol = async (correo) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/usuario/documento/${correo}`); 
    rol1.value = respuesta.data;
  } catch (error) {
    console.error("Error en el rol", error);
  }
};

const buscarid_restaurante = async (documento1) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8080/restaurante/id_usuario/${documento1}`); 
    idrestaurante.value = respuesta.data;
  } catch (error) {
    console.error("Error al el id de restaurante", error);
  }
};

const buscarSucursal = async (documento1) => {
    try {
        const respuesta = await axios.get(`http://127.0.0.1:8080/sucursal/id_usuario/${documento1.value}`); 
        sucursal1.value = respuesta.data;
    } catch (error) {
        console.error("Error al el id de restaurante", error);
    }
};

function toggleSignIn() {
    frmlogin.value = false;
    isToggled.value = true;
}

function toggleSignUp() {
    frmlogin.value = true;
    isToggled.value = false;
}

</script>
  
  
<style>
.body{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F0F4F3;
    box-shadow: 0 0 10px rgb(0,0,0,0.3);
}

.container{
    display: flex;
    position: relative;
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
}

.container-form {
    padding: 20px 40px;
    width: 100%;
    overflow: hidden;
    display: flex;
}

.container-form .sign-in{
    padding: 60px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    transition: transform 0.8s ease-in;
}

.container-form .sign-up{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.8s ease-in;
}

.container-form h2{
    font-size: 30px;
    margin-bottom: 20px;
}

.container-form a:hover{
    color: blue;
    text-decoration: underline;
}

.redes-sociales{
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
}

.redes-sociales img{
    border: 1px solid #c9cccb;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    width:15%;
    height: 30px;
}

.container-form span{
    font-size: 15px;
    margin-bottom: 15px;
}
.container-input{
    width: 300px;
    height: 80px;
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 0 15px;
    background-color: #eeeeee;
}

.container-input input{
    border: none;
    outline: none;
    width: 100%;
    height: 70px;
    font-size: 17px;
    background-color: #eeeeee;
}

.container-input img{
    width:15%;
    height: 30px;
}

.container-form a{
    color: black;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 5px;
}

.button{
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

.sign-up{
    transform: translate(-100%);
}
.container.toggle .sign-in{
    transform: translateX(100%);
}
.container.toggle .sign-up{
    transform: translateX(0);
}


/*welcome*/
.container-welcome{
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    transform: translateX(100%);
    background-color:#1e6838 ;
    transition: transform 0.5 ease-in-out,border-radius 0.5s ease-in-out;
    overflow: hidden;
    border-radius: 20% 0 0 20%;
}

.container.toggle .container-welcome{
    transform: translateX(0);
    border-radius: 0 20% 20% 0;
    background-color: #1e6838;
}

.container-welcome .welcome{
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0 50px;
    color: white;
    transition: transform 0.8s ease-in-out;
}

.welcome-sign-in{
    transform: translateX(100%);
}


.container-welcome h3{
    font-size: 40px;
}

.container-welcome p{
    font-size: 17px;
    text-align: center;
}

.container-welcome .button{
    border: 2px solid white;
    padding: 5px;
}

.container.toggle .welcome-sign-in{
    transform: translateX(0);
}

.container.toggle .welcome-sign-up{
    transform: translateX(-100%);
}

</style>

