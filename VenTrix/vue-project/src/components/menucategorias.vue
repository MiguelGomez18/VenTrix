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
        <div class="categoria-item" @click="filtrocategoria('TarjetaProductos',0)">
          <p class="categoria-nombre">Todas</p>
        </div>
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
  import { useRouter } from 'vue-router'; 
  import axios from '@/axios';

  const props = defineProps({
    nit: {
    type: String,
    required: true
  }
});

  const router = useRouter(); 
  const nit = props.nit;
  const categorias = ref([]);
  const consultaBusqueda = ref('');
  
  const buscarCategorias = async () => {
    try {
      const respuesta = await axios.get(`/categoria/id_sucursal/${nit}`);
      categorias.value = respuesta.data.filter(categoria => categoria.activo !== "INACTIVO");
      
    } catch (error) {
      console.error("Error al cargar categorías", error);
    }
  };
  
  onMounted(() => {
    buscarCategorias();
  });
  
  const filtrocategoria = (name,categoria) => {
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
    position: sticky; 
    top: 75px;
    width: 100%;
    padding: 30px;
    border: solid 3px var(--color_principal);
    border-radius: 10px;
    z-index: 10;
    cursor: pointer;
    background-color: #f9f9f9;
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
    border: 1.5px solid var(--color_principal);
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    color: var(--color_letra_negra);
  }

  .categoria-item:hover {
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
  }
  
  .categoria-nombre {
    font-size: 16px;
  }

  @media (max-width: 819px) {
    .contenedor-categorias {
      top: 70px;
      padding: 15px;
    }

    .categorias-lista {
      gap: 10px;
    }
    
    .categoria-item {
      padding: 8px;
    }
    .categoria-nombre {
      font-size: 13px;
    }
  }

</style>
  