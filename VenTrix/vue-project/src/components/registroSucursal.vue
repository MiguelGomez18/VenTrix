<template>
    <div class="container2">
        <form class="sign-up2" @submit.prevent="loginPropietario">
        <h2>REGISTRAR PERSONAL</h2>
        <div class="container-input2">
            <img src="../components/icons/icons8-tarjeta-de-identificación-50.png" alt="Documento">
            <input type="text" placeholder="Documento" v-model="documento" required>
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
        <select v-model="rol" required>
            <option value="" disabled>Seleccione su rol...</option>
            <option v-for="ro in roles" :key="ro" :value="ro">
                {{ ro }}
            </option>
        </select>
        <button class="button2" type="submit">REGISTRAR</button>
        </form>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useRoute } from 'vue-router';
import { useCart } from '@/stores/cart';

const cart = useCart();
const route = useRoute();
const documento = ref('');
const sucursal = ref(route.params.nit);
const roles = ref(["CAJERO","MESERO","COCINA"]);
const rol = ref('');
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
confirmPassword.value = '';
rol.value = '';
};

const buscar = async () => {
    const empleados = ref([]);
    const respuesta1 = await axios.get(`/usuario/sucursales/${cart.nit}`);
    empleados.value = respuesta1.data.filter(usuario => usuario.estado !== "INACTIVO");

    for (let index = 0; index < empleados.value.length; index++) {
        if (empleados.value[index].rol == "COCINA") {           
            roles.value = roles.value.filter(r => r !== "COCINA");
        }
    }   
}

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
    if (!validarPassword(password.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Error de contraseña',
            text: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras con almenos una mayuscula, números y caracteres especiales.',
            backdrop: false,  // Evita problemas con el fondo modal
            allowOutsideClick: false, 
        });
        return; 
    };

    if (password.value != confirmPassword.value || confirmPassword.value == '') {
      return;
    }

    const response = await axios.post('/usuario', {
        documento: documento.value,
        nombre: nombre.value,
        correo: correo.value,
        password: password.value,
        rol: rol.value,
        fecha_creacion: fecha_creacion.value,
        sucursal: sucursal.value,
        estado: "ACTIVO"
    });
    console.log('Registro OK');
    Swal.fire({
        icon: 'success',
        title: `${rol.value} registrado.`,
        text: 'Se registró de manera exitosa',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
    });

    if (rol.value === "COCINA") {
      roles.value = roles.value.filter(r => r !== "COCINA");
    }

    limpiarInputs();

} catch (error) {
    console.error("Error al registrase", error);
    menError.value = "Error al iniciar sesión. Por favor, revisa el nombre de usuario y la contraseña.";
    Swal.fire({
        icon: 'error',
        title: 'Error al registrar al administrador de la sucursal',
        text: 'No se pudo registrar. Por favor, revisa la sucursal y contraseña.',
        backdrop: false,  // Evita problemas con el fondo modal
        allowOutsideClick: false, 
    });
    limpiarInputs();
}
};

onMounted(() => {
  buscar();
});


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

select {
    width: 380px;
    padding: 10px 15px;
    background-color: #eeeeee;
    margin-bottom: 15px;
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
    padding-top: 30px;
  }

  .sign-up2 {
    padding: 15px 30px;
  }

  .container2 h2 {
    font-size: 26px;
    margin-bottom: 20px;
  }

  .container-input2 {
    width: 300px;
    height: 45px;
  }

  select {
    width: 330px;
  }

  .button2 {
    width: 150px;
    height: 50px;
    font-size: 14px;
  }
}

@media (max-width: 819px) {
  .container2 {
    width: 90%;
    padding-top: 20px;
  }

  .sign-up2 {
    padding: 10px 20px;
  }

  .container2 h2 {
    font-size: 22px;
    margin-bottom: 15px;
  }

  .container-input2 {
    width: 100%;
    height: 40px;
    gap: 5px;
    padding: 0 10px;
  }

  select {
    width: 100%;
    padding: 8px 10px;
  }

  .container-input2 input {
    font-size: 15px;
  }

  .container-input2 img {
    width: 12%;
    height: 20px;
  }

  .button2 {
    width: 100%;
    height: 45px;
    font-size: 14px;
  }
}
</style>

