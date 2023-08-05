<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core' 
import { Hide, View } from '@element-plus/icons-vue'
const isDark = useDark()
const toggleDark = useToggle(isDark) 
const lightColor = ref('gray')
const darkColor = ref('gray')

const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const cameraMode = ref(true)
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
    if(curOpt.value == 'image') {
        
        emit('outputImage')
    }
    toggleDark()
    console.log(isDark.value)
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
    <el-row class="controlBar">
        <div class="spacer" >
            <div class="swipeWrapper">
                <div class="contentWrapper" :style="{'color': isDark? darkColor: lightColor}">
                    <div class="swipeItem" v-for="(item, index) in options" :key="index"
                     :class="{active: curOpt == item}" @click="control(item)">
                        <text :type="curOpt == item ? 'warning' : 'info'">{{ item }}</text>
                    </div>
                </div>
            </div>
        </div>
        <div class="controllerWrapper"  @click="outputImage">
            <div class="outSide" :style="{border: cameraMode? '8px solid gray': '1px dashed #ffb444'}">
                <div class="controller" 
                    :style="{
                        'background-color': cameraMode? '#636363': 'red',
                        'width': cameraMode? '85%': '70%'
                        }">
                    </div>
            </div>
        </div>
        <div class="spacer">
            <div class="deviceWrapper">
                <!-- <div class="device" v-if="curOpt == 'camera' && cameraStatus == 'Normal' && cameraCount > 1"> -->
                <div class="device" ref="refresh">
                    <el-icon class="refresh" 
                        v-if="curOpt == 'camera' && cameraCount > 0 && cameraStatus == 'Normal'"
                        :color="isDark? darkColor: lightColor"  
                        @click="toggleMode" :size="30" >
                        <Refresh />
                    </el-icon>
                     
                    <!-- {{ 'cameraStatus:' + cameraStatus }}
                    {{ 'curOpt:' + curOpt }}
                    {{ 'cameraNum:' + cameraCount }} -->
                    <!-- {{ 'cameraStatus:' + cameraStatus }} -->
                </div>
                <div class="device">
                    <el-icon :size="30" @click="toggleDrawer" :color="isDark? darkColor: lightColor"><MoreFilled /></el-icon>
                    <!-- <div class="drawerCorontroller">  
                        <el-switch v-model="drawerSwitch" style="--el-switch-on-color: gray;"
                            inline-prompt width="70" @change="toggleDrawer"
                            active-text="options" inactive-text="options" size="normal"></el-switch>
                    </div> -->
                </div>
                <div class="device">
                    <transition name="drawer">
                        <el-Switch style="--el-switch-on-color: gray"
                        active-text="拍照"
                        inactive-text="录像"
                        :active-action-icon="View"
                        :inactive-action-icon="Hide"
                        inline-prompt
                        v-model="cameraMode"
                        v-if="drawerSwitch"/>
                    </transition>
                </div>
            </div>
        </div>
    </el-row> 
    
    
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
        // background-color: #ffb444;
        .swipeWrapper {
            width: 100%;
            height: 100%;
            flex-direction: column; 
            justify-content: flex-end;
            .contentWrapper {
                width: 50%;
                height: 200px;
                flex-direction: column; 
                // color: white;
                .swipeItem{
                    width: 100%;
                    height: 80px;
                    cursor: pointer;
                }
                .active {
                    color: $button_Color;
                    transform: scale(1.5); 
                    transition: all 0.2s ease-in-out;
                }
            }
        }
    }
    
    .controllerWrapper { 
        width: 5vw;
        aspect-ratio: 1/1; 
        .outSide {
            width: 95%;border-radius: 50%; 
            border-radius: 50%; 
            aspect-ratio: 1/1;
            transition: all 0.5s ease; 
            .controller {
                width: 70%;
                aspect-ratio: 1/1;
                transition: all 0.6s ease; 
                filter: brightness(1.1);
                border-radius: 50%;
            }
        }
    }
    .deviceWrapper { 
        width: 100%;
        height: 100%;
        justify-content: flex-start;
        padding-top: 10%; 
        flex-direction: column;
        .device { 
            // color: white; 
            flex-direction: column;
            justify-content: flex-start; 
            // background-color: #ffb444;
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