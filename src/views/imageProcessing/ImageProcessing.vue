<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
import controlBar from '@/components/controlBar.vue';
import VideoModule from '@/components/VideoModule.vue';
import ImageModule from '../../components/ImageModule.vue';
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
    <ImageModule  ref="funcModule" v-if="option == 'image'"></ImageModule>
    <VideoModule ref="funcModule" v-if="option == 'video'"></VideoModule>
    <controlBar @outputImage="outputImage"/>
  </div>
 
</template>

<style lang="scss" scoped>
div {
  display: flex;
  // border: 1px solid black;
}
#canvasOut {
  width: 100vw;
  height: 100vh;
}
</style>
