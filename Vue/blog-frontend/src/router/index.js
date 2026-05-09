import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Learning from '../views/Learning.vue';
import Hobbies from '../views/Hobbies.vue';
import AboutMe from '../views/AboutMe.vue';
import VueTest1 from '@/views/Learning/VueProject/VueTest1.vue';
import ToDoApp from '@/views/Learning/VueProject/VueTest2/ToDoApp.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/learning', component: Learning },
  { path: '/learning/vueproject/vuetest1', component: VueTest1 },
  { path: '/learning/vueproject/vuetest2/todoapp', component: ToDoApp },
  { path: '/hobbies', component: Hobbies },
  { path: '/aboutme', component: AboutMe }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;