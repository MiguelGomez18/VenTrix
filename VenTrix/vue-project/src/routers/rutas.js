import { createRouter, createWebHistory } from "vue-router";
import login from "@/components/login.vue";

const routes = [
    {
        path: '/registro',
        name: 'Registro',
        component: login
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;