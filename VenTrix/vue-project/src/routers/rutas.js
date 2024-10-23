import { createRouter, createWebHistory } from "vue-router";
import login from "@/components/login.vue";
import cuerpo from "@/pages/cuerpo.vue";
import inicio from "@/pages/inicio.vue";
import edicion from "@/sections/edicion.vue";
import mesas from "@/sections/mesas.vue";
import informes from "@/sections/informes.vue";
import seleccionarproductos from "@/sections/seleccionarproductos.vue";
import sucursal from "@/components/sucursal.vue";

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
    path: '/sucursal/:documento',
    name: 'Sucursal',
    component: sucursal,
    props: true // Esto permite pasar el parámetro como prop al componente
  },
  {
    path: '/cuerpo',
    name: 'Cuerpo',
    component: cuerpo,
    children: [
      {
        path: '/mesas/:nit', 
        name: 'Mesas',
        component: mesas,
        props: true 
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
        path: '/seleccionarproductos/:id_mesa/:nit',
        name: 'SeleccionarProductos',
        component: seleccionarproductos,
        props: true
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
