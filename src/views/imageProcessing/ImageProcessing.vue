<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
import ControlBar from '@/components/ControlBar.vue';
import CameraModule from '@/components/CameraModule.vue';
import ImageModule from '@/components/ImageModule.vue';
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
  store.dispatch('systemInit')
  console.log('aaa', cameraStatus.value)
})

// functions

function outputImage() {
  console.log('imageProcessing outputImage')
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
  Camera.value.toggleMode()
}

</script>

<template>
  <div class="appContainer"> 
    <Drawer ref="drawer" @outputImage="outputImage"></Drawer> 
    <keep-alive>
      <ImageModule  ref="image" v-if="curOpt == 'image'"></ImageModule> 
    </keep-alive>
    <CameraModule ref="camera" v-if="curOpt == 'camera' && cameraStatus == 'Normal'"></CameraModule>
    <ControlBar @toggleMode="toggleMode"/>
  </div>
 
</template>

<style lang="scss" scoped>

</style>
