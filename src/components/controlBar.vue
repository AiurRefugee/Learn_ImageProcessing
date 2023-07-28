<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore()
const router = useRouter()


const curOpt = computed( () => store.getters.currentOption )
const cameraCount = computed(() => store.getters.cameraNum)
const cameraStatus = computed( () => store.getters.cameraStatus )

const emit = defineEmits(['outputImage, toggleMode']) 

const options = computed(() => {
   return ['image', 'video', 'camera']
})

function outputImage() {
    emit('outputImage')
}

async function control(option) {
    if(option == 'camera' && cameraStatus.value != 'Normal') {
        console.log('cameraStatus', cameraStatus)
        router.push(`/noCamera/${cameraStatus}`) 
    }
    store.dispatch('set_currentOption', option)
    await nextTick()
}

function toggleMode() {
    emit('toggleMode')
}

</script>
<template> 
    <div class="controlBar">
        <div class="spacer" >
            <div class="swipeWrapper">
                <div class="contentWrapper">
                    <div class="swipeItem" v-for="(item, index) in options" :key="index"
                     :class="{active: curOpt == item}" @click="control(item)">
                        {{ item }}
                    </div>
                </div>
            </div>
        </div>
        <div class="controllerWrapper" @click="outputImage">
                <div class="controller"></div>
            </div>
        <div class="spacer">
            <div class="deviceWrapper">
                <div class="device" v-if="curOpt == 'camera' && cameraStatus == 'Normal'"
                    >
                    <el-icon size="40" color="#e1e1e1" @click="toggleMode">
                        <Refresh />
                    </el-icon>
                    <!-- {{ 'cameraStatus:' + cameraStatus }}
                    {{ 'curOpt:' + curOpt }} -->
                    <!-- {{ 'cameraStatus:' + cameraStatus }} -->
                </div>
            </div>
        </div>
    </div> 
</template>
<style lang="scss" scoped>
$button_Color: #ffb444;
div{
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid white;
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
    .spacer {
        width: 100%;
        padding-bottom: 5%;
        flex: 1;
        .swipeWrapper {
            width: 100%;
            height: 100%;
            flex-direction: column; 
            justify-content: flex-end;
            .contentWrapper {
                width: 50%;
                height: 150px;
                flex-direction: column; 
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
    }
    
    .controllerWrapper {
        border-radius: 50%;
        border: 2px solid $button_Color;
        // padding: 2%;
        // width: 60%;
        cursor: pointer;
        width: 50%;
        aspect-ratio: 1/1; 
        .controller {
            width: 75%;
            aspect-ratio: 1/1;
            background-color: red;
            filter: brightness(1.1);
            border-radius: 50%;
        }
    }
    .deviceWrapper { 
        width: 100%;
        height: 100%;
        align-items: flex-start;
        padding-top: 15%; 
        .device { 
            color: white; 
            flex-direction: column;
            justify-content: flex-start; 
        }
    }
    
}
</style>