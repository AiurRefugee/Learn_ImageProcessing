<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
import ControlBar from '@/components/ControlBar.vue';
import CameraModule from '@/components/CameraModule.vue';
import ImageModule from '@/components/ImageModule.vue';
import VideoModule from '@/components/VideoModule.vue';
import Drawer from '@/components/Drawer.vue';
import { ElMessage } from 'element-plus';  
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore() 
const route = useRoute() 
const option = route.params.option

// refs
const image = ref(null)
const camera = ref(null)

// computed
const curOpt = computed( () => store.getters.currentOption )
const cameraStatus = computed( () => store.getters.cameraStatus )

onMounted(() => {
  // store.dispatch('systemInit')
  console.log('aaa', cameraStatus.value)
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
    <transition>
       
        <ImageModule  ref="image" v-if="curOpt == 'image'"></ImageModule> 
       
    </transition>
    <transition >
      <VideoModule v-if="curOpt == 'video'"></VideoModule>
    </transition>
    <transition >
      <CameraModule ref="camera" v-if="curOpt == 'camera' && cameraStatus == 'Normal'"></CameraModule>
    </transition>
    <ControlBar @outputImage="outputImage" @toggleMode="toggleMode"/>
  </div>
 
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 1;
  transform: translateY(0);
  backdrop-filter: blur(10px);
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(-100%);
    backdrop-filter: blur(0px);
} 
</style>
