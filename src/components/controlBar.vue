<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark) 

const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const direction = ref("ltr")


const curOpt = computed( () => store.getters.currentOption )
const cameraCount = computed(() => store.getters.cameraNum)
const cameraStatus = computed( () => store.getters.cameraStatus )
const drawerSwitch = computed( () => store.getters.drawerSwitch)

const emit = defineEmits(['outputImage', 'toggleMode']) 

const options = computed(() => {
   return ['image', 'video', 'camera']
})

function outputImage() {
    if(curOpt == 'image') {
        toggleDark()
        emit('outputImage')
    }
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
                        <el-text :type="curOpt == item ? 'warning' : 'info'">{{ item }}</el-text>
                    </div>
                </div>
            </div>
        </div>
        <div class="controllerWrapper" @click="outputImage">
                <div class="controller"></div>
            </div>
        <div class="spacer">
            <div class="deviceWrapper">
                <!-- <div class="device" v-if="curOpt == 'camera' && cameraStatus == 'Normal' && cameraCount > 1"> -->
                <div class="device">
                    <img src="/src/assets/icons/refresh.svg" class="refresh" ref="refresh" @click="toggleMode">
                    {{ 'cameraStatus:' + cameraStatus }}
                    {{ 'curOpt:' + curOpt }}
                    {{ 'cameraNum:' + cameraCount }}
                    <!-- {{ 'cameraStatus:' + cameraStatus }} -->
                </div>
                <div class="device">
                    <div class="drawerCorontroller">
                        <!-- <text>Options</text> -->
                        <el-switch v-model="drawerSwitch" style="--el-switch-on-color: gray;"
                            inline-prompt width="70" @change="toggleDrawer"
                            active-text="options" inactive-text="options" size="normal"></el-switch>
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
    // background-color: transparent;
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
                // color: white;
                .swipeItem{
                    width: 100%;
                    height: 60px;
                    cursor: pointer;
                }
                .active {
                    color: $button_Color;
                    transform: translateX(-10px) scale(1.2); 
                    transition: all 0.4s ease-in-out;
                }
            }
        }
    }
    
    .controllerWrapper {
        border-radius: 50%;
        border: 1.5px dashed $button_Color;
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
            // color: white; 
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