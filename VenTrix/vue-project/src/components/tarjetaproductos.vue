<template>
    <div class="contenedor-productos">
        <div class="titulobuscar">
        <input 
            type="text" 
            v-model="consultaBusqueda" 
            placeholder="Buscar Producto" 
        />
        </div>
        <div 
        class="tarjetaProducto" 
        v-for="prod in productosFiltrados" 
        :key="prod.id_producto" 
        @click="seleccionarProducto(prod)"
        :class="{ animated: selectedProductId === prod.id_producto }">
            <div class="imagenProducto">
              <img :src="getImagen(prod.imagen)" alt="Imagen del producto" class="imagen" />
            </div>
            <p class="nombreProducto">{{ prod.nombre }}</p>
            <p class="valorProducto">{{ prod.precio }}</p>
        </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch, computed} from 'vue';
  import { defineProps } from 'vue';
  import { useCart } from '../stores/cart';
  import axios from '@/axios';
  import getBaseUrl from '@/getBaseUrl'
  import { useRoute } from 'vue-router'; 

  const props = defineProps({
    nit: {
      type: String,
      required: true
    },
    pedido: {
      type: String,
      required: true
    }
  });

  const getImagen = (path) => `${getBaseUrl()}${path}`
  const productos = ref([]);
  const pedido = ref(props.pedido);
  const consultaBusqueda = ref('');
  const cart = useCart();
  const selectedProductId = ref(null);
  const route = useRoute();
  const mesaId = route.params.id_mesa; 
  const categoria = ref(route.params.categoria);

  if (categoria.value == 0) {
    buscar();
  }

  const buscar = async () => {
    try {
        const nit = props.nit;
        const url = categoria.value > 0
            ? `/producto/categoria/${nit}/${categoria.value}`
            : `/producto/disponibilidad/${nit}`;
        
        const respuesta = await axios.get(url);

        productos.value = respuesta.data.filter(producto => producto.activo !== "INACTIVO");

        console.log("Productos cargados: ",productos.value)
    } catch (error) {
        console.error("Error al cargar productos", error);
    }
  };

  const productosFiltrados = computed(() => {
    const searchTerm = consultaBusqueda.value.toLowerCase();
    return productos.value.filter(prod => 
        prod.nombre.toLowerCase().includes(searchTerm)
    );
  });

  onMounted(() => {
    buscar();
  });

  watch(() => route.params.categoria, (newCategoria) => {
    categoria.value = newCategoria;
    buscar();
  });
  
  const seleccionarProducto = (producto) => {
    cart.addProduct(mesaId, pedido.value, producto); 
    selectedProductId.value = producto.id_producto; 
    console.log(`Producto seleccionado: ${producto.id_producto} en la mesa: ${mesaId}`); 

    setTimeout(() => {
        selectedProductId.value = null;
    }, 300);
};
  
</script>


<style scoped>
  .contenedor-productos {
    width: 100%;
    padding: 30px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    border: solid 3px var(--color_principal);
  }

  .titulobuscar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .titulobuscar input {
    padding: 8px;
    border: 1px solid var(--color_principal);
    border-radius: 5px;
    width: 100%;
  }

  .tarjetaProducto {
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
    align-items: center; 
    border: 2px solid var(--color_principal);
    border-radius: 8px;
    max-width: 150px; 
    gap: 10px;
    cursor: pointer;
  }
  .tarjetaProducto:hover {
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
  }
  .tarjetaProducto:hover .valorProducto {
    color: var(--color_letra_blanca);
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
    text-align: center;
    display: flex;
    flex-wrap: wrap;
  }

  @media (max-width: 819px) {
    .contenedor-productos {
      margin-top: 55px;
      padding: 25px;
      gap: 10px;
    }
    .titulobuscar {
      margin-bottom: 10px;
    }
    .tarjetaProducto {
      padding: 10px 0;
      width: 46%;
    }
    .imagenProducto{
      height: 80px;
      width: 80px;
    }
  }
</style>