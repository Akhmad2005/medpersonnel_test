import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/index.vue'),
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import('../views/doctors/index.vue'),
      meta: {
        title: 'Врачи'
      }
    },
    {
      path: '/nurses',
      name: 'nurses',
      component: () => import('../views/nurses/index.vue'),
      meta: {
        title: 'Медсестры'
      }
    },
  ],
})

router.afterEach((to, from) => {
  if (document) {
    document.title = typeof to?.meta?.title === 'string' ? to.meta.title : 'Hello';
  }
});

export default router
