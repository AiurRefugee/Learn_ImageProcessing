<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
import ControlBar from '@/components/ControlBar.vue';
import CameraModule from '@/components/CameraModule.vue';
import ImageModule from '@/components/ImageModule.vue';
import Drawer from '@/components/Drawer.vue';
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const emit = defineEmits(['outputImage', 'toggleMode'])
const route = useRoute() 
const option = route.params.option
const funcModule = ref(null)
const Camera = ref(null)
function outputImage() {
  funcModule.value.outputImage()
}

function toggleMode() {
  Camera.value.toggleMode()
}

const curOpt = computed( () => store.getters.currentOption )
const cameraStatus = computed( () => store.getters.cameraStatus )

onMounted(() => {
  store.dispatch('systemInit')
  console.log('aaa', cameraStatus.value)
})

</script>

<template>
  <div class="appContainer"> 
    <Drawer></Drawer> 
    <keep-alive>
      <ImageModule  ref="funcModule" v-if="curOpt == 'image'"></ImageModule> 
    </keep-alive>
    <CameraModule ref="Camera" v-if="curOpt == 'camera' && cameraStatus == 'Normal'"></CameraModule>
    <ControlBar @outputImage="outputImage" @toggleMode="toggleMode"/>
  </div>
 
</template>

<style lang="scss" scoped>

</style>
