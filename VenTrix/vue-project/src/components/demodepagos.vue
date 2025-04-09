<template>
    
    <div class="contenedor-papa" >
    <div class="payment-container" id="cuadro">
      <h1>Realizar Pago</h1>
      <h2>Selecciona tu método de pago</h2>
  
      <div id="content">
        <div class="form-group">
          <label for="metodoPago" class="label">Método de Pago</label>
          <select v-model="metodoPago" id="metodoPago" class="select">
            <option value="" disabled>Selecciona un método</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="planes" class="label">Planes de Membresias</label>
          <select v-model="mesesSeleccionados" id="planes" class="select">
            <option value="" disabled>Seleccione un plan</option>
            <option v-for="(plan, index) in planes" :key="index" :value="plan.meses">
              {{ plan.meses }} meses - ${{ plan.precio }}
            </option>
          </select>
        </div>
  
        <button @click="realizarPago" class="plan-button">Pagar</button>
      </div>
    </div>
</div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/stores/cart';
import Swal from 'sweetalert2';
import axios from '@/axios';

const router = useRouter();
const cart = useCart();
const userData = ref('');
const metodoPago = ref('');
const mesesSeleccionados = ref('');
const fecha_finalizacion = ref('');
const planes = ref([
  { meses: 3, precio: 24900 },
  { meses: 6, precio: 54900 },
  { meses: 12, precio: 169900 }
]);

const realizarPago = async () => {
  if (!metodoPago.value) {
    Swal.fire('Error', 'Selecciona un método de pago', 'error');
    return;
  }
  if (!mesesSeleccionados.value) {
    Swal.fire('Error', 'Selecciona un plan de pago', 'error');
    return;
  }

  const valorPlan = planes.value.find(plan => plan.meses == mesesSeleccionados.value)?.precio || 0;

  const today = new Date();
  const mesNumero = parseInt(mesesSeleccionados.value);
  
  const nuevaFecha = new Date(today);
  nuevaFecha.setMonth(today.getMonth() + mesNumero);
  
  const año = nuevaFecha.getFullYear();
  const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
  const dia = nuevaFecha.getDate().toString().padStart(2, '0');
  
  fecha_finalizacion.value = `${año}-${mes}-${dia}`;

  const responseUsuario = await axios.get(`/restaurante/${cart.restaurante}`);
  userData.value = responseUsuario.data;

  const formData = new FormData();
  formData.append("nombre", userData.value.nombre);
  formData.append("descripcion", userData.value.descripcion);
  formData.append("telefono", userData.value.telefono);
  formData.append("direccion", userData.value.direccion);
  formData.append("fecha_finalizacion", fecha_finalizacion.value);
  formData.append("correo", userData.value.correo);

  try {
    const imagenUrl = `http://localhost:8888${userData.value.imagen}`;
    const respuesta = await fetch(imagenUrl);
    
    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la imagen');
    }

    const imagenBlob = await respuesta.blob();
    const imagenFile = new File([imagenBlob], userData.value.imagen.split('/imagenes/restaurantes/'+userData.value.id+'-').pop(), { type: imagenBlob.type });

    formData.append('imagen', imagenFile);
  } catch (error) {
    console.error('Error al obtener la imagen existente:', error);
  }

  const response = await axios.put(`/restaurante/${userData.value.id}`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
  });

  Swal.fire(
    'Pago Exitoso',
    `Pago de $${valorPlan} realizado con ${metodoPago.value}`,
    'success'
  ).then(() => {
    cart.resetCart();
    router.push({ 
      name: 'Registro', 
    });
  });
};
</script>
  
<style scoped>
body {
  background-color: var(--color_secundario);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.contenedor-papa {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.75rem;
    box-shadow: 40px 40px 40px 46px rgba(0, 0, 0, 0.15);
}

.payment-container {

  padding: 2rem;
  width: 90%;
  max-width: 30rem;
  border-radius: 0.75rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  background-color: white;
  text-align: center;
}

#cuadro > h1 {
  font-weight: bold;
  color: var(--color_letra);
  font-size: 2rem;
  font-family: fuente_principal;
  margin-bottom: 0.5rem;
}

#cuadro > h2 {
  color: var(--color_letra);
  font-size: 1rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.1em;
  font-family: fuente_principal;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.label {
  display: block;
  color: var(--color_letra);
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #cbd5e0;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  color: var(--color_letra);
  transition: all 0.3s ease-in-out;
}


.plan-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: white;
  background: var(--color_principal);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}



@media (max-width: 768px) {
  .payment-container {
    width: 95%;
    padding: 1.5rem;
  }
  
  .select, .plan-button {
    font-size: 0.9rem;
    padding: 0.6rem;
  }
}
</style>
