import { createRouter, createWebHistory } from "vue-router";
import login from "@/components/login.vue";
import registrarcuenta from "@/components/registrarcuenta.vue";
import password from "@/components/password.vue";
import passwordRestablecer from "@/components/passwordRestablecer.vue";
import cuerpo from "@/pages/cuerpo.vue";
import inicio from "@/pages/inicio.vue";
import admin from "@/pages/admin.vue";
import registroAdmin from "@/components/registroAdmin.vue";
import registroproductos from "@/components/registroproductos.vue";
import registroSucursal from "@/components/registroSucursal.vue";
import tarjetassucursales from "@/components/tarjetassucursales.vue";
import restaurante from "@/components/restaurante.vue";
import cocinero from "@/pages/cocina.vue";
import mesero from "@/pages/mesero.vue";
import edicion from "@/sections/edicion.vue";
import mesas from "@/sections/mesas.vue";
import informes from "@/sections/informes.vue";
import pedidos from "@/components/pedidos.vue";
import seleccionarproductos from "@/sections/seleccionarproductos.vue";
import sucursal from "@/components/sucursal.vue";
import tarjetaproductos from "@/components/tarjetaproductos.vue";
import settings from "@/sections/settings.vue";
import editUsuario from "@/components/editUsuario.vue";
import editSucursal from "@/components/editSucursal.vue";
import editRestaurante from "@/components/editRestaurante.vue";
import demoDePagos from "@/components/demodepagos.vue";
import empleados from "@/components/empleados.vue";


const routes = [
  {
    path: '/demopagos',
    name: 'Pagos',
    component: demoDePagos,
  },
  {
    path: '/registro',
    name: 'Registro',
    component: login,
  },
  {
    path: '/registarcuenta',
    name: 'RegistrarCuenta',
    component: registrarcuenta,
  },
  {
    path: '/password',
    name: 'Password',
    component: password,
  },
  {
    path: '/restablecer/:email',
    name: 'Restablecer',
    component: passwordRestablecer,
    props: true,
  },
  {
    path: '/',
    name: 'Inicio',
    component: inicio,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: admin,
    props: true,
    children: [
      {
        path: '/setting', 
        name: 'Ajuste',
        component: settings,
        props: true,
        children: [
          {
            path: '/editar', 
            name: 'EditUser',
            component: editUsuario
          },
          {
            path: '/editar-sucu', 
            name: 'EditSucu',
            component: editSucursal
          },
          {
            path: '/editar-resta', 
            name: 'EditResta',
            component: editRestaurante
          },
          {
            path: '/empleadoss', 
            name: 'Empleadoss',
            component: empleados
          },
        ] 
      },
      {
        path: '/tarjetasAdmin/:idrestaurante', 
        name: 'TarjetasSucursales',
        component: tarjetassucursales,
        props: true,
      },
      {
        path: 'edicionAdmin', 
        name: 'EdicionAdmin',
        component: edicion,
      },
      {
        path: 'informesAdmin', 
        name: 'InformesAdmin',
        component: informes,
      },
      {
        path: 'registroAdmin', 
        name: 'RegistroAdmin',
        component: registroAdmin,
      },
      {
        path: '/sucursal',
        name: 'Sucursal',
        component: sucursal,
      },
      {
        path: '/registroproductos',
        name: 'RegistroProductos',
        component: registroproductos,
      },
    ]
  },
  {
    path: '/restaurante/:usuario/:mes',
    name: 'Restaurante',
    component: restaurante,
    props: true,
  },
  {
    path: '/cocinero/:nit',
    name: 'Cocinero',
    component: cocinero,
    props: true,
    children: [
      {
        path: '/pedidos/:nit',
        name: 'Pedidos',
        component: pedidos,
        props: true,
      },
      {
        path: '/settingsss', 
        name: 'AjustesCocinero',
        component: settings,
        props: true,
        children: [
          {
            path: '/editar-usuariooo', 
            name: 'EditUsuarioCocinero',
            component: editUsuario
          },
        ] 
      },
    ]
  },
  {
    path: '/mesero',
    name: 'Mesero',
    component: mesero,
    children: [
      {
        path: '/settingss', 
        name: 'AjustesMesero',
        component: settings,
        props: true,
        children: [
          {
            path: '/editar-usuarioo', 
            name: 'EditUsuarioMesero',
            component: editUsuario
          },
        ] 
      },
      {
        path: '/mesas/:nit/:rol', 
        name: 'MesasMesero',
        component: mesas,
        props: true 
      },
      {
        path: '/seleccionarproductos/:id_mesa/:pedido',
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
  {
    path: '/cuerpo',
    name: 'Cuerpo',
    component: cuerpo,
    children: [
      {
        path: '/settings', 
        name: 'Ajustes',
        component: settings,
        props: true,
        children: [
          {
            path: '/editar-usuario', 
            name: 'EditUsuario',
            component: editUsuario
          },
          {
            path: '/editar-sucursal', 
            name: 'EditSucursal',
            component: editSucursal
          },
          {
            path: '/empleados', 
            name: 'Empleados',
            component: empleados
          },
        ] 
      },
      {
        path: '/registrosucursal/:nit', 
        name: 'RegistroSucursal',
        component: registroSucursal,
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
