<template>
  <div class="cart-container">
    <h2 class="cart-title">Carrito de Compras</h2>
    <div v-if="mesaProducts.length === 0" class="cart-empty">
      <p>No hay productos en el carrito</p>
    </div>
    <div v-else>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in mesaProducts" :key="producto.id">
            <td>{{ producto.nombre }}</td>
            <td>
              <button class="quantity-btn" @click="disminuirCantidad(producto)">-</button>
              {{ producto.cantidad }}
              <button class="quantity-btn1" @click="aumentarCantidad(producto)">+</button>
            </td>
            <td>{{ producto.precio * producto.cantidad | currency }}</td>
            <td><img :src="`http://127.0.0.1:8080${producto.imagen}`" alt="" style="width: 80px;"></td>
            <td><button class="remove-btn" @click="eliminarProducto(producto)">Eliminar</button></td>
          </tr>
        </tbody>
      </table>
      <p class="cart-total">Total: {{ mesaTotal | currency }}</p>
      <button v-if="pago" class="pay-btn" @click="openPaymentModal">Pagar</button>
      <button v-if="comanda" class="pay-btn" @click="comandar">Comandar</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'; // Para obtener el id de la mesa
import { useCart } from '../stores/cart';
import { ref, computed, defineEmits, defineProps } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps({
    rol: {
    type: String,
    required: true
  }
});

const detalle = ref({})
const emit = defineEmits();
const cartStore = useCart();
const route = useRoute(); // Obtener la ruta actual
const mesaId = route.params.id_mesa; // Obtener el id_mesa de los parámetros de la ruta
const Rol = props.rol;
const pago = ref(false);
const comanda = ref(false);

// Computed para obtener los productos específicos de la mesa
const mesaProducts = computed(() => cartStore.products[mesaId] || []);
console.log(cartStore.products)
console.log(mesaProducts.value)

const agregarProducto = (producto) => {
  cartStore.addProduct({ ...producto, mesaId });  // Pasamos mesaId al agregar el producto
};

if (Rol == "MESERO") {
  comanda.value = ref(true);
} else if (Rol == "COCINERO") {
  pago.value = ref(true);
} else {
  pago.value = ref(true);
  comanda.value = ref(true);
}

// Computed para obtener el total de la mesa
const mesaTotal = computed(() => cartStore.total(mesaId));

// Funciones para manejar la cantidad de productos y eliminar
const aumentarCantidad = (producto) => {
  cartStore.increaseQuantity(mesaId, producto.id_producto);
};

const disminuirCantidad = (producto) => {
  cartStore.decreaseQuantity(mesaId, producto.id_producto);
};

const eliminarProducto = (producto) => {
  cartStore.removeProduct(mesaId, producto.id_producto);
};

// Método para abrir el modal de pago
const openPaymentModal = () => {
  emit('open-payment-modal'); // Emitir evento al padre
};

const comandar = () => {
  const element = [];
  element.value = cartStore.products[mesaId];
  element.value.forEach(element1 => {
    detalle.value = {
      cantidad: element1.cantidad,
      precio_unitario: element1.precio,
      precio_total: element1.precio * element1.cantidad,
      producto: {
        id_producto: element1.id_producto
      }
    }
    console.log(detalle.value);
  });
  Swal.fire({
    icon: 'success',
    title: 'Ticket exitoso',
    text: 'Ha sido enviado a cocina',
  });
};
</script>
  
  <style scoped>
  .cart-container {
    width: 100%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    border: 3px solid var(--color_principal);
  }
  
  .cart-title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
  
  .cart-empty {
    text-align: center;
    font-style: italic;
    color: #777;
  }
  
  .cart-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }
  
  .cart-table th,
  .cart-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
    border: 2px solid var(--color_principal);
  }
  
  .quantity-btn,.quantity-btn1,
  .remove-btn {
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .quantity-btn {
    background-color: #d4d4d4;
  }

  .quantity-btn1 {
    background-color: #d4d4d4;
  }
  
  .quantity-btn:hover {
    background-color: #e74c3c;
  }

  .quantity-btn1:hover {
    background-color: var(--color_principal);
  }
  
  .remove-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .remove-btn:hover {
    background-color: #c0392b;
  }
  
  .cart-total {
    font-size: 1.2rem;
    text-align: right;
    font-weight: bold;
  }
  
  .pay-btn {
    background-color: var(--color_principal);
    color: white;
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .pay-btn:hover {
    background-color: #218838;
  }
  </style>
  