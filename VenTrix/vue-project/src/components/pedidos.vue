<template>
  <div class="detalle-pedidos">
    <h1 class="titulo-cocina">📋 Detalles de Pedido</h1>
    <div class="cards-container">
      <!-- Iterar sobre los pedidos agrupados por hora -->
      <div
        v-for="(detallesPorHora, key) in detallesAgrupados"
        :key="key"
        class="card"
      >
        <h3>Pedido: {{ detallesPorHora[0].pedido.id_pedido }} </h3>
        <p><strong>Fecha:</strong> {{ detallesPorHora[0].pedido.fecha_pedido }}</p>
        <p><strong>Mesero:</strong> {{ detallesPorHora[0].pedido.nombre }}</p>

        <div
          v-for="detalle in detallesPorHora"
          :key="detalle.id_detalle_pedido"
          class="espacio_detalle"
        >
          <p><strong>Producto:</strong> {{ detalle.producto.nombre }}</p>
          <p><strong>Descripción:</strong> {{ detalle.descripcion }}</p>
          <p><strong>Cantidad:</strong> {{ detalle.cantidad }}</p>
          <p><strong>Hora:</strong> {{ detalle.hora_detalle }}</p>
        </div>

        <button @click="eliminarPedido(detallesPorHora[0].pedido.id_pedido)" class="btn-eliminar">
          Preparado
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const detallesAgrupados = ref([]); 

// Función para agrupar los detalles por id_pedido y hora_detalle
const agruparPedidos = (detalles) => {
  const agrupados = detalles.reduce((acumulador, detalle) => {
    const idPedido = detalle.pedido.id_pedido;
    const horaDetalle = detalle.hora_detalle;

    // Filtrar solo pedidos con estado "COMANDADO"
    if (detalle.pedido.estado !== 'COMANDADO') return acumulador;

    if (!acumulador[idPedido]) {
      acumulador[idPedido] = {}; // Creamos un objeto para cada id_pedido
    }

    if (!acumulador[idPedido][horaDetalle]) {
      acumulador[idPedido][horaDetalle] = [];
    }

    // Añadir el detalle en la combinación de id_pedido y hora_detalle
    acumulador[idPedido][horaDetalle].push(detalle);
    return acumulador;
  }, {});

  // Convertir el objeto a un array de los detalles agrupados por id_pedido y hora_detalle
  return Object.keys(agrupados).reduce((resultado, idPedido) => {
    const horas = agrupados[idPedido];
    Object.keys(horas).forEach((hora) => {
      resultado.push(horas[hora]);
    });
    return resultado;
  }, []);
};

const buscar = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8080/detalles-pedido');
    console.log('Datos de la API:', respuesta.data); 
    detallesAgrupados.value = agruparPedidos(respuesta.data);
    console.log('Detalles agrupados:', detallesAgrupados.value);
  } catch (error) {
    console.error('Error al cargar detalles:', error);
  }
};

const eliminarPedido = async (idPedido) => {
  try {
    // Cambiar el estado del pedido a "LISTO"
    await axios.put(`http://127.0.0.1:8080/pedidos/${idPedido}`, {
      estado: 'LISTO' // Asegúrate de que tu API esté configurada para aceptar esto
    });

    // Ahora eliminamos el pedido de la interfaz
    detallesAgrupados.value = detallesAgrupados.value.filter(
      (pedido) => pedido[0].pedido.id_pedido !== idPedido
    );
  } catch (error) {
    console.error('Error al cambiar el estado o eliminar el pedido:', error);
  }
};

onMounted(() => {
  buscar();
});
</script>

<style scoped>
.espacio_detalle{
  margin-top: 20px;
}

.detalle-pedidos {
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;

  margin-bottom: 1rem; /* Espacio entre productos */
  padding-bottom: 0.5rem; /* Espaciado interno opcional */
  border-bottom: 1px dashed #ccc;
}

.titulo-cocina {
  text-align: center;
  font-size: 1.8rem;
  color: green;
  margin-bottom: 20px;
  font-weight: bold;
  border-bottom: 2px solid green;
  padding-bottom: 10px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: start;
  align-items: start;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 280px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  color: #333;
}

.card p {
  margin: 5px 0;
  color: #555;
  font-size: 0.9rem;
}

.btn-eliminar {
  background-color: red;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 10px;
  width: 100%;
}

.btn-eliminar:hover {
  background-color: #c62828;
}
</style>
