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
    }
    .container .restablecimiento {
        padding: 40px 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: column;
    }

    .restablecimiento label {
        margin-bottom: 30px;
        font-size: 30px;
        font-weight: 900;
    }

    .restablecimiento input {
        border: none;
        outline: none;
        width: 400px;
        height: 45px;
        font-size: 17px;
        padding-left: 15px;
        margin-bottom: 20px;
        border-radius: 10px;
        background-color: #eeeeee;
    }

    .restablecimiento button {
        width: 50%;
        background-color: var(--color_principal);
        color: var(--color_letra_blanca);
        font-size: 15px;
        border: none;
        border-radius: 10px;
        padding: 12px 0px;
    }
</style>