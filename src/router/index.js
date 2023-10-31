import { createRouter, createWebHashHistory } from 'vue-router' 
import { useStore } from 'vuex';
const store = useStore()

const router = createRouter({
  history: createWebHashHistory(),
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
      path: '/imageProcessing',
      name: 'imageProcessing',  
      component: () => import('@/views/imageProcessing/ImageProcessing.vue'),
      meta: {
        title: 'Learn ImageProcessing'
      },
      children: [
        {
          path: '/imageProcessing/image',
          name: 'image',
          component: () => import('@/components/ImageModule.vue'),
          meta: {
            title: 'Learn ImageProcessing'
          }
        }, 
        {
          path: '/imageProcessing/video',
          name: 'video',
          component: () => import('@/components/VideoModule.vue'),
          meta: {
            title: 'Learn ImageProcessing'
          }
        }, 
        {
          path: '/imageProcessing/camera',
          name: 'camera',
          component: () => import('@/components/CameraModule.vue'),
          meta: {
            title: 'Learn ImageProcessing'
          }
        }, 
      ]
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

router.beforeEach((to, from) => {
  document.title = to.meta.title
  document.getElementsByTagName('link')[0].href = '/src/assets/icons/logo.ico'
})


export default router
