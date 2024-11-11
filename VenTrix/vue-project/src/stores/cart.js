import { defineStore } from 'pinia';

// Función para definir el estado inicial del carrito
const initialState = () => ({
  products: {}, // Cambiamos a un objeto (diccionario) donde la clave será id_mesa
  nit: '', 
  restaurante: '',
  categoria: null,
});

export const useCart = defineStore('cart', {
  state: initialState,
  getters: {
    // Calcula el total del carrito para una mesa específica
    total: (state) => (mesaId) => {
      // Obtener los productos asociados a la mesa
      const mesaProducts = state.products[mesaId] || [];
      
      // Calcular el total sumando precio * cantidad de cada producto
      return mesaProducts.reduce((acc, product) => {
        return acc + product.precio * product.cantidad;
      }, 0);
    },
    getNit: (state) => {
      return state.nit;
    },
    getRestaurante: (state) => {
      return state.restaurante;
    },
    getCategoria: (state) => {
      return state.categoria;
    },
  },
  actions: {
    setNit(nitValue) {
      this.nit = nitValue;
    },
    setRestaurante(restauranteValue) {
      this.restaurante = restauranteValue;
    },
    setCategoria(categoriaValue) {
      this.categoria = categoriaValue;
    },
    // Método para agregar un producto al carrito de una mesa específica
    addProduct(product) {
      const { mesaId } = product;
      if (!this.products[mesaId]) {
        this.products[mesaId] = []; // Crea una nueva lista de productos si no existe
      }
      const existingProduct = this.products[mesaId].find(p => p.id_producto === product.id_producto);
      if (existingProduct) {
        existingProduct.cantidad += 1;
      } else {
        this.products[mesaId].push({ ...product, cantidad: 1 });
      }
    },
    
    // Método para aumentar la cantidad de un producto para una mesa específica
    increaseQuantity(mesaId, productId) {
      const product = this.products[mesaId]?.find(p => p.id_producto === productId);
      if (product) {
        product.cantidad += 1;
      }
    },
    // Método para disminuir la cantidad de un producto para una mesa específica
    decreaseQuantity(mesaId, productId) {
      const product = this.products[mesaId]?.find(p => p.id_producto === productId);
      if (product && product.cantidad > 1) {
        product.cantidad -= 1;
      }
    },
    // Método para eliminar un producto del carrito de una mesa específica
    removeProduct(mesaId, productId) {
      if (this.products[mesaId]) {
        this.products[mesaId] = this.products[mesaId].filter(p => p.id_producto !== productId);
      }
    },
    // Método para reiniciar el carrito de una mesa específica
    resetCart(mesaId) {
      if (mesaId) {
        // Reinicia solo los productos de esa mesa
        this.products[mesaId] = [];
      } else {
        // En caso de no pasar mesaId, reinicia todo el estado (opcional)
        this.$reset();
      }
    },
  }
});
