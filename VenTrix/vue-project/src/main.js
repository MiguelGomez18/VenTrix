import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './routers/rutas';

const app = createApp(App);

// Configuración de Pinia con el plugin de persistencia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Filtro global para formatear monedas
app.config.globalProperties.$filters = {
  currency(value) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  },
};

// Uso de router, pinia y montaje del componente principal
app
  .use(router)
  .use(pinia)
  .mount('#app');

// Bloquear clic derecho
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});



