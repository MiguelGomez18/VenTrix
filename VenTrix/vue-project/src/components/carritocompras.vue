<template>
  <div class="cart-container">
    <h2 class="cart-title">Carrito de Compras</h2>
    <div v-if="obtenerProductos.length === 0" class="cart-empty">
      <p>No hay productos en el carrito</p>
    </div>
    <div v-else>
      <table class="cart-table">
        <thead class="encabezado">
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in obtenerProductos" :key="producto.id_producto">
            <td data-label="Producto" :class="{ 'full-width': Rol === 'CAJERO' }">{{ producto.nombre }}</td>
            <td data-label="Cantidad" :class="{ 'full-width': Rol === 'CAJERO' }">
              <button 
                class="quantity-btn" 
                @click="disminuirCantidad(producto)" 
                :disabled="producto.disabled"
              >-</button>
              {{ producto.cantidad }}
              <button 
                class="quantity-btn1" 
                @click="aumentarCantidad(producto)" 
                :disabled="producto.disabled"
              >+</button>
            </td>
            <td data-label="Precio" :class="{ 'full-width': Rol === 'CAJERO' }">{{ producto.precio * producto.cantidad || currency }}</td>
            <td data-label="Imagen" class="tdimg" :class="{ 'full-width': Rol === 'CAJERO' }">
              <img :src="getImagen(producto.imagen)" alt="Imagen del producto" />
            </td>
            <td data-label="Descripción" :class="['tdinput',{ 'full-width': Rol === 'CAJERO' }]">
              <textarea 
                v-model="producto.descripcion" 
                placeholder="Comentarios" 
                :disabled="producto.disabled"
              ></textarea>
            </td>
            <td data-label="Acciones" :class="{ 'full-width': Rol === 'CAJERO' }">
              <button 
                class="remove-btn" 
                @click="eliminarProducto(producto)" 
                :disabled="producto.disabled"
              >Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="cart-total">Total: {{ mesaTotal || currency }}</p>
      <div class="action-buttons">
        <button v-if="pago" class="pay-btn" @click="openPaymentModal">Pagar</button>
        <button v-if="comanda" class="pay-btn" @click="comandar" :disabled="isComandado">Comandar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'; 
import { useCart } from '../stores/cart';
import { ref, computed, defineEmits, defineProps, onMounted } from 'vue';
import Swal from 'sweetalert2';
import axios from '@/axios';
import getBaseUrl from '@/getBaseUrl'

const props = defineProps({
    rol: {
    type: String,
    required: true
  }
});

const getImagen = (path) => `${getBaseUrl()}${path}`
const tamaño1 = ref(70);
const tamañoImagen = ref(80);
const isComandado = ref(false);
const emit = defineEmits();
const cartStore = useCart();
const route = useRoute(); 
const pedido = route.params.pedido;
const mesaId = route.params.id_mesa; 
const Rol = props.rol;
const pago = ref(false);
const comanda = ref(false);

const obtenerProductos = computed(() => {
  const pedidos = cartStore.products[mesaId]?.[pedido];
  return pedidos ? pedidos.productos : [];
});

