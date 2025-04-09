<template>
    <div class="contenedorpadre">
        <div>
            <table>
                <thead class="encabezado">
                    <tr>
                        <th colspan="2">Sucursales</th>
                        <th>Selección</th>
                    </tr>
                    <tr>
                        <th>Nit</th>
                        <th>Nombre</th>
                        <th>
                            <button class="btnEliminar" @click="nit = null">Reiniciar</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="tr" v-for="(sucursalItem, indice) in sucursalesPaginadas" :key="sucursalItem.id">
                        <td>{{ sucursalItem.id }}</td>
                        <td>{{ sucursalItem.nombre }}</td>
                        <td>
                            <div class="custom-radio" @click="toggleSeleccion(sucursalItem.id)">
                                <input
                                    type="radio"
                                    :checked="nit === sucursalItem.id"
                                    class="hidden-radio"
                                    :id="'radio-'+sucursalItem.id"
                                    @click="toggleSeleccion(sucursalItem.id)"
                                />
                                <label :for="'radio-'+sucursalItem.id" class="custom-radio-label">
                                    <span class="radio-indicator"></span>
                                </label>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="paginacion">
                <button :disabled="paginaActual === 1" @click="paginaActual--">Anterior</button>
                <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
                <button :disabled="paginaActual === totalPaginas" @click="paginaActual++">Siguiente</button>
            </div>
        </div>
        <productos :key="'prod-'+cart.nit"></productos>
        <tablacategoria :key="'prod-'+cart.nit"></tablacategoria>
        <tablamesas :key="'prod-'+cart.nit"></tablamesas>
        <pagosedicion :key="'prod-'+cart.nit"></pagosedicion>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from '@/axios';
import { useCart } from '@/stores/cart';
import productos from './productos.vue';
import tablacategoria from '@/components/tablacategoria.vue';
import tablamesas from '@/components/tablamesas.vue';
import pagosedicion from '@/components/pagosedicion.vue';

const cart = useCart();
const nit = ref(null); 
const sucursales = ref([]);
const paginaActual = ref(1);
const filasPorPagina = 6;

const buscarSucursales = async () => {
  try {
    const respuesta = await axios.get(`/sucursal/restaurante/${cart.restaurante}`);
    sucursales.value = respuesta.data.filter(sucursal => sucursal.estado !== "INACTIVO");
  } catch (error) {
    console.error("Error al cargar sucursales", error);
  }
};

const sucursalesFiltradas = computed(() => {
  if (!Array.isArray(sucursales.value)) {
    return [];
  }

  return sucursales.value.filter(sucursalItem =>
    sucursalItem.nombre.toLowerCase()
  );
});

const toggleSeleccion = (sucursalId) => {
  nit.value = nit.value == sucursalId ? null : sucursalId;
};

const totalPaginas = computed(() => {
  if (sucursalesFiltradas.value.length == 0) {
    return 1;
  }
  return Math.ceil(sucursalesFiltradas.value.length / filasPorPagina);
});

const sucursalesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return sucursalesFiltradas.value.slice(inicio, fin);
});

onMounted(() => {
  buscarSucursales();
  cart.nit = null;
});

watch(nit, (newVal) => {
  cart.nit = newVal;
});
</script>

<style scoped>
.contenedorpadre{
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 80%;
    margin-left: 140px;
    margin-bottom: 80px;
}

    .custom-radio {
    display: flex;
    align-items: center;
    justify-content: center;
    }

    .hidden-radio {
    position: absolute;
    opacity: 0;
    }

    .custom-radio-label {
    cursor: pointer;
    display: flex;
    align-items: center;
    }

    .radio-indicator {
    width: 20px;
    height: 20px;
    border: 2px solid #363636;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    }

    .radio-indicator::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #4CAF50;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
    }

    .hidden-radio:checked + .custom-radio-label .radio-indicator {
    border-color: #4CAF50;
    }

    .hidden-radio:checked + .custom-radio-label .radio-indicator::after {
    opacity: 1;
    }

    .paginacion {
    margin-top: 10px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    }

    .paginacion button {
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    }

    .paginacion button:disabled {
    background-color: grey;
    cursor: not-allowed;
    }

    .paginacion span {
    font-size: 14px;
    font-weight: bold;
    }

</style>