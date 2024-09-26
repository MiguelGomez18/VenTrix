import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './routers/rutas'

const app = createApp(App)
const pinia = createPinia() 

app
  .use(router)  
  .use(pinia)   
  .mount('#app') 

