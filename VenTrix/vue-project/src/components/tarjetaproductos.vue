<template>
    <div 
      class="tarjetaProducto" 
      v-for="prod in productos" 
      :key="prod.id_producto" 
      @click="seleccionarProducto(prod)"
      :class="{ animated: selectedProductId === prod.id_producto }">
        <div class="imagenProducto">
            <img :src="`http://127.0.0.1:8080${prod.imagen}`" alt="Imagen del producto" class="imagen" />
        </div>
        <p class="nombreProducto">{{ prod.nombre }}</p>
        <p class="valorProducto">{{ prod.precio }}</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch} from 'vue';
  import { defineProps } from 'vue';
  import { useCart } from '../stores/cart';
  import axios from 'axios';
  import { useRoute } from 'vue-router'; 

  const props = defineProps({
    idrestaurante: {
        type: String,
        required: true
    }
  });

  const productos = ref([]);
  const cart = useCart();
  const selectedProductId = ref(null);
  const route = useRoute();
  const mesaId = route.params.id_mesa; 
  const categoria = ref(route.params.categoria);

  const buscar = async () => {
    try {
        const idrestaurante = props.idrestaurante;
        const sucursales = await axios.get(`http://127.0.0.1:8080/sucursal/id_sucursal/${idrestaurante}`);
        const productosPromises = sucursales.data.map(async (sucursal) => {
        const url = categoria.value
            ? `http://127.0.0.1:8080/producto/categoria/${sucursal.id}/${categoria.value}`
            : `http://127.0.0.1:8080/producto/disponibilidad/${sucursal.id}`;
        
        const respuesta = await axios.get(url);
        return respuesta.data;
        });

        productos.value = (await Promise.all(productosPromises)).flat().sort((a, b) => a.id_producto - b.id_producto);
        console.log("Productos cargados: ",productos.value)
    } catch (error) {
        console.error("Error al cargar productos", error);
    }
  };

  onMounted(() => {
    buscar();
  });

  watch(() => route.params.categoria, (newCategoria) => {
    categoria.value = newCategoria;
    buscar();
    setTimeout(() => {
        categoria.value = null;  
        buscar(false); 
    }, 10000); 
  });
  
  const seleccionarProducto = (producto) => {
      const productoConMesaId = { ...producto, mesaId };
  
      cart.addProduct(productoConMesaId); 
      selectedProductId.value = producto.id_producto; 
      console.log(`Producto seleccionado: ${producto.id_producto} en la mesa: ${mesaId}`); 
  
      setTimeout(() => {
          selectedProductId.value = null;
      }, 300);
  };
  
  </script>


<style>
.tarjetaProducto {
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
    gap: 1rem;
    align-items: center; 
    border: 2px solid var(--color_principal);
    border-radius: 8px;
    max-width: 150px; 
    margin: 10px;
    cursor: pointer;
}
.imagenProducto{
    height: 110px;
    width: 110px;
    overflow: hidden;
    border-radius: 50%;
}
.imagen{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.valorProducto{
    color: var(--color_principal)
}
.tarjetaProducto p{
    font-family: fuente_principal;
}
</style>