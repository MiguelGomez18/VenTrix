<template>
    <div class="contenedor-categorias">
      <div class="titulo-buscar">
        <input 
          class="input-busqueda" 
          type="text" 
          v-model="consultaBusqueda" 
          placeholder="Buscar Categoría" 
        />
      </div>
  
      <div class="categorias-lista">
        <div
          v-for="cate in categoriasFiltradas" 
          :key="cate.id" 
          class="categoria-item"
          @click="filtrocategoria('TarjetaProductos',cate.id)"
        >
          <p class="categoria-nombre">{{ cate.nombre }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, defineProps } from 'vue';
  import { useRouter, useRoute } from 'vue-router'; 
  import axios from 'axios';

  const props = defineProps({
    idrestaurante: {
    type: String,
    required: true
  }
});

  const router = useRouter(); 
  const restaurante = props.idrestaurante;
  const categorias = ref([]);
  const consultaBusqueda = ref('');
  
  const buscarCategorias = async () => {
    try {
      const respuesta1 = await axios.get(`http://127.0.0.1:8080/sucursal/id_sucursal/${restaurante}`);
      const sucursales = respuesta1.data;

      const categoriasPromises = sucursales.map(async (sucursal) => {
        const respuesta = await axios.get(`http://127.0.0.1:8080/categoria/id_sucursal/${sucursal.id}`);
        return respuesta.data;
      });

      categorias.value = (await Promise.all(categoriasPromises))
        .flat()
        .sort((a, b) => a.id - b.id); 

      console.log("Categorias cargadas:", categorias.value);
    } catch (error) {
      console.error("Error al cargar categorías", error);
    }
  };
  
  onMounted(() => {
    buscarCategorias();
  });
  
  const filtrocategoria = (name,categoria) => {
    console.log(categoria);
    router.push({ name: name, params: { categoria: categoria }});
  };

  const categoriasFiltradas = computed(() => {
    return categorias.value.filter(cate =>
      cate.nombre.toLowerCase().includes(consultaBusqueda.value.toLowerCase())
    );
  });
  </script>
  
  <style>
  .contenedor-categorias {
    width: 100%;
    padding: 30px;
    border: solid 3px var(--color_principal);
    border-radius: 10px;
  }
  
  .titulo-buscar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .input-busqueda {
    padding: 8px;
    border: 1px solid var(--color_principal);
    border-radius: 5px;
    width: 100%;
  }
  
  .categorias-lista {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .categoria-item {
    display: flex;
    align-items: center;
    border: 1px solid var(--color_principal);
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
  }
  
  .categoria-imagen {
    width: 50px; /* Tamaño de la imagen */
    height: 50px; /* Tamaño de la imagen */
    border-radius: 50%; /* Imagen redonda */
    margin-right: 10px;
  }
  
  .categoria-nombre {
    font-size: 16px;
    color: var(--color_letra_negra);
  }
  </style>
  