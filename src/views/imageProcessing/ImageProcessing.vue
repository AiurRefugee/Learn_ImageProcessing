<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
import ControlBar from '@/components/ControlBar.vue';
import CameraModule from '@/components/CameraModule.vue';
import ImageModule from '@/components/ImageModule.vue';
import VideoModule from '@/components/VideoModule.vue';
import Drawer from '@/components/Drawer.vue';
import { ElMessage } from 'element-plus';  
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore() 
const router = useRouter()  

// refs
const image = ref(null)
const video = ref(null)
const camera = ref(null)

// computed
const curOpt = computed( () => store.getters.currentOption )
const cameraStatus = computed( () => store.getters.cameraStatus ) 

onMounted(() => { 
  store.dispatch('initWorker')  
  console.log(curOpt.value)
   
  store.dispatch('systemInit')  
  setTimeout( () => {
    if(!curOpt.value) {
      router.push({
            path: `/imageProcessing/image`,
            replace: true
        })
    }
  }, 2000)
})

// functions

function outputImage() { 
  switch(curOpt.value) {
    case 'image':  
        image.value.outputImage()
      break
    case 'camera':
        camera.value.outputImage()
        break
  }
}

function toggleMode() {
  camera.value.toggleMode()
}

</script>

<template>
  <div class="appContainer"> 
     
    <Drawer ref="drawer" @outputImage="outputImage"></Drawer> 
    <transition mode="out-in">   
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
