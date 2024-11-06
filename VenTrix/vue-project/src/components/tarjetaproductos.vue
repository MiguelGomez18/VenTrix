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
  import { onMounted, ref } from 'vue';
  import { useCart } from '../stores/cart';
  import axios from 'axios';
  import { useRoute } from 'vue-router'; // Para obtener el mesaId de la ruta
  
  const props = defineProps({
    nit: {
        type: String,
        required: true
    }
  })

  const productos = ref([]);
  const cart = useCart();
  const selectedProductId = ref(null); // Estado para el producto seleccionado
  const route = useRoute();
  const {nit} = props
  const mesaId = route.params.id_mesa; // Obtener el id_mesa de los parámetros de la ruta
  
  const buscar = async () => {
    try {
        const respuesta = await axios.get('http://127.0.0.1:8080/producto');
        productos.value = respuesta.data;
        console.log(productos.value.imagen)
        console.log(productos.value)
    } catch (error) {
        console.error("Error al cargar productos", error);
    }
  };

  onMounted(() =>{
    if(nit) {
        console.log("NIT RECIBIDO", nit)
        buscar(nit)
    }
  })
  
  const seleccionarProducto = (producto) => {
      // Agregar mesaId al producto antes de enviarlo al carrito
      const productoConMesaId = { ...producto, mesaId };
  
      cart.addProduct(productoConMesaId); // Enviar el producto con mesaId al carrito
      selectedProductId.value = producto.id_producto; // Actualiza el producto seleccionado
      console.log(`Producto seleccionado: ${producto.id_producto} en la mesa: ${mesaId}`); // Agrega este log
  
      // Resetea el producto seleccionado después de un tiempo
      setTimeout(() => {
          selectedProductId.value = null;
      }, 300); // Debe coincidir con la duración de la animación
  };
  
  buscar();
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