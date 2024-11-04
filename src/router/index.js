import { createRouter, createWebHistory } from 'vue-router';
import SignUp from '@/pages/SignUp.vue';
import Login from "@/pages/Login.vue";

const routes = [
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/login', name: 'Login', component: Login },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
