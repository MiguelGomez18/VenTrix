import { defineStore } from 'pinia';
import { ref } from 'vue';

// Función para definir el estado inicial del carrito
const initialState = () => ({
  products: [],
  total: 0
});

export const useCart = defineStore('cart', {
  state: initialState, // Definir el estado inicial
  actions: {
    // Método para agregar un producto al carrito
    addProduct(product) {
      this.products.push(product);
      this.total += product.precio;
    },
    // Método para reiniciar el carrito
    resetCart() {
      this.$reset(); // Reinicia al estado inicial
    }
  }
});
