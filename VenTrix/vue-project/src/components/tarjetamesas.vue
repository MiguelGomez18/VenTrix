<template>
  <div class="mesas-container">
    <v-btn
      v-for="mesa in mesas"
      :key="mesa.id"
      class="mesas"
      color="green darken-1"
      large
      @click="navegarARuta(mesa.id)"
    >
      <img src="./icons/table-svgrepo-com (1).svg" alt="Mesa Icon" />
      <span>{{ mesa.nombre }}</span>
    </v-btn>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useRouter, useRoute } from 'vue-router';
import { useCart } from '@/stores/cart';

const cart = useCart();
const route = useRoute();
const router = useRouter();
const mesas = ref([]); 
const nit = ref(route.params.nit);
const rol = ref(route.params.rol);
const date = new Date();
const dia = (date.getDate() < 10 ? '0':'') + date.getDate();
const mes = ((date.getMonth() + 1) < 10 ? '0':'') + (date.getMonth() + 1);
const año = date.getFullYear();
const hora = (date.getHours() < 10 ? '0':'') + date.getHours();
const minutos = (date.getMinutes() < 10 ? '0':'') + date.getMinutes();

const navegarARuta = async (mesaId) => {
  try {
    window.dispatchEvent(new Event('ocultarInicio'));

    const { data: pedidos } = await axios.get(`/mesa/${mesaId}`);
    
    let pedidoActivo = pedidos.pedido.find(p => p.estado === 'COMANDADO' || p.estado === 'LISTO');
    if (pedidoActivo) {

      router.push({ name: 'SeleccionarProductos', params: { id_mesa: mesaId, pedido: pedidoActivo.id_pedido } });
      return;
    }

    const pedidoEnCart = cart.products[mesaId];
    let pedidoCartId = null;

    if (pedidoEnCart) {
      for (const key of Object.keys(pedidoEnCart)) {

        if (pedidoEnCart[key].productos.length == 0) {
          cart.resetCart(mesaId, key);
        } else {
          pedidoCartId = key;
          break;
        }
      }
    }

    if (pedidoCartId) {
      router.push({ name: 'SeleccionarProductos', params: { id_mesa: mesaId, pedido: pedidoCartId } });
      return;
    }

    const user = ref([]);
    const { data: usuario } = await axios.get(`/usuario/${cart.documento}`);
    user.value = usuario;

    const nuevoPedido = {
      fecha_pedido: `${año}-${mes}-${dia}`,
      hora_pedido: `${hora}:${minutos}`,
      mesa: { id: mesaId },
      nombre: user.value.nombre,
      sucursal: nit.value,
      estado: 'ORDENADO',
      activo: 'ACTIVO'
    };

    const { data: pedidoCreado } = await axios.post('/pedidos', nuevoPedido);

    cart.addPedido(mesaId, pedidoCreado);
    router.push({ name: 'SeleccionarProductos', params: { id_mesa: mesaId, pedido: pedidoCreado } });
  } catch (error) {
    console.error('Error al navegar a la ruta:', error);
    Swal.fire('Error', 'Ocurrió un problema al procesar la solicitud.', 'error', 'backdrop: false', 'allowOutsideClick: false', );
  }
};



const obtenerMesas = async (nit) => {
  try {
    const response = await axios.get(`/mesa/id_sucursal/${nit.value}`); 
    mesas.value = response.data.filter(mesa => mesa.activo !== "INACTIVO"); 
    
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
  }
};

onMounted(() => {
  if (nit.value) {
    obtenerMesas(nit);
  }
});
</script>

<style scoped>
.mesas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: auto;
}

.mesas {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  background-color: #f0f0f0;
  border: 5px solid var(--color_principal);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 10px 10px;
}

.mesas img {
  width: 100px;
  height: 100px;
}

@media (max-width: 819px) {
  .mesas {
    padding: 12px;
    margin: 8px 8px;
  }

  .mesas img {
    width: 70px;
    height: 70px;
  }
}
</style>