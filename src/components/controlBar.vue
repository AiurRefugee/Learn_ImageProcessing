<template> 
    <var-row class="controlBar" direction="column" justify="center" align="center">
        <var-col :span="10" style="width: 100%;" >
            <SwipeBar></SwipeBar>
        </var-col>
        <var-col :span="4" @click="outputImage">
            <div class="controllerWrapper">
                <div class="controller"></div>
            </div>
        </var-col>
        <var-col :span="10">1</var-col>
    </var-row> 
</template>
<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
import SwipeBar from './SwipeBar.vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex';
const store = useStore()

const emit = defineEmits(['outputImage'])
const route = useRoute() 

const options = computed(() => {
   return ['image', 'video', 'camera']
})

function outputImage() {
    emit('outputImage')
}
</script>
<style lang="scss" scoped>
$button_Color: #ffb444;
div {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: white;
}
.controlBar {
    width: 10vw;
    height: 100vh;
    z-index: 999;
    display: flex;
    background-color: transparent;
    flex-direction: column;
    position: absolute;
    right: 0;
    .swipe {
        width: 200px;
        height: 300px; 
        background-color: #ffb444;
    }
    .controllerWrapper {
        border-radius: 50%;
        border: 2px solid $button_Color;
        // padding: 2%;
        // width: 60%;
        cursor: pointer;
        width: 100px;
        aspect-ratio: 1/1;
        .controller {
            width: 75%;
            aspect-ratio: 1/1;
            background-color: $button_Color;
            filter: brightness(1.1);
            border-radius: 50%;
        }
    }
}
</style>