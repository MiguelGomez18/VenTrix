<template>
    <div class="body">
    <div :class="{ toggle: isToggled } " class="container">
    <div class="container-form">
        <form class="sign-in" @submit.prevent="loginPropietario">
        <h2>INICIAR SESIÓN</h2>
        <div class="redes-sociales">
            <a href="https://wa.me/573507113526"><img src="../components/icons/icons8-whatsapp-50.png" alt="WhatsApp"></a>
            <a href=""><img src="../components/icons/icons8-instagram-50.png" alt="Instagram"></a>
            <a href=""><img src="../components/icons/icons8-facebook-nuevo-50 (1).png" alt="Facebook"></a>
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
        <router-link to="/password">¿Olvidaste tu contraseña?</router-link>
        <router-link to="/">Volver..</router-link>
        <button class="button" type="submit">{{ frmlogin ? 'INICIAR SESIÓN' : 'REGISTRARSE' }}</button>
        </form>
    </div>

    <div class="container-form">
        <form class="sign-up" @submit.prevent="loginPropietario">
        <h2>REGISTRARSE</h2>
        <div class="redes-sociales">
            <a href="https://wa.me/573507113526"><img src="../components/icons/icons8-whatsapp-50.png" alt="WhatsApp"></a>
            <a href=""><img src="../components/icons/icons8-instagram-50.png" alt="Instagram"></a>
            <a href=""><img src="../components/icons/icons8-facebook-nuevo-50 (1).png" alt="Facebook"></a>
        </div>
        <span>Use su correo electrónico para registrarse</span>
        <select v-model="mesesSeleccionados">
            <option value="" disabled>Seleccione una Membresia</option>
            <option value="3">3 meses - $24.900</option>
            <option value="6">6 meses - $54.900</option>
            <option value="12">12 meses - $169.900</option>
        </select>
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
            <input type="email" placeholder="Correo" v-model="correo" required>
        </div>
        <div class="container-input">
            <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña">
            <input type="password" placeholder="Contraseña" v-model="password" required>
        </div>
        <div class="container-input">
            <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña confirmacion">
            <input type="password" placeholder="Confirmar Contraseña" v-model="confirmPassword" required>
        </div>
        <p class="contra" v-if="passwordMismatch">Las contraseñas no coinciden</p>
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
import 'sweetalert2/dist/sweetalert2.min.css';
import { computed, ref } from 'vue';
import axios from '@/axios';
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
const confirmPassword = ref('');
const roles = ["ADMINISTRADOR","ADMINISTRADOR_SUCURSAL","CAJERO","MESERO","COCINA"];
const date = new Date();
const dia = (date.getDate() < 10 ? '0':'') + date.getDate();
const mes = ((date.getMonth() + 1) < 10 ? '0':'') + (date.getMonth() + 1);
const año = date.getFullYear();
const fecha_creacion = ref(`${año}-${mes}-${dia}`);
const frmlogin = ref(true);
const menError = ref('');
const isToggled = ref(false);
const mesesSeleccionados = ref(''); 

const limpiarInputs = () => {
  documento.value = '';
  nombre.value = '';
  correo.value = '';
  password.value = '';
};

const passwordMismatch = computed(() => {
    if (confirmPassword.value == '') {
        return false;
    }
    return password.value != confirmPassword.value || confirmPassword.value == '';
})

const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¡¿])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¡¿]{8,}$/;
    return regex.test(password);
};

