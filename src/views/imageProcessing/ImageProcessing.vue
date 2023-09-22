<script setup>
import { onMounted, ref, computed, nextTick, inject} from 'vue'
import ControlBar from '@/components/ControlBar.vue';
import CameraModule from '@/components/CameraModule.vue';
import ImageModule from '@/components/ImageModule.vue';
import VideoModule from '@/components/VideoModule.vue';
import Drawer from '@/components/Drawer.vue';
import { ElMessage } from 'element-plus';  
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import router from '../../router'; 
const store = useStore() 
const route = useRoute()  



// refs
const image = ref(null)
const video = ref(null)
const camera = ref(null)

// computed
const curOpt = computed( () => store.getters.currentOption )
const cameraStatus = computed( () => store.getters.cameraStatus ) 

onMounted( async () => { 
  store.dispatch('initWorker')   
  store.dispatch('systemInit')  
  setTimeout(async () => {
    await nextTick()
    console.log(curOpt.value)
    if(!curOpt.value) {
      store.dispatch('set_currentOption', 'image')
      router.push({
        path: `/imageProcessing/image`,
        replace: true
      })
    }
  }, 2000)
})

function outputImage() { 
  if (curOpt.value == 'image') {
    image.value.outputImage()
  } 
}

function toggleMode() {
  camera.value.toggleMode()
}

</script>

<template>
  <div class="appContainer"> 
     
    <Drawer ref="drawer" @outputImage="outputImage"></Drawer> 
    
    <transition>
      <router-view/>  
    </transition> 
    <ControlBar @outputImage="outputImage" @toggleMode="toggleMode"/>  
  </div>
 
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.6s ease-in-out;
}

.v-enter-to,
.v-leave-from {
  opacity: 0.5;
  transform: translateY(0); 
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(-100vh); 
} 
</style>
