import { createRouter, createWebHistory } from "vue-router";
import login from "@/components/login.vue";
import cuerpo from "@/pages/cuerpo.vue";
import inicio from "@/pages/inicio.vue";
import edicion from "@/sections/edicion.vue";
import mesas from "@/sections/mesas.vue";
import informes from "@/sections/informes.vue";
import seleccionarproductos from "@/sections/seleccionarproductos.vue";

const routes = [
  {
    path: '/registro',
    name: 'Registro',
    component: login,
  },
  {
    path: '/',
    name: 'Inicio',
    component: inicio,
  },
  {
    path: '/cuerpo',
    name: 'Cuerpo',
    component: cuerpo,
    children: [
      {
        path: 'mesas', 
        name: 'Mesas',
        component: mesas,
      },
      {
        path: 'edicion', 
        name: 'Edicion',
        component: edicion,
      },
      {
        path: 'informes', 
        name: 'Informes',
        component: informes,
      },
      {
        path: 'seleccionarproductos',
        name: 'SeleccionarProductos',
        component: seleccionarproductos,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
