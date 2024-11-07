<template>
  <div class="modal-backdrop ">
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
      <select class="pagos" v-model="method.type" required>
        <option value="" disabled>Seleccionar forma de pago</option>
        <option v-for="tipo in tiposPagoFiltrados" :key="tipo.id" :value="tipo.id">
            {{ tipo.descripcion }}
          </option>
      </select>
      <input 
        type="number" 
        class="pago" 
        v-model="method.amount" 
        :max="remainingAmount" 
        @input="validatePaymentAmount"
      />
    </div>

    <button class="pagar" :disabled="remainingAmount > 0 || !allPaymentMethodsValid"  @click="closeModal">Pagar</button>
    <p v-if="remainingAmount > 0" class="remaining-alert">
      Faltan {{ formattedRemainingAmount }} para completar el pago
    </p>
  </section>
</div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import { useCart } from '../stores/cart'; // Store del carrito
import { useRoute } from 'vue-router'; // Para obtener el mesaId de la ruta
import axios from 'axios';
import Swal from 'sweetalert2';

// Store del carrito
const cart = useCart();
const showModal = ref(true); // Controlado desde el padre
const route = useRoute();
const mesaId = route.params.id_mesa; // Obtener el id_mesa de los parámetros de la ruta
const tiposPago = ref([]); // Lista de tipos de pago
const tipoPago = ref({
  id: '',         // ID del tipo de pago
  descripcion: '' // Descripción del tipo de pago
});
const consultaBusqueda = ref(''); // Campo de búsqueda

// Función para cargar los tipos de pago
const buscarTiposPago = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8080/tipo_pago');
    tiposPago.value = respuesta.data; // Asignar la respuesta a la lista de tipos de pago
  } catch (error) {
    console.error("Error al cargar tipos de pago", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los tipos de pago.'
    });
  }
};

const tiposPagoFiltrados = computed(() => {
  return tiposPago.value.filter(tp =>
    tp.descripcion.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
  );
});

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

// Validar que todos los métodos de pago tengan un tipo seleccionado
const allPaymentMethodsValid = computed(() => {
  return paymentMethods.value.every(method => method.type !== "");
});

// Cerrar el modal
const closeModal = () => {
  if (remainingAmount.value === 0 && allPaymentMethodsValid.value) {
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
      text: 'Asegúrate de seleccionar un método de pago y cubrir el monto total antes de pagar',
    });
  }
};

// Llamar a buscarTiposPago cuando el componente se monte
onMounted(() => {
  buscarTiposPago();
});

</script>


<style scoped>
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Sombra más moderada para el modal */
    border-radius: 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    width: 42%;
    transition: opacity 0.4s;
    z-index: 2; /* Asegura que el modal esté por encima de la sombra de fondo */
    padding: 15px 10px;
    opacity: 1; /* Controla la visibilidad */
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* Oscurece todo el fondo */
    backdrop-filter: blur(2px); /* Añade desenfoque al fondo */
    z-index: 1; /* Coloca la sombra debajo del modal */
    opacity: 1;
    transition: opacity 0.4s;
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