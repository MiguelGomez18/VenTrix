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
          <tr v-for="producto in obtenerProductos" :key="producto.id_producto" >
            <td :class="{ 'full-width': Rol === 'CAJERO' }">{{ producto.nombre }}</td>
            <td :class="{ 'full-width': Rol === 'CAJERO' }">
              <button 
                class="quantity-btn" 
                @click="disminuirCantidad(producto)" 
                :disabled="producto.disabled"
              >
                -
              </button>
              {{ producto.cantidad }}
              <button 
                class="quantity-btn1" 
                @click="aumentarCantidad(producto)" 
                :disabled="producto.disabled"
              >
                +
              </button>
            </td>
            <td :class="{ 'full-width': Rol === 'CAJERO' }">{{ producto.precio * producto.cantidad || currency }}</td>
            <td class="tdimg" :class="{ 'full-width': Rol === 'CAJERO' }" :style="{ '--tamaño-section3': `${tamañoImagen}px` }">
              <img :src="`http://127.0.0.1:8080${producto.imagen}`" alt="">
            </td>
            <td :class="['tdinput',{ 'full-width': Rol === 'CAJERO' }]" :style="{ '--tamaño-section4': `${tamaño1}px` }">
              <textarea 
                v-model="producto.descripcion" 
                placeholder="Comentarios" 
                :disabled="producto.disabled"
              ></textarea>
            </td>
            <td :class="{ 'full-width': Rol === 'CAJERO' }">
              <button 
                class="remove-btn" 
                @click="eliminarProducto(producto)" 
                :disabled="producto.disabled"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="cart-total">Total: {{ mesaTotal || currency }}</p>
      <button v-if="pago" class="pay-btn" @click="openPaymentModal">Pagar</button>
      <button v-if="comanda" class="pay-btn" @click="comandar" :disabled="isComandado">Comandar</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'; 
import { useCart } from '../stores/cart';
import { ref, computed, defineEmits, defineProps, onMounted } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const props = defineProps({
    rol: {
    type: String,
    required: true
  }
});

let tamaño1 = 70;
let tamañoImagen = 80;
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
    const { data: detalles } = await axios.get(`http://127.0.0.1:8080/detalles-pedido/pedidos/${pedido}`);

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
    obtenerProductos();
    console.log("Productos cargados desde API y actualizados en el cartStore.");

  } catch {
    obtenerProductos();
  }
  
};

if (Rol == "MESERO") {
  comanda.value = ref(true);
} else if (Rol == "CAJERO") {
  pago.value = ref(true);
  tamaño1 = 30;
  tamañoImagen = 80;
} 

const mesaTotal = computed(() => {
  return obtenerProductos.value
    .filter(producto => !producto.enviado)
    .reduce((acc, producto) => {
      const cantidad = producto.cantidad || 0;
      const precio = producto.precio || 0;
      return acc + cantidad * precio;
    }, 0);
});


// Funciones para manejar la cantidad de productos y eliminar
const aumentarCantidad = (producto) => {
  cartStore.increaseQuantity(mesaId, pedido, producto.id_producto);
};

// Disminuir cantidad
const disminuirCantidad = (producto) => {
  cartStore.decreaseQuantity(mesaId, pedido, producto.id_producto);
};

// Remover producto
const eliminarProducto = (producto) => {
  cartStore.removeProduct(mesaId, pedido, producto.id_producto);
};

// Método para abrir el modal de pago
const openPaymentModal = () => {
  emit('open-payment-modal'); // Emitir evento al padre
};

const comandar = async () => {
  const productos = cartStore.products[mesaId]?.[pedido];

  if (!productos || productos.productos.length === 0) {
    Swal.fire('Advertencia', 'Completa toda la información de los productos antes de comandar.', 'warning', 'backdrop: false', 'allowOutsideClick: false', );
    return;
  }

  const nuevosProductos = productos.productos.filter(producto => !producto.disabled);

  if (nuevosProductos.length === 0) {
    Swal.fire('Advertencia', 'No hay productos nuevos para comandar.', 'warning', 'backdrop: false','allowOutsideClick: false', );
    return;
  }

  try {
    const pedido1 = {
      id_pedido: pedido
    }
    
    for (const producto of nuevosProductos) {
      
      const date = new Date();
      const hora = (date.getHours() < 10 ? '0':'') + date.getHours();
      const minutos = (date.getMinutes() < 10 ? '0':'') + date.getMinutes();
      const segundos = (date.getSeconds() < 10 ? '0':'') + date.getSeconds();

      const detalle = {
        cantidad: producto.cantidad,
        hora_detalle: `${hora}:${minutos}:${segundos}`,
        estado: 'PREPARANDO',
        activo: 'ACTIVO',
        descripcion: producto.descripcion,
        precio_total: producto.precio * producto.cantidad,
        sucursal: cartStore.nit,
        producto: { id_producto: producto.id_producto },
        pedido: { id_pedido: pedido1.id_pedido },
      };
      console.log(detalle);
      await axios.post('http://127.0.0.1:8080/detalles-pedido', detalle);
    }

    await axios.put(`http://127.0.0.1:8080/pedidos/${pedido}`, {
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
      timer: 2000,
      backdrop: false,  // Evita problemas con el fondo modal
      allowOutsideClick: false, 
    });
  } catch (error) {
    Swal.fire('Error', 'No se pudo enviar la comanda', 'error', 'backdrop: false', 'allowOutsideClick: false', );
  }
};

onMounted(async () => {
  const mesa = cartStore.products[mesaId]?.[pedido];
  
  if (!mesa || mesa.productos.length == 0) {
    await obtenerProductosDesdeAPI();
  } else {
    obtenerProductos();
  }
});

</script>
  
  <style scoped>
  .cart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    border: 3px solid var(--color_principal);
  }

  .full-width {
    width: 180px;
  }

  .tdimg img {
    width: var(--tamaño-section3);
  }
  
  .cart-title {
    text-align: center;
    font-size: 30px;
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif ;
  }
  
  .cart-empty {
    text-align: center;
    font-style: italic;
    color: #777;
  }

  .cart-table {
    width: 100%;
    margin-bottom: 15px;
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .cart-table th{
    padding: 10px;
    text-align: center;
  }

  .cart-table td {
    padding: 5px;
    text-align: center;
  }


  .cart-table .tdinput textarea {
    display: block;
    width: 100%;
    height: var(--tamaño-section4);
    background-color: #f9f9f9;
    border: none;
    resize: none;
    text-align: center;
    box-sizing: border-box;
    padding: 3px;
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
    font-size: 25px;
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
  