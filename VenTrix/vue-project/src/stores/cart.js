import { defineStore } from 'pinia';

export const useCart = defineStore('cart', {
  state: () => ({
    products: {}, // Diccionario donde la clave será id_mesa
    nit: '', 
    restaurante: '',
    rol: '',
    documento: '',
  }),
  getters: {
    // Calcula el total del carrito para una mesa específica
    total: (state) => (mesaId) => {
      const mesaProducts = state.products[mesaId] || [];
      return mesaProducts.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
    },
  },
  actions: {
    setNit(nitValue) {
      this.nit = nitValue;
    },
    setRestaurante(restauranteValue) {
      this.restaurante = restauranteValue;
    },
    setRol(rolValue) {
      this.rol = rolValue;
    },
    setDocumento(documentoValue) {
      this.documento = documentoValue;
    },
    addProduct(product) {
      const { mesaId } = product;
      if (!this.products[mesaId]) {
        this.products[mesaId] = [];
      }
      const existingProduct = this.products[mesaId].find(p => p.id_producto === product.id_producto);
      if (existingProduct) {
        existingProduct.cantidad += 1;
      } else {
        this.products[mesaId].push({ ...product, cantidad: 1 });
      }
    },
    removeProduct(mesaId, productId) {
      if (this.products[mesaId]) {
        this.products[mesaId] = this.products[mesaId].filter(p => p.id_producto !== productId);
      }
    },
    resetCart(mesaId) {
      if (mesaId) {
        this.products[mesaId] = [];
      } else {
        this.products = {};
        this.nit = '';
        this.restaurante = '';
        this.rol = '';
        this.documento = '';
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'cart', // Clave en localStorage
        storage: localStorage, // Almacenamiento en localStorage
      },
    ],
  },
});
