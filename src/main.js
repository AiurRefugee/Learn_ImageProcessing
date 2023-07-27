// import './assets/main.css' 

import Varlet from '@varlet/ui'
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/styles/element.scss'

import '@/styles/common.scss'
import '@/styles/varlet.scss'

import '@varlet/ui/es/style'

import App from './App.vue'
import router from './router'

import store from './store'

const app = createApp(App)

app.use(store)

app.use(router)

app.use(ElementPlus)

app.use(Varlet)

app.mount('#app')
