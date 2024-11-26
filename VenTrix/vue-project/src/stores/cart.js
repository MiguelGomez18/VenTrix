import { defineStore } from 'pinia';

export const useCart = defineStore('cart', {
  state: () => ({
    products: {}, // Diccionario donde la clave será id_mesa
    nit: '', 
    restaurante: '',
    rol: '',
    rapida: '',
    documento: '',
  }),
  getters: {
    // Calcula el total del carrito para una mesa específica
    total: (state) => (mesaId, pedidoId) => {
      const mesaProducts = state.products[mesaId]?.[pedidoId]?.productos || [];
      return mesaProducts.reduce(
        (acc, producto) => acc + producto.precio * producto.cantidad,
        0
      );
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
    setRapida(rapidaValue) {
      this.rapida = rapidaValue;
    },
    setDocumento(documentoValue) {
      this.documento = documentoValue;
    },
    addPedido(mesaId, id_pedido) {
      if (!this.products[mesaId]) {
        this.products[mesaId] = {};
      }
      // Aseguramos que el ID de pedido sea único dentro de la mesa
      if (!this.products[mesaId][id_pedido]) {
        this.products[mesaId][id_pedido] = { productos: [] };
      }
    },    
    addProduct(mesaId, id_pedido, producto) {
      if (!this.products[mesaId] || !this.products[mesaId][id_pedido]) {
        console.error(`Pedido con ID ${id_pedido} no encontrado en la mesa ${mesaId}.`);
        return;
      }
    
      const pedido = this.products[mesaId][id_pedido];
      const existingProduct = pedido.productos.find(p => p.id_producto === producto.id_producto && !p.disabled);
    
      if (existingProduct) {
        existingProduct.cantidad += producto.cantidad || 1;
      } else {
        pedido.productos.push({ ...producto, cantidad: 1, descripcion: '', disabled: false });
      }
    },           
    increaseQuantity(mesaId, id_pedido, productId) {
      const pedido = this.products[mesaId]?.[id_pedido];
      if (!pedido) return;
    
      const product = pedido.productos.find(p => p.id_producto === productId && !p.disabled);
      if (product) {
        product.cantidad += 1;
      }
    },
    
    decreaseQuantity(mesaId, id_pedido, productId) {
      const pedido = this.products[mesaId]?.[id_pedido];
      if (!pedido) return;
    
      const product = pedido.productos.find(p => p.id_producto === productId && !p.disabled);
      if (product && product.cantidad > 1) {
        product.cantidad -= 1;
      }
    },   
    updateCart(mesaId, pedidoId, productos) {
      if (!this.products[mesaId]) {
        this.products[mesaId] = {};
      }
      this.products[mesaId][pedidoId] = { productos };
    },    
    removeProduct(mesaId, id_pedido, productId) {
      const pedido = this.products[mesaId]?.[id_pedido];
      if (!pedido) return;
    
      // Elimina solo el primer producto con el `id_producto` coincidente
      const index = pedido.productos.findIndex(p => p.id_producto === productId && !p.disabled);
      if (index !== -1) {
        pedido.productos.splice(index, 1);
      }
    },  
    resetCart(mesaId, pedidoId) {
      if (mesaId && pedidoId) {
        if (this.products[mesaId]) {
          delete this.products[mesaId][pedidoId];
    
          if (Object.keys(this.products[mesaId]).length === 0) {
            delete this.products[mesaId];
          }
        }
      } else if (mesaId) {
        delete this.products[mesaId];
      } else {
        this.products = {};
        this.nit = '';
        this.restaurante = '';
        this.rol = '';
        this.rapida = '';
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
