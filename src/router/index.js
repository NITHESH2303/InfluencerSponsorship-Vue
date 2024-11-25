import { createRouter, createWebHistory } from 'vue-router';
import SignUp from '@/pages/SignUp.vue';
import Login from "@/pages/Login.vue";
import AdminDashboard from "@/pages/AdminDashboard.vue";
import InfluencerRegistration from "@/pages/InfluencerRegistration.vue";
import SponsorRegistration from "@/pages/SponsorRegistration.vue";
import SponsorDashboard from "@/pages/SponsorDashboard.vue";
import Unauthorized from "@/pages/Unauthorized.vue";
import CreateCampaign from "@/pages/CreateCampaign.vue";
import {checkSponsorVerified, getInfluencerMeta} from "@/router/authGuards.js";
import EditCampaign from "@/pages/EditCampaign.vue";
import DeleteCampaign from "@/components/DeleteCampaign.vue";
import AdRequest from "@/pages/AdRequest.vue";
import AdRequestForm from "@/pages/AdRequestForm.vue";
import InfluencerDashboard from "@/pages/InfluencerDashboard.vue";
import CampaignDetails from "@/components/Campaign/CampaignDetails.vue";
import SponsorProfile from "@/pages/SponsorProfile.vue";
import InfluencerProfile from "@/pages/InfluencerProfile.vue";

const routes = [
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/login', name: 'Login', component: Login },
    { path: '/unauthorized', name: 'Unauthorized', component: Unauthorized },
    { path: '/influencer/register', name: 'InfluencerRegistration', component: InfluencerRegistration },
    { path: '/sponsor/register', name: 'SponsorRegistration', component: SponsorRegistration },
    { path: '/profile/sponsor/:sponsorId', name: 'SponsorProfile', component: SponsorProfile, props: (route) => ({sponsorId: route.params.sponsorId}) },
    { path: '/profile/influencer/:influencerId', name: 'InfluencerProfile', component: InfluencerProfile, props: (route) => ({influencerId: route.params.influencerId}) },
    { path: '/admin/overview', name: 'AdminOverview', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
    { path: '/sponsor/dashboard', name: 'SponsorDashboard', component: SponsorDashboard, meta: { requiresAuth: true, role: 'sponsor' }, beforeEnter: checkSponsorVerified, props: (route) => ({ sponsorMeta: route.params.sponsorMeta })},
    { path: '/influencer/dashboard', name: 'InfluencerDashboard', component: InfluencerDashboard, meta: {requiresAuth: true, role: 'influencer' }, beforeEnter: getInfluencerMeta, props: (route) => ({ influencerMeta: route.params.influencerMeta }) },
    { path: '/campaign/create', name: 'CreateCampaign', component: CreateCampaign, meta: { requiresAuth: true, role: 'sponsor' }, beforeEnter: checkSponsorVerified, props: (route) => ({ sponsorMeta: route.params.sponsorMeta })},
    { path: '/campaigns/:campaignId', name: 'CampaignDetails', component: CampaignDetails, props:(route) => ({ campaignId: route.params.campaignId })},
    { path: '/campaigns/:campaignId/edit', name: 'EditCampaign', component: EditCampaign, meta: { requiresAuth: true, role: 'sponsor' }, props: (route) => ({campaignId: route.params.campaignId })},
    { path: '/campaigns/:campaignId/delete', name: 'DeleteCampaign', component: DeleteCampaign, meta: {requiresAuth: true, role: 'sponsor'},props: (route) => ({campaignId: route.params.campaignId, campaignMeta: route.params.campaignMeta })},
    { path: '/campaigns/:campaignId/ads', name: 'AdRequests', component: AdRequest, props: (route) => ({campaignId: route.params.campaignId, campaignName: String(route.params.campaignName) })},
    { path: '/campaigns/:campaignId/ads/new', name: 'CreateAdRequest', component: AdRequestForm, props: (route) => ({campaignId: route.params.campaignId })},
    { path: '/campaigns/:campaignId/ads/:adId/edit', name: 'EditAdRequest', component: AdRequestForm, props: (route) => ({ adId: route.params.adId, campaignId: route.params.campaignId }) },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('access_token');
    const userRole = localStorage.getItem('role');

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
