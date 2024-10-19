<template>
  <section class="modal" v-if="showModal">
    <!-- Contenido del modal -->
    <h2>Información de forma de pago</h2>
    <article class="division">
      <h3>Total a pagar</h3>
    </article>
    <article class="division1">
      <!-- Mostrar el total del carrito formateado manualmente -->
      <span>{{ formattedTotalCarrito }}</span>
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
      <input 
        type="number" 
        class="pago" 
        v-model="method.amount" 
        :max="remainingAmount" 
        @input="validatePaymentAmount"
      />
    </div>

    <button class="pagar" :disabled="remainingAmount > 0" @click="closeModal">Pagar</button>
    <p v-if="remainingAmount > 0" class="remaining-alert">Faltan {{ formattedRemainingAmount }} para completar el pago</p>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defineEmits } from 'vue';
import { useCart } from '../stores/cart'; // Store del carrito
import { useRoute } from 'vue-router'; // Para obtener el mesaId de la ruta
import Swal from 'sweetalert2';

// Store del carrito
const cart = useCart();
const showModal = ref(true); // Controlado desde el padre
const route = useRoute();
const mesaId = route.params.id_mesa; // Obtener el id_mesa de los parámetros de la ruta

// Total del carrito
const totalCarrito = computed(() => cart.total(mesaId));

// Formatear el total del carrito como moneda
const formattedTotalCarrito = computed(() => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalCarrito.value);
});

const paymentMethods = ref([{ type: "", amount: totalCarrito.value }]);

// Para emitir el evento de cierre del modal
const emit = defineEmits(['close-modal']);

// Calcular el monto restante por pagar
const remainingAmount = computed(() => {
  const totalPaid = paymentMethods.value.reduce((acc, method) => acc + Number(method.amount || 0), 0);
  return totalCarrito.value - totalPaid;
});

// Formatear el monto restante como moneda
const formattedRemainingAmount = computed(() => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(remainingAmount.value);
});

// Validar que la suma no exceda el total del carrito
const validatePaymentAmount = () => {
  if (remainingAmount.value < 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El monto total excede el valor de la compra',
    });
  }
};

// Agregar nueva forma de pago
const addPaymentMethod = () => {
  paymentMethods.value.push({ type: "", amount: 0 });
};

// Cerrar el modal
const closeModal = () => {
  if (remainingAmount.value === 0) {
    Swal.fire({
      icon: 'success',
      title: 'Pago exitoso',
      text: 'Gracias por comprar con nosotros',
    });

    paymentMethods.value = [{ type: "", amount: 0 }];
    cart.resetCart(mesaId); // Asegúrate de pasar el 'mesaId' al método
    showModal.value = false;
    emit('close-modal');
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Pago incompleto',
      text: 'Asegúrate de cubrir el monto total antes de pagar',
    });
  }
};
</script>


<style scoped>
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    box-shadow: 0px 0px 10px rgba(75, 75, 75, 0.486);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    width: 42%;
    transition: opacity 0.4s;
    z-index: 1;
    padding: 15px 10px;
    opacity: 1; /* Cambia a 1 para que el modal sea visible */
}

/* Eliminar esta regla a menos que sea necesaria */
.modal:target {
    opacity: 1;
}

.modal h2 {
    width: 100%;
    border-radius: 10px;
    padding: 10px 0;
    background-color: var(--color_principal);
    font-family: fuente_principal;
    color: var(--color_letra_blanca);
}

.modal .division {
    width: 40%;
    margin: 30px 30px 15px;
    text-align: left;
    font-size: 20px;
}

.modal .division1 {
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

.modal .agregar {
    width: 80%;
    padding: 10px 0;
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

.pagos {
    width: 40%;
    border: 1px solid rgba(67, 67, 67, 0.234);
    padding: 10px 5px;
    margin: 10px 0;
}

.pago {
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