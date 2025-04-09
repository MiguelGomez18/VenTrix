import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './routers/rutas';
import axios from 'axios';

// Configurar la URL base desde .env o usar la predeterminada
axios.defaults.baseURL = 'http://localhost:8888';

// Interceptor para modificar la URL en cada solicitud
axios.interceptors.request.use((config) => {
  if (config.url.startsWith('http://127.0.0.1:8080')) {
    config.url = config.url.replace('http://127.0.0.1:8080', axios.defaults.baseURL);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

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
