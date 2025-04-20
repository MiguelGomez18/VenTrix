<template>
  <div v-if="mostrar" class="modal-overlay">
    <div class="modal-content">
      <h2>Seleccionar Sucursales</h2>
      <p>Seleccione las sucursales donde desea agregar:</p>

      <div v-if="sucursales.length === 0" class="cart-empty">
        <p>No cuentas con ninguna Sucursal.</p>
      </div>
      
      <div v-if="sucursales.length != 0" class="sucursales-list">
        <table>
          <thead class="encabezado">
            <tr>
              <th>Nit</th>
              <th>Nombre</th>
              <th>Selección</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sucursal in sucursalesPaginadas" :key="sucursal.id" class="tr">
              <td :for="'sucursal-'+sucursal.id">{{ sucursal.id }}</td>
              <td :for="'sucursal-'+sucursal.id">{{ sucursal.nombre }}</td>
              <td>
                <input
                  type="checkbox"
                  :id="'sucursal-'+sucursal.id"
                  :value="sucursal.id"
                  v-model="seleccionadasLocales"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="sucursales.length != 0" class="paginacion">
        <button :disabled="paginaActual === 1" @click="paginaAnterior">Anterior</button>
        <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
        <button :disabled="paginaActual === totalPaginas" @click="paginaSiguiente">Siguiente</button>
      </div>

      <div class="modal-buttons">
        <button @click="cerrarModal">Cancelar</button>
        <button v-if="sucursales.length != 0" @click="confirmarSeleccion">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  mostrar: Boolean,
  sucursales: Array
});

const emit = defineEmits(['confirmar', 'cerrar']);

const paginaActual = ref(1);
const filasPorPagina = 4;
const seleccionadasLocales = ref([]);

// Computed para la paginación
const totalPaginas = computed(() => {
  return Math.ceil(props.sucursales.length / filasPorPagina) || 1;
});

const sucursalesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return props.sucursales.slice(inicio, fin);
});

// Métodos de paginación
const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--;
  }
};

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++;
  }
};

const cerrarModal = () => {
  paginaActual.value = 1; // Resetear paginación al cerrar
  emit('cerrar');
};

const confirmarSeleccion = () => {
  if (seleccionadasLocales.value.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Selección requerida',
      text: 'Debe seleccionar al menos una sucursal.',
      backdrop: false,
      allowOutsideClick: false,
    });
    return;
  }
  emit('confirmar', seleccionadasLocales.value);
};

// Resetear selección cuando se abre el modal
watch(() => props.mostrar, (newVal) => {
  if (newVal) {
    seleccionadasLocales.value = [];
    paginaActual.value = 1;
  }
});
</script>

<style scoped>
/* Tus estilos existentes se mantienen igual */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px); /* Añade desenfoque al fondo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.cart-empty {
  width: auto;
  text-align: center;
  font-style: italic;
  margin-top: 20px;
  color: red; 
  border-radius: 8px; 
  padding: 10px;
  border: 1px solid rgba(255, 0, 0, 0.334); 
  background-color: rgba(255, 0, 0, 0.199);
}

.sucursales-list {
  margin: 15px 0;
  max-height: 300px;
  overflow-y: auto;
}

.sucursal-item {
  margin: 8px 0;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.sucursal-item input {
  margin-right: 10px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:last-child {
  background-color: var(--color_principal);
  color: white;
}

.paginacion {
  margin-top: 10px;
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