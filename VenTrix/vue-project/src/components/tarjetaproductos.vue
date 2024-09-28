<template>
  <div 
    class="tarjetaProducto" 
    v-for="prod in productos" 
    :key="prod.id" 
    @click="seleccionarProducto(prod)"
    :class="{ animated: selectedProductId === prod.id }"
>

      <div class="imagenProducto">
          <img src="./img/prueba_imagen_chef1.webp" alt="Imagen del producto" class="imagen" />
      </div>
      <p class="nombreProducto">{{ prod.nombre }}</p>
      <p class="valorProducto">{{ prod.precio }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCart } from '../stores/cart';
import axios from 'axios';

const productos = ref([]);
const cart = useCart();
const selectedProductId = ref(null); // Estado para el producto seleccionado

const buscar = async () => {
  try {
      const respuesta = await axios.get('http://127.0.0.1:8000/productos');
      productos.value = respuesta.data;
  } catch (error) {
      console.error("Error al cargar productos", error);
  }
};

const seleccionarProducto = (producto) => {
    cart.addProduct(producto);
    selectedProductId.value = producto.id; // Actualiza el producto seleccionado
    console.log(`Producto seleccionado: ${producto.id}`); // Agrega este log

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