const loginPropietario = async () => {
    try {
        if (frmlogin.value) {

            const response = await axios.post('/usuario/login', {
                correo: correo.value,
                password: password.value
            });

            await buscardocumento(correo.value);
            cart.documento = documento1.value;
            const estadoResponse = await axios.get(`/usuario/${cart.documento}`);
            const estadoUsuario = estadoResponse.data;

            if (estadoUsuario.estado == 'INACTIVO') {
                //estadoUsuario.estado = 'ACTIVO';
                //const response = await axios.put(`/usuario/${estadoUsuario.documento}`, estadoUsuario);
                return;
            }
            
            let fechaFinalizacionStr = "";
            if (estadoUsuario.rol == "ADMINISTRADOR") {

                await buscarid_restaurante(documento1.value);
                cart.restaurante = idrestaurante.value;
                if (idrestaurante.value == '') {
                    await buscarRol(correo.value);
                    cart.rol = rol1.value;
                    router.push({ name: 'Restaurante', params: { usuario: documento1.value, mes: mesesSeleccionados.value } });
                    return;
                }
                const fechaFinalizacionResponse = await axios.get(`/restaurante/${cart.restaurante}`);
                fechaFinalizacionStr = fechaFinalizacionResponse.data.fecha_finalizacion; 
            } else if (estadoUsuario.rol == "ADMINISTRADOR_SUCURSAL") {

                await buscarSucursal(documento1);
                cart.nit = sucursal1.value;
                const response = await axios.get(`/sucursal/id_restaurante/${cart.nit}`);
                const fechaFinalizacionResponse = await axios.get(`/restaurante/${response.data}`);
                fechaFinalizacionStr = fechaFinalizacionResponse.data.fecha_finalizacion; 
            } else {

                const response = await axios.get(`/sucursal/id_restaurante/${estadoUsuario.sucursal}`);
                const fechaFinalizacionResponse = await axios.get(`/restaurante/${response.data}`);
                fechaFinalizacionStr = fechaFinalizacionResponse.data.fecha_finalizacion; 
            }

            const fechaFinalizacion = new Date(fechaFinalizacionStr);
            const hoy = new Date(); 

            const diferenciaTiempo = fechaFinalizacion - hoy; 
            const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24)); 

            console.log("Diferencia de días:", diferenciaDias);
            if (diferenciaDias >= 1 && diferenciaDias <= 4) {
                if (estadoUsuario.rol == "ADMINISTRADOR") {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Membresía por Expirar',
                        text: `Tu membresía expirará en ${diferenciaDias+1} días. Por favor, renueva tu membresía.`,
                        showCancelButton: true,
                        confirmButtonText: 'Pagar',
                        cancelButtonText: 'Cancelar',
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/demopagos';
                        }
                    });
                } else if (estadoUsuario.rol == "ADMINISTRADOR_SUCURSAL") {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Membresía por Expirar',
                        text: `Tu membresía expirará en ${diferenciaDias+1} días. Por favor, Comunicate con el Propietario.`,
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    })
                } else {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Membresía por Expirar',
                        text: `Tu membresía expirará en ${diferenciaDias+1} días. Por favor, Comunicate con el Administrador de Sucursal.`,
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    })
                }
                
            } else if (diferenciaDias == 0) {
                if (estadoUsuario.rol == "ADMINISTRADOR") {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Membresía por Expirar',
                        text: 'Tu membresía expirará mañana. Por favor, renueva tu membresía.',
                        showCancelButton: true,
                        confirmButtonText: 'Pagar',
                        cancelButtonText: 'Cancelar',
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/demopagos'; 
                        }
                    });
                } else if (estadoUsuario.rol == "ADMINISTRADOR_SUCURSAL") {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Membresía por Expirar',
                        text: 'Tu membresía expirará mañana. Por favor, Comunicate con el Propietario.',
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    })
                } else {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Membresía por Expirar',
                        text: 'Tu membresía expirará mañana. Por favor, Comunicate con el Administrador de Sucursal.',
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    })
                }

            } else if (diferenciaDias < 0) {
               
                if (estadoUsuario.rol == "ADMINISTRADOR") {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Membresía Expirada',
                        text: 'Tu membresía ha expirado. Por favor, contacta al soporte para renovarla.',
                        confirmButtonText: 'Pagar',
                        cancelButtonText: 'Cancelar',
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/demopagos'; 
                        }
                    });
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Membresía Expirada',
                        text: 'Tu membresía ha expirado. Por favor, contacta a el Propietario.',
                        backdrop: false,  // Evita problemas con el fondo modal
                        allowOutsideClick: false, 
                    });
                }
                return; 
                
            } 
            
            await buscarRol(correo.value);
            
            if (rol1.value == roles[0]) {
                
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido a tu cuenta',
                    backdrop: false,  // Evita problemas con el fondo modal
                    allowOutsideClick: false, 
                });
                cart.rol = rol1.value;
                
                router.push({ name: 'TarjetasSucursales', params: { idrestaurante: idrestaurante.value } });
                

            } else if (rol1.value == roles[1]) {
                await buscarSucursal(documento1);

                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido a tu cuenta',
                    backdrop: false,  // Evita problemas con el fondo modal
                    allowOutsideClick: false, 
                });
                cart.restaurante = idrestaurante.value;
                cart.nit = sucursal1.value;
                cart.rol = rol1.value;
                router.push({ name: 'Edicion' });
                
            } else if (rol1.value == roles[2]) {
                await buscardocumentoSucursal(documento1);
                cart.nit = sucursal1.value;
                cart.rol = rol1.value;
                router.push({ name: 'MesasMesero', params: { nit: sucursal1.value, rol: rol1.value } });
                
            } else if (rol1.value == roles[3]) {
                await buscardocumentoSucursal(documento1);
                cart.nit = sucursal1.value;
                cart.rol = rol1.value;
                router.push({ name: 'MesasMesero', params: { nit: sucursal1.value, rol: rol1.value } });

            } else if (rol1.value == roles[4]) {
                await buscardocumentoSucursal(documento1);
                cart.nit = sucursal1.value;
                cart.rol = rol1.value;
                router.push({ name: 'Pedidos', params: { nit: sucursal1.value } });
            }

            limpiarInputs();

        } else {

            if (!validarPassword(password.value)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de contraseña',
                    text: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras con almenos una mayuscula, números y caracteres especiales.',
                    backdrop: false,  // Evita problemas con el fondo modal
                    allowOutsideClick: false, 
                });
                return; 
            }
            console.log(fecha_creacion.value);
            const response = await axios.post('/usuario', {
                documento: documento.value,
                nombre: nombre.value,
                correo: correo.value,
                password: password.value,
                rol: "ADMINISTRADOR",
                fecha_creacion: fecha_creacion.value,
                estado: "ACTIVO"
            });
            
            console.log('Registro OK');
            Swal.fire({
                icon: 'success',
                title: 'Propietario Registrado',
                text: 'Se registró de manera exitosa',
                backdrop: false,  // Evita problemas con el fondo modal
                allowOutsideClick: false, 
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
        text: 'No se pudo iniciar sesión. Por favor, revisa el nombre y contraseña.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
        });
    }
};


