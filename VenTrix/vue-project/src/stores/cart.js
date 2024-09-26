import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCart = defineStore('cart', () => {
  const products = ref([]);
  const total = ref(0);

  const addProduct = (product) => {
    products.value.push(product);
    total.value += product.precio;
  };

  return {
    products,
    total,
    addProduct,
  };
});