<template>
    <div class="login-body">
    <div :class="{ 'login-toggle': isToggled }" class="login-container">
    <div class="login-container-form">
        <form class="login-sign-in" @submit.prevent="loginPropietario">
        <h2>INICIAR SESIÓN</h2>
        <div class="login-redes-sociales">
            <a href="https://wa.me/573507113526"><img src="../components/icons/icons8-whatsapp-50.png" alt="WhatsApp"></a>
            <a href=""><img src="../components/icons/icons8-instagram-50.png" alt="Instagram"></a>
            <a href=""><img src="../components/icons/icons8-facebook-nuevo-50 (1).png" alt="Facebook"></a>
        </div>
        <span>Use su correo y su contraseña</span>
        <div class="login-container-input">
            <img src="../components/icons/icons8-correo-50.png" alt="Correo">
            <input type="email" placeholder="Email" v-model="correo" required>
        </div>
        <div class="login-container-input">
            <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña">
            <input type="password" placeholder="Password" v-model="password" required>
        </div>
        <router-link to="/password">¿Olvidaste tu contraseña?</router-link>
        <router-link to="/">Volver..</router-link>
        <router-link to="/registarcuenta">Registra Una Cuenta</router-link>
        
        <button class="login-button" type="submit">{{ frmlogin ? 'INICIAR SESIÓN' : 'REGISTRARSE' }}</button>
        </form>
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
const roles = ["ADMINISTRADOR","ADMINISTRADOR_SUCURSAL","CAJERO","MESERO","COCINA"];
const frmlogin = ref(true);
const menError = ref('');
const isToggled = ref(false);
const mesesSeleccionados = ref(cart.mes); 

const limpiarInputs = () => {
  documento.value = '';
  nombre.value = '';
  correo.value = '';
  password.value = '';
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
                if (idrestaurante.value == '') {
                    await buscarRol(correo.value);
                    cart.rol = rol1.value;
                    router.push({ name: 'Restaurante', params: { usuario: documento1.value } });
                    return;
                }
                cart.restaurante = idrestaurante.value;
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
  
  
<style scoped>
.login-body {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F0F4F3;
    box-shadow: 0 0 10px rgb(0,0,0,0.3);
    padding: 20px;
    box-sizing: border-box;
}

.login-container {
    display: flex;
    position: relative;
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
    width: 100%;
    max-width: 900px;
}

.login-container-form {
    padding: 20px 40px;
    width: 100%;
    overflow: hidden;
    display: flex;
}

.login-container-form .login-sign-in {
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    transition: transform 0.8s ease-in;
    width: 100%;
}

.login-container-form h2 {
    font-size: 30px;
    margin-bottom: 20px;
    text-align: center;
}

.login-container-form a:hover {
    color: blue;
    text-decoration: underline;
}

.login-redes-sociales {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.login-redes-sociales a {
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin: 5px;
}

.login-redes-sociales a img {
    border: 1px solid #c9cccb;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    width: 100%;
    height: 100%;
}

.login-container-form span {
    font-size: 15px;
    margin-bottom: 15px;
    text-align: center;
}

.login-container-input {
    width: 100%;
    max-width: 400px;
    height: 60px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 0 15px;
    background-color: #eeeeee;
    border-radius: 5px;
}

.login-container-input input {
    border: none;
    outline: none;
    width: 100%;
    height: 55px;
    font-size: 17px;
    background-color: #eeeeee;
}

.login-container-input img {
    width: 24px;
    height: 24px;
}

.login-container-form a {
    color: black;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 5px;
    text-align: center;
}

.login-button {
    width: 170px;
    height: 60px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    background-color: #0def5c;
    color: black;
    transition: background-color 0.3s;
}

.login-button:hover {
    background-color: #0bd153;
}

.login-toggle .login-sign-in {
    transform: translateX(100%);
}

/* Estilos responsive */
@media (max-width: 768px) {
    .login-body {
        padding: 10px;
    }
    .login-container-form {
        padding: 25px;
    }
    
    .login-container-form .login-sign-in {
        padding: 20px 0;
    }
    
    .login-container-input {
        height: 50px;
    }
    
    .login-container-input input {
        height: 45px;
        font-size: 15px;
    }
    
    .login-button {
        width: 150px;
        height: 50px;
        font-size: 15px;
    }
}

@media (max-width: 480px) {
    .login-container-form {
        padding: 25px;
    }
    
    .login-container-form h2 {
        font-size: 24px;
    }
    
    .login-container-input {
        height: 45px;
        width: 90%;
    }
    
    .login-container-input input {
        height: 40px;
        font-size: 14px;
    }
    
    .login-button {
        width: 160px;
        height: 50px;
        font-size: 14px;
    }

    .login-redes-sociales a img {
        width: 70%;
        height: 30px;
    }
}
</style>