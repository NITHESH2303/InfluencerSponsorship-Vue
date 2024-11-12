import { createRouter, createWebHistory } from 'vue-router';
import SignUp from '@/pages/SignUp.vue';
import Login from "@/pages/Login.vue";
import AdminDashboard from "@/pages/AdminDashboard.vue";
import InfluencerRegistration from "@/pages/InfluencerRegistration.vue";
import SponsorRegistration from "@/pages/SponsorRegistration.vue";
import SponsorDashboard from "@/pages/SponsorDashboard.vue";
import Unauthorized from "@/pages/Unauthorized.vue";

const routes = [
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/login', name: 'Login', component: Login },
    { path: '/unauthorized', name: 'Unauthorized', component: Unauthorized },
    { path: '/influencer/register', name: 'InfluencerRegistration', component: InfluencerRegistration },
    { path: '/sponsor/register', name: 'SponsorRegistration', component: SponsorRegistration },
    { path: '/admin/overview', name: 'AdminOverview', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
    { path: '/sponsor/dashboard', name: 'SponsorDashboard', component: SponsorDashboard, meta: { requiresAuth: true, role: 'sponsor' } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('access_token');
    const userRole = localStorage.getItem('role');
    console.log(userRole);

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({ name: 'Login' });
        } else if (to.meta.role && !userRole.includes(to.meta.role)) {
            next({ name: 'Unauthorized' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
