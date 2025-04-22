<template>
    <div class="container">
        <form class="restablecimiento" @submit.prevent="restablecer">
            <label for="">Restablecimiento de Contraseña</label>
            <input type="password" placeholder="Nueva Contraseña" v-model="password" required>
            <input type="password" placeholder="Confirmar Contraseña" v-model="confirmPassword" required>
            <p class="contra" v-if="passwordMismatch">Las contraseñas no coinciden</p>
            <button type="submit">Restablecer</button>
        </form>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { computed, ref, defineProps } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';
import { useCart } from '@/stores/cart';

const props = defineProps({
    email: {
        type: String,
        required: true
    }
});

const cart = useCart();
const router = useRouter();
const correo = ref(props.email)
const password = ref('');
const confirmPassword = ref('');
const userData = ref('');

const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¡¿])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¡¿]{8,}$/;
    return regex.test(password);
};

const passwordMismatch = computed(() => {
    if (confirmPassword.value == '') {
        return false;
    }
    return password.value != confirmPassword.value || confirmPassword.value == '';
})

const buscardocumento = async (correo) => {
  try {
    const respuesta = await axios.get(`/usuario/correo/${correo}`); 
    cart.documento = respuesta.data;
  } catch (error) {
    console.error("Error en el documento", error);
  }
};

const restablecer = async () => {
    if (!validarPassword(password.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Error de contraseña',
            text: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras con almenos una mayuscula, números y caracteres especiales.',
            backdrop: false,  
            allowOutsideClick: false, 
        });
        return; 
    }
    if (password.value != confirmPassword.value || confirmPassword.value == '') {
        return;
    }
    await buscardocumento(correo.value);
    const response = await axios.get(`/usuario/${cart.documento}`);
    userData.value = response.data;
    userData.value.password = password.value;
    const response1 = await axios.put(`/usuario/${userData.value.documento}`, userData.value);

    Swal.fire({
        icon: 'success',
        title: 'Contraseña Restablecida',
        text: 'Se ha restablecido tu contraseña exitosamente.',
        backdrop: false,  
        allowOutsideClick: false, 
    });
    
    cart.resetCart();
    router.push({ path: '/registro' });
}
</script>

<style scoped>
    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        box-shadow: 10px 10px 40px 26px rgba(0, 0, 0, 0.15);
        width: 90%;
        max-width: 500px;
    }
    
    .container .restablecimiento {
        padding: 30px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: column;
        box-sizing: border-box;
    }

    .restablecimiento label {
        margin-bottom: 30px;
        font-size: 30px;
        font-weight: 900;
        text-align: center;
    }

    .restablecimiento input {
        border: none;
        outline: none;
        width: 100%;
        max-width: 400px;
        height: 45px;
        font-size: 17px;
        padding-left: 15px;
        margin-bottom: 20px;
        border-radius: 10px;
        background-color: #eeeeee;
    }

    .contra {
        color: red; 
        border-radius: 8px; 
        width: 100%;
        max-width: 400px;
        text-align: center;
        padding: 10px;
        margin-bottom: 5px;
        border: 1px solid rgba(255, 0, 0, 0.334); 
        background-color: rgba(255, 0, 0, 0.199);
    }

    .restablecimiento button {
        width: 50%;
        max-width: 200px;
        background-color: var(--color_principal);
        color: var(--color_letra_blanca);
        font-size: 15px;
        border: none;
        border-radius: 10px;
        padding: 12px 0px;
    }

    @media (max-width: 768px) {
        .restablecimiento label {
            font-size: 24px;
        }
        
        .restablecimiento input {
            height: 40px;
            font-size: 15px;
        }
    }

    @media (max-width: 480px) {
        .container {
            box-shadow: 5px 5px 20px 13px rgba(0, 0, 0, 0.15);
        }
        
        .restablecimiento {
            padding: 20px;
        }
        
        .restablecimiento label {
            font-size: 20px;
            margin-bottom: 20px;
        }
        
        .restablecimiento button {
            width: 60%;
            padding: 10px 0;
        }
    }
</style>