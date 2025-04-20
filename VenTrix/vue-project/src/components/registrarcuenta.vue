<template>
    <div class="register-container-form">
      <form class="register-sign-up" @submit.prevent="registerPropietario">
        <h2>REGISTRARSE</h2>
        <div class="register-redes-sociales">
          <a href="https://wa.me/573507113526"><img src="../components/icons/icons8-whatsapp-50.png" alt="WhatsApp"></a>
          <a href=""><img src="../components/icons/icons8-instagram-50.png" alt="Instagram"></a>
          <a href=""><img src="../components/icons/icons8-facebook-nuevo-50 (1).png" alt="Facebook"></a>
        </div>
        <span>Use su correo electrónico para registrarse</span>
        <select v-model="mesesSeleccionados" class="register-select">
          <option value="" disabled>Seleccione una Membresia</option>
          <option value="3">3 meses - $24.900</option>
          <option value="6">6 meses - $54.900</option>
          <option value="12">12 meses - $169.900</option>
        </select>
        <div class="register-input-group">
          <img src="../components/icons/icons8-tarjeta-de-identificación-50.png" alt="Documento">
          <input type="text" placeholder="Documento" v-model="documento" required>
        </div>
        <div class="register-input-group">
          <img src="../components/icons/icons8-usuario-50.png" alt="Usuario">
          <input type="text" placeholder="Nombre" v-model="nombre" required>
        </div>
        <div class="register-input-group">
          <img src="../components/icons/icons8-correo-50.png" alt="Correo">
          <input type="email" placeholder="Correo" v-model="correo" required>
        </div>
        <div class="register-input-group">
          <img src="../components/icons/icons8-contraseña-50.png" alt="Contraseña">
          <input type="password" placeholder="Contraseña" v-model="password" required>
        </div>
        <div class="register-input-group">
          <img src="../components/icons/icons8-contraseña-50.png" alt="Confirmar Contraseña">
          <input type="password" placeholder="Confirmar Contraseña" v-model="confirmPassword" required>
        </div>
        <p class="contra" v-if="passwordMismatch">Las contraseñas no coinciden</p>
        <router-link to="/" class="register-link">Volver..</router-link>
        <button class="register-button" type="submit">REGISTRARSE</button>
      </form>
    </div>
</template>
  
  <script setup>
  import Swal from 'sweetalert2';
  import { computed, ref } from 'vue';
  import axios from '@/axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const documento = ref('');
  const nombre = ref('');
  const correo = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const mesesSeleccionados = ref('');
  
  const passwordMismatch = computed(() => {
    return password.value !== confirmPassword.value && confirmPassword.value !== '';
  });
  
  const registerPropietario = async () => {
    try {
      if (passwordMismatch.value) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden.',
        });
        return;
      }
  
      const response = await axios.post('/usuario', {
        documento: documento.value,
        nombre: nombre.value,
        correo: correo.value,
        password: password.value,
        rol: "ADMINISTRADOR", // Cambia esto según tu lógica
        fecha_creacion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        estado: "ACTIVO"
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Registro Exitoso',
        text: 'Se registró de manera exitosa',
      });
  
      // Limpiar los campos después del registro
      limpiarInputs();
      router.push('/'); // Redirigir a la página principal o a donde desees
    } catch (error) {
      console.error("Error al registrar", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'No se pudo registrar. Por favor, revisa los datos ingresados.',
      });
    }
  };
  
  const limpiarInputs = () => {
    documento.value = '';
    nombre.value = '';
    correo.value = '';
    password.value = '';
    confirmPassword.value = '';
    mesesSeleccionados.value = '';
  };
  
  </script>
  
  <style scoped>
  .register-container-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      width: 100%;
      max-width: 450px;
      margin: 2rem auto;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .register-sign-up {
    width: 100%;
  }
  
  .register-container-form h2 {
      margin-bottom: 1.5rem;
      font-size: 1.75rem;
      color: #333;
      text-align: center;
  }
  
  .register-redes-sociales {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
  }

  .register-redes-sociales a {
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin: 5px;
  }
  
  .register-redes-sociales a img {
    border: 1px solid #c9cccb;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  
  .register-redes-sociales a:hover img {
      transform: scale(1.1);
  }
  
  .register-container-form span {
      display: block;
      text-align: center;
      margin-bottom: 1.5rem;
      color: #666;
      font-size: 0.95rem;
  }
  
  .register-select {
      width: 100%;
      padding: 0.75rem 1rem;
      margin-bottom: 1.25rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      background-color: #f9f9f9;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
  }
  
  .register-input-group {
      width: 90%;
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      background-color: #f5f5f5;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
  }
  
  .register-input-group:focus-within {
      background-color: #e9e9e9;
      box-shadow: 0 0 0 2px rgba(13, 239, 92, 0.2);
  }
  
  .register-input-group img {
      width: 22px;
      height: 22px;
      margin-right: 0.75rem;
      opacity: 0.7;
  }
  
  .register-input-group input {
      flex: 1;
      border: none;
      outline: none;
      height: 40px;
      font-size: 1rem;
      background-color: transparent;
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
  
  .register-link {
      display: block;
      text-align: center;
      color: #505050;
      margin: 0.75rem 0;
      font-size: 0.95rem;
      text-decoration: none;
      transition: color 0.2s ease;
  }
  
  .register-link:hover {
      color: #0000FF;
      text-decoration: underline;
  }
  
  .register-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      background-color: #0def5c;
      color: #111;
      margin-top: 1rem;
      transition: all 0.3s ease;
  }
  
  .register-button:hover {
      background-color: #0bcf4a;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(11, 207, 74, 0.2);
  }
  
  .register-button:active {
      transform: translateY(0);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
      .register-container-form {
          padding: 1.5rem;
          margin: 1rem auto;
      }
      
      .register-container-form h2 {
          font-size: 1.5rem;
      }
      
      .register-input-group {
          padding: 0.5rem 0.75rem;
      }
      
      .register-input-group input {
          font-size: 0.95rem;
      }
      
      .register-button {
          height: 44px;
      }
  }
  
  @media (max-width: 480px) {
      .register-container-form {
        width: auto;
        padding: 15px 0;
        border-radius: 8px;
        box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
      }

      .register-sign-up {
        width: 80%;
      }
      
      .register-container-form h2 {
          font-size: 1.3rem;
      }
      
      .register-redes-sociales a img {
        width: 70%;
        height: 30px;
      }
      
      .register-select {
        font-size: 0.9rem;
        width: 100%;
      }
      .register-input-group{
          font-size: 0.9rem;
          width: auto;
      }

      .contra {
        width: auto;
      }
      
      .register-button {
          height: 42px;
          font-size: 0.95rem;
      }
  }
  </style>