import { createRouter, createWebHistory } from "vue-router";
import login from "@/components/login.vue";
import cuerpo from "@/pages/cuerpo.vue";
import inicio from "@/pages/inicio.vue";
import admin from "@/pages/admin.vue";
import cocinero from "@/pages/cocinero.vue";
import mesero from "@/pages/mesero.vue";
import edicion from "@/sections/edicion.vue";
import mesas from "@/sections/mesas.vue";
import informes from "@/sections/informes.vue";
import seleccionarproductos from "@/sections/seleccionarproductos.vue";
import sucursal from "@/components/sucursal.vue";
import tarjetaproductos from "@/components/tarjetaproductos.vue";

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
    path: '/sucursal/:usuario',
    name: 'Sucursal',
    component: sucursal,
    props: true // Esto permite pasar el parámetro como prop al componente
  },
  {
    path: '/admin/:idrestaurante',
    name: 'Admin',
    component: admin,
    props: true // Esto permite pasar el parámetro como prop al componente
  },
  {
    path: '/cocinero',
    name: 'Cocinero',
    component: cocinero,
    props: true // Esto permite pasar el parámetro como prop al componente
  },
  {
    path: '/mesero',
    name: 'Mesero',
    component: mesero,
    children: [
      {
        path: '/mesas/:nit/:rol', 
        name: 'MesasMesero',
        component: mesas,
        props: true 
      },
      {
        path: '/seleccionarproductosMesero/:id_mesa/:nit',
        name: 'SeleccionarProductosMesero',
        component: seleccionarproductos,
        props: true,
        children: [
          {
            path: '/tarjetaproductos/:categoria', 
            name: 'TarjetaProductos',
            component: tarjetaproductos,
            props: true,
          },
        ]
      },
    ],
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
        props: true,
        children: [
          {
            path: '/tarjetaproductos/:categoria', 
            name: 'TarjetaProductos',
            component: tarjetaproductos,
            props: true,
          },
        ]
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
