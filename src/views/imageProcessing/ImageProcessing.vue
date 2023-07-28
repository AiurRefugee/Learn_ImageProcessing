<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
import ControlBar from '@/components/ControlBar.vue';
import CameraModule from '@/components/CameraModule.vue';
import ImageModule from '@/components/ImageModule.vue';
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const emit = defineEmits(['outputImage'])
const route = useRoute() 
const option = route.params.option
const funcModule = ref(null)
function outputImage() {
  funcModule.value.outputImage()
}
const curOpt = computed( () => store.getters.currentOption )
onMounted(() => {
  console.log('aaa', curOpt.value)
})

</script>

<template>
  <div class="appContainer"> 
    <ImageModule  ref="funcModule" v-if="curOpt == 'image'"></ImageModule>
    <CameraModule ref="funcModule" v-if="curOpt == 'camera'"></CameraModule>
    <ControlBar @outputImage="outputImage"/>
  </div>
 
</template>

<style lang="scss" scoped>

</style>
