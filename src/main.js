
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
// import VueWorker from "vue-worker";

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// import '@/styles/index.scss' 

import '@/styles/element.scss'

import '@/styles/common.scss'  
import '@/styles/elementDark.scss'
import App from './App.vue'
import router from './router'

import store from './store'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)

app.use(router)

app.use(ElementPlus)

// app.use(VueWorker)

app.mount('#app')
