import { createRouter, createWebHistory } from 'vue-router' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/welcome.vue')
    },
    {
      path: '/imageProcessing/:option',
      name: 'imageProcessing',  
      component: () => import('@/views/imageProcessing/ImageProcessing.vue')
    }
  ]
})

export default router
