import { createRouter, createWebHistory } from 'vue-router' 
import { useStore } from 'vuex';
const store = useStore()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/welcome.vue'),
      meta: {
        title: 'Learn ImageProcessing'
      }
    },
    {
      path: '/imageProcessing/:option',
      name: 'imageProcessing',  
      component: () => import('@/views/imageProcessing/ImageProcessing.vue'),
      meta: {
        title: 'Learn ImageProcessing'
      }
    },
    {
      path: '/noCamera/:info',
      name: 'noCamera',
      component: () => import('@/views/redirect/NoCamera.vue'),
      meta: {
        title: '设备没有可用的摄像头'
      }
    }
  ]
})

// router.beforeEach((to, from) => {
//   document.title = to.meta.title
//   document.getElementsByTagName('link')[0].href = '/src/assets/icons/logo.ico'
// })


export default router
