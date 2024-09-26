<template>
  <div class="boton">
    <a href="#pago" @click="openModal" class="target">PAGAR</a>
  </div>
  <section class="modal" v-if="showModal" id="pago">
    <h2>Información de forma de pago</h2>
    <article class="division">
      <h3>Total a pagar</h3>
    </article>
    <article class="division1">
      <!-- Mostrar el total desde el store de Pinia -->
      <span>{{ cart.total }}</span> 
    </article>
    <span class="linea"></span>
    <button class="agregar" @click="addPaymentMethod">Agregar Forma de pago</button>

    <div v-for="(method, index) in paymentMethods" :key="index" class="payment-method">
      <select class="pagos" v-model="method.type">
        <option value="">Seleccionar forma de pago</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Credito">Crédito</option>
        <option value="Nota Credito">Nota Crédito</option>
        <option value="Puntos">Puntos</option>
        <option value="Tarjeta de credito">Tarjeta de crédito</option>
        <option value="Tarjeta debito">Tarjeta débito</option>
        <option value="Tranferencias bancarias">Transferencias bancarias</option>
        <option value="Nequi">Nequi</option>
        <option value="Daviplata">Daviplata</option>
      </select>
      <input type="number" class="pago" v-model="method.amount" />
    </div>

    <button class="pagar" @click="closeModal">Pagar</button>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useCart } from '../stores/cart'; 
import Swal from 'sweetalert2';

const cart = useCart(); // Obtener el estado global del carrito

const showModal = ref(false);
const paymentMethods = ref([
  {
    type: "",
    amount: 0
  }
]);

const openModal = () => {
  showModal.value = true;
};

// Agregar una nueva forma de pago
const addPaymentMethod = () => {
  paymentMethods.value.push({
    type: "",
    amount: 0
  });
};

const closeModal = () => {
  showModal.value = false;

  Swal.fire({
    icon: 'success',
    title: 'Pago exitoso',
    text: 'Gracias por comprar con nosotros'
  });

  // Limpiar los métodos de pago
  paymentMethods.value = [
    {
      type: "",
      amount: 0
    }
  ];

  cart.$reset();
};
</script>



<style>
.boton {
    padding: 20px;
    margin: 30px;
    width: 70px;
    background-color: chartreuse;
    border-radius: 20px;
    font-family: fuente_principal;
    font-size: 20px;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    box-shadow: 0px 0px 10px 1000px rgba(75, 75, 75, 0.486);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    width: 42%;
    transition: opacity 0.4s;
    opacity: 0;
    z-index: 1;
    padding: 15px 10px;
}

.modal:target {
    opacity: 1;
}

.modal h2{
    width: 100%;
    border-radius: 10px;
    padding: 10px 0px;
    background-color: var(--color_principal);
    font-family: fuente_principal;
    color: var(--color_letra_blanca);
}

.modal .division{
    width: 40%;
    margin: 30px 30px 15px;
    text-align: left;
    font-size: 20px;
}

.modal .division1{
    width: 40%;
    margin: 30px 20px 5px;
    text-align: right;
    font-size: 50px;
    font-family: fuente_principal;
    color: green;
    padding: 10px 10px;
}

.linea {
    width: 90%;
    margin-bottom: 50px;
    border-bottom: 1px solid rgba(67, 67, 67, 0.234);
}

.modal .agregar{
    width: 80%;
    padding: 10px 0px;
    background-color: var(--color_principal);
    border: 0;
    color: var(--color_letra_blanca);
    margin-bottom: 30px;
}

.payment-method {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;
}

.pagos{
    width: 40%;
    border: 1px solid rgba(67, 67, 67, 0.234);
    padding: 10px 5px;
    margin: 10px 0;
}

.pago{
    width: 40%;
    text-align: right;
    border: 1px solid rgba(67, 67, 67, 0.234);
    padding: 10px 10px;
}

.pagar {
    margin-top: 30px;
    padding: 15px;
    background-color: var(--color_principal);
    font-size: 15px;
    border: 0;
    border-radius: 5px;
    color: var(--color_letra_blanca);
}
</style>