const buscardocumento = async (correo) => {
  try {
    const respuesta = await axios.get(`/usuario/correo/${correo}`); 
    documento1.value = respuesta.data;
  } catch (error) {
    console.error("Error en el documento", error);
  }
};

const buscardocumentoSucursal = async (documento1) => {
  try {
    const respuesta = await axios.get(`/usuario/sucursal/${documento1.value}`); 
    sucursal1.value = respuesta.data;
  } catch (error) {
    console.error("Error al buscar la sucursal", error);
  }
};

const buscarRol = async (correo) => {
  try {
    const respuesta = await axios.get(`/usuario/documento/${correo}`); 
    rol1.value = respuesta.data;
  } catch (error) {
    console.error("Error en el rol", error);
  }
};

const buscarid_restaurante = async (documento1) => {
  try {
    const respuesta = await axios.get(`/restaurante/id_usuario/${documento1}`); 
    idrestaurante.value = respuesta.data;
  } catch (error) {
    console.error("Error al el id de restaurante", error);
  }
};

const buscarSucursal = async (documento1) => {
    try {
        const respuesta = await axios.get(`/sucursal/id_usuario/${documento1.value}`); 
        sucursal1.value = respuesta.data;
    } catch (error) {
        console.error("Error al buscar la sucursal", error);
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

.redes-sociales a{
    cursor: pointer;
    width: 15%;
    height: 30px;
    margin: 8px;
}

.redes-sociales a img{
    border: 1px solid #c9cccb;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    width: 100%;
    height: 30px;
}

.container-form span{
    font-size: 15px;
    margin-bottom: 15px;
}

.sign-up select {
    margin-bottom: 10px;
}

.container-input{
    width: 400px;
    height: 60px;
    margin-bottom: 15px;
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
    height: 55px;
    font-size: 17px;
    background-color: #eeeeee;
}

.contra {
    color: red; 
    border-radius: 8px; 
    width: 400px;
    text-align: center;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid rgba(255, 0, 0, 0.334); 
    background-color: rgba(255, 0, 0, 0.199);
}

.container-input img{
    width: 12%;
    height: 30px;
}

.container-form a{
    color: black;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 5px;
}

.contra {
    color: red; 
    border-radius: 8px; 
    width: 400px;
    text-align: center;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid rgba(255, 0, 0, 0.334); 
    background-color: rgba(255, 0, 0, 0.199);
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

