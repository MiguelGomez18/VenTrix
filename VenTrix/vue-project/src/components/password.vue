<template>
    <div class="container">
        <form class="correo" @submit.prevent="enviocorreo">
            <label for="">Recuperación de Contraseña</label>
            <input type="email" placeholder="Ingresa tu correo" v-model="correo" required>
            <p class="contra" v-if="verificar">El correo no esta registrado..</p>
            <p class="contra1" v-if="enviado">Enviado Exitosamente</p>
            <button type="submit">Enviar</button>
        </form>
    </div>
</template>


<script setup>
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';
import { useCart } from '@/stores/cart';

const cart = useCart();
const router = useRouter();
const correo = ref('');
const verificar = ref(false);
const enviado = ref(false);

const enviocorreo = async () => {
    try {
        console.log(correo.value);
        
        const response = await axios.post('/api/email/send', {
            to: correo.value
        });


        enviado.value = true;
        verificar.value = false;
        
        Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
            timer: 3000
        });

        cart.resetCart();
        router.push({ path: '/registro' });
        
    } catch (error) {
        if (error.response && error.response.status == 404) {
            verificar.value = true;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al enviar el correo',
            });
        }
    }
};

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

    .container .correo {
        padding: 40px 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: column;
    }

    .correo label {
        margin-bottom: 30px;
        font-size: 30px;
        font-weight: 900;
    }

    .correo input {
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

    .contra1 {
        color: #009233;
        border-radius: 8px; 
        width: 400px;
        text-align: center;
        padding: 10px;
        margin-bottom: 5px;
        border: 1px solid rgba(21, 255, 0, 0.334); 
        background-color: rgba(21, 255, 0, 0.199);
    }

    .correo button {
        width: 50%;
        background-color: var(--color_principal);
        color: var(--color_letra_blanca);
        font-size: 15px;
        border: none;
        border-radius: 10px;
        padding: 12px 0px;
    }

</style>