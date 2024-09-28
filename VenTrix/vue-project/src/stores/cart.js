import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Función para definir el estado inicial del carrito
const initialState = () => ({
  products: [],
});

export const useCart = defineStore('cart', {
  state: initialState, // Definir el estado inicial
  getters: {
    // Calcula el total del carrito dinámicamente
    total: (state) => {
      return state.products.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
    },
  },
  actions: {
    // Método para agregar un producto al carrito
    addProduct(product) {
      const existingProduct = this.products.find(p => p.id === product.id);

      if (existingProduct) {
        // Si el producto ya existe, aumentar la cantidad
        existingProduct.cantidad += 1;
      } else {
        // Si es nuevo, agregar el producto con cantidad 1
        this.products.push({ ...product, cantidad: 1 });
      }
    },
    // Método para aumentar la cantidad de un producto
    increaseQuantity(productId) {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        product.cantidad += 1;
      }
    },
    // Método para disminuir la cantidad de un producto
    decreaseQuantity(productId) {
      const product = this.products.find(p => p.id === productId);
      if (product && product.cantidad > 1) {
        product.cantidad -= 1;
      }
    },
    // Método para eliminar un producto del carrito
    removeProduct(productId) {
      this.products = this.products.filter(p => p.id !== productId);
    },
    // Método para reiniciar el carrito
    resetCart() {
      this.$reset(); // Reinicia al estado inicial
    }
  }
});

