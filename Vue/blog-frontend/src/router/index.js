import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Learning from '../views/Learning.vue';
import Hobbies from '../views/Hobbies.vue';
import AboutMe from '../views/AboutMe.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/aboutme', component: AboutMe },
  { path: '/learning', component: Learning },
  { path: '/hobbies', component: Hobbies }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;