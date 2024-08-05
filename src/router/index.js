import { createRouter, createWebHistory } from 'vue-router';
import GiveawayList from '@/pages/index.vue';
import GiveawayDetail from '@/pages/GiveawayDetail.vue';

const routes = [
  { path: '/', name: 'GiveawayList', component: GiveawayList },
  { path: '/giveaway/:id', name: 'GiveawayDetail', component: GiveawayDetail, props: true }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
