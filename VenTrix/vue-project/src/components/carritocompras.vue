<template>
    <div class="cart-container">
      <h2 class="cart-title">Carrito de Compras</h2>
      <div v-if="products.length === 0" class="cart-empty">
        <p>No hay productos en el carrito</p>
      </div>
      <div v-else>
        <table class="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in products" :key="producto.id">
              <td>{{ producto.nombre }}</td>
              <td>
                <button class="quantity-btn" @click="disminuirCantidad(producto)">-</button>
                {{ producto.cantidad }}
                <button class="quantity-btn1" @click="aumentarCantidad(producto)">+</button>
              </td>
              <td>{{ producto.precio * producto.cantidad | currency }}</td>
              <td><button class="remove-btn" @click="eliminarProducto(producto)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
        <p class="cart-total">Total: {{ total | currency }}</p>
        <!-- Botón para abrir el modal -->
        <button class="pay-btn" @click="openPaymentModal">Pagar</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCart } from '../stores/cart';
  import { computed } from 'vue';
  import { defineEmits } from 'vue';
  
  const emit = defineEmits();
  const cartStore = useCart();
  
  const products = computed(() => cartStore.products);
  const total = computed(() => cartStore.total);
  
  const aumentarCantidad = (producto) => {
    cartStore.increaseQuantity(producto.id);
  };
  
  const disminuirCantidad = (producto) => {
    cartStore.decreaseQuantity(producto.id);
  };
  
  const eliminarProducto = (producto) => {
    cartStore.removeProduct(producto.id);
  };
  
  // Método para abrir el modal de pago
  const openPaymentModal = () => {
    emit('open-payment-modal'); // Emitir evento al padre
  };
  </script>
  
  
  <style scoped>
  .cart-container {
    width: 100%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
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
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .pay-btn:hover {
    background-color: #218838;
  }
  </style>
  