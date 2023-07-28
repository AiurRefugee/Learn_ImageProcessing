<template> 
    <var-row class="controlBar" direction="column" justify="center" align="center">
        <var-col :span="10" style="width: 100%;" >
            <div class="swipeWrapper">
                <div class="contentWrapper">
                    <div class="swipeItem" v-for="(item, index) in options" :key="index"
                     :class="{active: curOpt == item}" @click="control(item)">
                        {{ item }}
                    </div>
                </div>
            </div>
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


const curOpt = computed( () => store.getters.currentOption )
const emit = defineEmits(['outputImage'])
const route = useRoute() 

const options = computed(() => {
   return ['image', 'video', 'camera']
})

function outputImage() {
    emit('outputImage')
}

async function control(option) {
    store.dispatch('set_currentOption', option)
    await nextTick()
}

</script>
<style lang="scss" scoped>
$button_Color: #ffb444;

.controlBar {
    width: 10vw;
    height: 100vh;
    z-index: 999;
    display: flex;
    background-color: transparent;
    flex-direction: column;
    position: absolute;
    right: 0;
    .swipeWrapper {
        width: 100%;
        height: 100%;
        flex-direction: column;
        justify-content: flex-end;
        .contentWrapper {
            width: 100%;
            height: 150px;
            flex-direction: column;
            justify-content: space-around;
            color: white;
            .swipeItem{
                width: 100%;
                height: 60px;
            }
            .active {
                color: $button_Color;
                transform: translateX(-20px);
                transition: transform 0.4s ease-in-out;
            }
        }
    }
    .controllerWrapper {
        border-radius: 50%;
        border: 2px solid white;
        // padding: 2%;
        // width: 60%;
        cursor: pointer;
        width: 100px;
        aspect-ratio: 1/1;
        .controller {
            width: 75%;
            aspect-ratio: 1/1;
            background-color: red;
            filter: brightness(1.1);
            border-radius: 50%;
        }
    }
}
</style>