const obtenerProductosDesdeAPI = async () => {
  try {
    const { data: detalles } = await axios.get(`/detalles-pedido/pedidos/${pedido}`);

    const productos = detalles.map(detalle => ({
      id_producto: detalle.producto.id_producto,
      nombre: detalle.producto.nombre,
      cantidad: detalle.cantidad,
      precio: detalle.precio_total,
      imagen: detalle.producto.imagen,
      descripcion: detalle.descripcion,
      disabled: true,
    }));

    cartStore.updateCart(mesaId, pedido, productos);
    console.log("Productos cargados desde API y actualizados en el cartStore.");

  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
};

if (Rol === "MESERO") {
  comanda.value = true;
} else if (Rol === "CAJERO") {
  pago.value = true;
  tamaño1.value = 30;
  tamañoImagen.value = 80;
} 

const mesaTotal = computed(() => {
  return obtenerProductos.value
    .filter(producto => !producto.enviado)
    .reduce((acc, producto) => acc + (producto.cantidad || 0) * (producto.precio || 0), 0);
});

const aumentarCantidad = (producto) => {
  cartStore.increaseQuantity(mesaId, pedido, producto.id_producto);
};

const disminuirCantidad = (producto) => {
  cartStore.decreaseQuantity(mesaId, pedido, producto.id_producto);
};

const eliminarProducto = (producto) => {
  cartStore.removeProduct(mesaId, pedido, producto.id_producto);
};

const openPaymentModal = () => {
  emit('open-payment-modal');
};

const comandar = async () => {
  const productos = cartStore.products[mesaId]?.[pedido];

  if (!productos || productos.productos.length === 0) {
    Swal.fire('Advertencia', 'Completa toda la información de los productos antes de comandar.', 'warning');
    return;
  }

  const nuevosProductos = productos.productos.filter(producto => !producto.disabled);

  if (nuevosProductos.length === 0) {
    Swal.fire('Advertencia', 'No hay productos nuevos para comandar.', 'warning');
    return;
  }

  try {
    for (const producto of nuevosProductos) {
      const date = new Date();
      const hora = date.getHours().toString().padStart(2, '0');
      const minutos = date.getMinutes().toString().padStart(2, '0');
      const segundos = date.getSeconds().toString().padStart(2, '0');

      const detalle = {
        cantidad: producto.cantidad,
        hora_detalle: `${hora}:${minutos}:${segundos}`,
        estado: 'PREPARANDO',
        activo: 'ACTIVO',
        descripcion: producto.descripcion,
        precio_total: producto.precio * producto.cantidad,
        sucursal: cartStore.nit,
        producto: { id_producto: producto.id_producto },
        pedido: { id_pedido: pedido },
      };
      
      await axios.post('/detalles-pedido', detalle);
    }

    await axios.put(`/pedidos/${pedido}`, {
      total_pedido: 0.0,
      estado: 'COMANDADO'
    });

    nuevosProductos.forEach(producto => {
      producto.disabled = true;
    });

    Swal.fire({
      title: 'Éxito',
      text: 'La comanda fue enviada correctamente.',
      icon: 'success',
      timer: 2000
    });
  } catch (error) {
    Swal.fire('Error', 'No se pudo enviar la comanda', 'error');
  }
};

onMounted(async () => {
  const mesa = cartStore.products[mesaId]?.[pedido];
  if (!mesa || mesa.productos.length === 0) {
    await obtenerProductosDesdeAPI();
  }
});
</script>

<style scoped>
.cart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 100px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  border: 3px solid var(--color_principal);
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

.full-width {
  width: 180px;
}

.tdimg img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.cart-title {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color: var(--color_principal);
}

.cart-empty {
  text-align: center;
  font-style: italic;
  color: #777;
  padding: 20px;
}

.cart-table {
  width: 100%;
  margin-bottom: 20px;
  border-collapse: collapse;
}

.cart-table th {
  padding: 12px;
  text-align: center;
  background-color: var(--color_principal);
  color: white;
}

.cart-table td {
  padding: 10px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #eee;
}

.cart-table .tdinput textarea {
  width: 100%;
  height: 70px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  text-align: center;
  padding: 5px;
  box-sizing: border-box;
}

.quantity-btn, .quantity-btn1, .remove-btn {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin: 0 3px;
}

.quantity-btn, .quantity-btn1 {
  background-color: #d4d4d4;
  min-width: 30px;
}

.quantity-btn:hover {
  background-color: #e74c3c;
  color: white;
}

.quantity-btn1:hover {
  background-color: var(--color_principal);
  color: white;
}

.remove-btn {
  background-color: #e74c3c;
  color: white;
}

.remove-btn:hover {
  background-color: #c0392b;
}

.cart-total {
  font-size: 25px;
  text-align: right;
  font-weight: bold;
  margin: 20px 0;
  width: 100%;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 10px;
}

.pay-btn {
  background-color: var(--color_principal);
  color: white;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.pay-btn:hover {
  background-color: #218838;
}

.pay-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Media query para tablets (820px - 1024px) */
@media (max-width: 1024px) {
  .cart-container {
    padding: 15px;
    margin-bottom: 80px;
  }
  
  .cart-title {
    font-size: 26px;
  }
  
  .cart-table {
    font-size: 14px;
  }
  
  .full-width {
    width: 140px;
  }
  
  .cart-table th, 
  .cart-table td {
    padding: 8px 5px;
  }
  
  .quantity-btn,
  .quantity-btn1,
  .remove-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .cart-total {
    font-size: 22px;
  }
  
  .pay-btn {
    padding: 10px 18px;
    font-size: 14px;
  }
  
  .tdimg img {
    width: 60px;
    height: 60px;
  }
  
  .cart-table .tdinput textarea {
    height: 60px;
    font-size: 12px;
  }
}

/* Media query para móviles (hasta 819px) */
@media (max-width: 819px) {
  .cart-container {
    padding: 10px;
    margin-bottom: 100px;
    width: 95%;
  }
  
  .cart-title {
    font-size: 22px;
    margin-bottom: 15px;
  }
  
  .encabezado {
    display: none;
  }
  
  .cart-table tbody tr {
    display: grid;
    grid-template-columns: 1fr;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    position: relative;
  }
  
  .cart-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 8px;
    border: none;
  }
  
  .cart-table td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 10px;
    color: var(--color_principal);
    flex: 1;
  }
  
  .cart-table td > *:not(:first-child) {
    flex: 2;
  }
  
  .quantity-btn,
  .quantity-btn1,
  .remove-btn {
    padding: 5px 8px;
    font-size: 12px;
  }
  
  .tdimg img {
    width: 70px;
    height: 70px;
  }
  
  .cart-table .tdinput textarea {
    height: 60px;
    font-size: 12px;
    text-align: left;
  }
  
  .cart-total {
    font-size: 20px;
    text-align: center;
    margin: 15px 0;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .pay-btn {
    width: 100%;
    padding: 10px;
  }
}
</style>