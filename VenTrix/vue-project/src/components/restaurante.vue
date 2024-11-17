<template>
    <div class="body1">
        <div class="container1">
            <form class="sign-up1" @submit.prevent="registerRestaurant">
                <h2>REGISTRAR RESTAURANTE</h2>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Id">
                    <input type="text" placeholder="ID Restaurante" v-model="id" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-usuario-50.png" alt="Nombre">
                    <input type="text" placeholder="Nombre" v-model="nombre" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Direccion">
                    <input type="text" placeholder="Dirección" v-model="direccion" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Ciudad">
                    <input type="text" placeholder="Ciudad" v-model="ciudad" required>
                </div>
                <div class="container-input1">
                    <img src="../components/icons/icons8-contraseña-50.png" alt="Telefono">
                    <input type="text" placeholder="Teléfono" v-model="telefono" required>
                </div>
                <router-link to="/registro">Volver..</router-link>
                <button class="button1" type="submit">REGISTRAR</button>
            </form>
        </div>
    </div>
    </template>
    
    <script setup>
    import Swal from 'sweetalert2';
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    
    const id = ref('');
    const nombre = ref('');
    const direccion = ref('');
    const ciudad = ref('');
    const telefono = ref('');
    const router = useRouter();
    
    const limpiarInputs = () => {
      id.value = '';
      nombre.value = '';
      direccion.value = '';
      ciudad.value = '';
      telefono.value = '';
    };
    
    const registerRestaurant = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/restaurante', {
                id: id.value,
                nombre: nombre.value,
                direccion: direccion.value,
                ciudad: ciudad.value,
                telefono: telefono.value,
                estado: 'ACTIVO',
            });
    
            console.log('Restaurante registrado exitosamente', response.data);
    
            Swal.fire({
                icon: 'success',
                title: 'Restaurante Registrado',
                text: 'Se registró de manera exitosa'
            });
    
            limpiarInputs();
            router.push({ name: 'Home' });
    
        } catch (error) {
            console.error("Error al registrar el restaurante", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: 'Ocurrió un problema al registrar el restaurante. Intenta nuevamente.'
            });
        }
    };
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
        justify-content: center;
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
    
    </style>
    