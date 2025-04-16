<template>
        <div class="container2">
            <form class="sign-up2" @submit.prevent="loginPropietario">
            <h2>REGISTRAR ADMINISTRADOR</h2>
            <div class="container-input2">
                <img src="../components/icons/icons8-tarjeta-de-identificación-50.png" alt="Documento">
                <input type="text" placeholder="Documento" v-model="documento" required>
            </div>
            <div class="container-input2">
                <img src="../components/icons/groceriesstore_120814.png" alt="Sucursal">
                <input type="text" placeholder="Sucursal" v-model="sucursal" required>
            </div>
            <div class="container-input2">
                <img src="../components/icons/icons8-usuario-50.png" alt="Usuario">
                <input type="text" placeholder="Nombre" v-model="nombre" required>
            </div>
            <div class="container-input2">
                <img src="../components/icons/icons8-correo-50.png" alt="Correo">
                <input type="email" placeholder="Email" v-model="correo" required>
            </div>
            <div class="container-input2">
                <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña">
                <input type="password" placeholder="Password" v-model="password" required>
            </div>
            <div class="container-input2">
                <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña confirmacion">
                <input type="password" placeholder="Confirmar Contraseña" v-model="confirmPassword" required>
            </div>
            <p class="contra" v-if="passwordMismatch">Las contraseñas no coinciden</p>
            <button class="button2" type="submit">REGISTRAR</button>
            </form>
        </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, computed } from 'vue';
import axios from '@/axios';

const documento = ref('');
const sucursal = ref('');
const nombre = ref('');
const correo = ref('');
const password = ref('');
const confirmPassword = ref('');
const date = new Date();
const dia = (date.getDate() < 10 ? '0':'') + date.getDate();
const mes = ((date.getMonth() + 1) < 10 ? '0':'') + (date.getMonth() + 1);
const año = date.getFullYear();
const fecha_creacion = ref(`${año}-${mes}-${dia}`);
const menError = ref('');

const limpiarInputs = () => {
  documento.value = '';
  nombre.value = '';
  correo.value = '';
  password.value = '';
  fecha_creacion.value = '';
  sucursal.value = '';
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
        const response1 = await axios.get(`/sucursal/${sucursal.value}`);
        if (!response1.data || response1.data.value === '') {
            await Swal.fire({
                icon: 'error',
                title: 'Error en la Sucursal',
                text: 'La Sucursal no existe.',
                backdrop: false,  // Evita problemas con el fondo modal
                allowOutsideClick: false, 
            });
            return; 
        }

        if (!validarPassword(password.value)) {
            await Swal.fire({
                icon: 'error',
                title: 'Error de contraseña',
                text: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras con almenos una mayuscula, números y caracteres especiales.',
                backdrop: false,  // Evita problemas con el fondo modal
                allowOutsideClick: false, 
            });
            return;
        }

        const response = await axios.post('/usuario', {
            documento: documento.value,
            nombre: nombre.value,
            correo: correo.value,
            password: password.value,
            rol: "ADMINISTRADOR_SUCURSAL",
            fecha_creacion: fecha_creacion.value,
            sucursal: sucursal.value,
            estado: "ACTIVO"
        });

        console.log('Registro OK');
        await Swal.fire({
            icon: 'success',
            title: 'Administrador de Sucursal Registrado',
            text: 'Se registró de manera exitosa',
            backdrop: false,  // Evita problemas con el fondo modal
            allowOutsideClick: false, 
        });

        limpiarInputs();

    } catch (error) {
        console.error("Error al registrarse", error);

        await Swal.fire({
            icon: 'error',
            title: 'Error al registrar al administrador de la sucursal',
            text: 'No se pudo registrar. Por favor, revisa la sucursal y contraseña.',
            backdrop: false,  // Evita problemas con el fondo modal
            allowOutsideClick: false, 
        });

        limpiarInputs();
    }
};


</script>
  
  
<style scoped>
.container2{
    padding-top: 40px;
    margin-bottom: 80px;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.container2 .sign-up2{
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

.container2 h2{
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 30px;
}

.container2 a:hover{
    color: blue;
    text-decoration: underline;
}

.container2 span{
    font-size: 15px;
    margin-bottom: 15px;
}

.container-input2{
    width: 350px;
    height: 50px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 0 15px;
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

.container-input2 input{
    border: none;
    outline: none;
    width: 100%;
    height: 40px;
    font-size: 17px;
    background-color: #eeeeee;
}

.container-input2 img{
    width: 10%;
    height: 25px;
}

.container2 a{
    color: black;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 5px;
}

.button2{
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


@media (max-width: 1024px) and (min-width: 820px) {
  .container2 {
    width: 80%; 
  }

  .sign-up2 {
    padding: 20px; 
    max-width: 100%;
  }

  .sign-up2 h2 {
    font-size: 26px; 
    margin-bottom: 20px;
  }

  .container-input2 {
    width: 100%; 
    height: 45px;
    margin-bottom: 12px;
  }

  .container-input2 img {
    width: 20px; 
    height: 20px;
  }

  .container-input2 input {
    font-size: 15px; 
  }

  .button2 {
    width: 150px; 
    height: 50px; 
    font-size: 15px; 
  }
}


@media (max-width: 819px) {
  .container2 {
    width: 90%; 
    margin-bottom: 40px; 
    padding-top: 20px; 
  }

  .sign-up2 {
    padding: 15px; 
    border-radius: 10px; 
  }

  .sign-up2 h2 {
    font-size: 22px;
    margin-bottom: 15px;
  }

  .container-input2 {
    width: 100%; 
    height: 40px; 
    margin-bottom: 10px;
    padding: 0 10px;
  }

  .container-input2 img {
    width: 18px; 
    height: 18px;
  }

  .container-input2 input {
    font-size: 14px; 
  }

  .button2 {
    width: 130px; 
    height: 45px; 
    font-size: 14px; 
  }
}
</style>

