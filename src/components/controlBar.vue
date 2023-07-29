<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore()
const router = useRouter()
const refresh = ref(null)
const drawerSwitch = ref(false)
const direction = ref("ltr")


const curOpt = computed( () => store.getters.currentOption )
const cameraCount = computed(() => store.getters.cameraNum)
const cameraStatus = computed( () => store.getters.cameraStatus )

const emit = defineEmits(['outputImage', 'toggleMode']) 

const options = computed(() => {
   return ['图片', '视频', '摄像头']
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
    refresh.value.animate([
        { transform: 'rotate(0)'},
        { transform: 'rotate(360deg)'}
    ],
    500
    )
    console.log(refresh.value)
    emit('toggleMode')
}

function toggleDrawer() {
    store.dispatch('toggle_currentOption')
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
                <div class="device" v-if="curOpt == 'camera' && cameraStatus == 'Normal' && cameraCount > 1"
                    >
                    <img src="/src/assets/icons/refresh.svg" class="refresh" ref="refresh" @click="toggleMode">
                    <!-- {{ 'cameraStatus:' + cameraStatus }}
                    {{ 'curOpt:' + curOpt }}
                    {{ 'cameraNum:' + cameraCount }} -->
                    <!-- {{ 'cameraStatus:' + cameraStatus }} -->
                </div>
                <div class="device">
                    <div class="drawerCorontroller">
                        <!-- <text>Options</text> -->
                        <el-switch v-model="drawerSwitch" inline-prompt width="50" @change="toggleDrawer"
                        active-text="选项" inactive-text="选项" size="normal"></el-switch>
                    </div>
                </div>
            </div>
        </div>
    </div> 
    <div class="drawer"  >

    </div>
    <transition name="drawer">
        
    </transition>
</template>
<style lang="scss" scoped>
$button_Color: #ffb444;
div{
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid white;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.5s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 1;
}
.drawer-enter-from,
.drawer-leave-to {
    opacity: 0;
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
                    cursor: pointer;
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
        border: 2px solid white;
        // padding: 2%;
        // width: 60%;
        cursor: pointer;
        width: 40%;
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
        justify-content: flex-start;
        padding-top: 15%; 
        flex-direction: column;
        .device { 
            color: white; 
            flex-direction: column;
            justify-content: flex-start; 
            margin: 2%;
            cursor: pointer;
            .refresh {
                width: 40px;
                aspect-ratio: 1/1;
            }
            .drawerCorontroller {
                // border: 1px solid white;
                width: 100px;
                height: 50px;
            }
        }
    }
    .drawer {
        width: 30vw;
        height: 100vh;
        flex-direction: column;
        background-color:  white;
        position: absolute;
        left: 0;
    }
    
}
</style>