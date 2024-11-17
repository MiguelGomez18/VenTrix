<template>
    <div class="body1">
        <div class="container1">
            <form class="sign-up1" @submit.prevent="login">
                <h2>DATO IMPORTANTE</h2>
                <div class="container-input1">
                    <img src="../components/icons/icons8-usuario-50.png" alt="Nombre">
                    <input type="text" placeholder="Sucursal" v-model="nit" required>
                </div>
                <router-link to="/registro">Volver..</router-link>
                <button class="button1" type="submit">SUBIR</button>
            </form>
        </div>
    </div>
    </template>
    
    <script setup>
    import Swal from 'sweetalert2';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useCart } from '../stores/cart'
    
    const cart = useCart(); 
    const router = useRouter();
    const nit = ref('');
    const menError = ref('');
    
    const limpiarInputs = () => {
      nit.value = '';
    };
    
    const login = async () => {
        try {
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido a tu cuenta'
            });
            console.log('Registro OK');
    
            cart.nit = nit.value; 

            if (cart.rol == "MESERO" || cart.rol == "CAJERO") {
                router.push({ name: 'MesasMesero', params: { nit: nit.value, rol: cart.rol } });
            } else if (cart.rol == "COCINERO") {
                router.push({ name: 'Cocinero', params: { nit: nit.value } })
            }
    
            limpiarInputs();
    
        } catch (error) {
    
            console.error("Error al iniciar sesión", error);
            menError.value = "Error al iniciar sesión. Por favor, revisa el nombre de usuario y la contraseña.";
            limpiarInputs();
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