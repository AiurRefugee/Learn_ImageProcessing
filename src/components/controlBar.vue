<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core' 
import { Hide, View } from '@element-plus/icons-vue'
import { FORWARD } from 'element-plus/es/components/virtual-list/src/defaults';
const isDark = useDark()
const toggleDark = useToggle(isDark) 

let recording = false

const videoCaped = ref([])
const recorder = ref(null)
const controllerWrapper = ref(null)
const controller = ref(null)
const lightColor = ref('gray')
const darkColor = ref('gray')

const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const cameraMode = ref(true) // true 拍照 false 摄像
const direction = ref("ltr")


const curOpt = computed( () => store.getters.currentOption )
const cameraCount = computed(() => store.getters.cameraNum)
const cameraStatus = computed( () => store.getters.cameraStatus )
const drawerSwitch = computed( () => store.getters.drawerSwitch)

const emit = defineEmits(['outputImage', 'toggleMode']) 

const options = computed(() => {
   return ['image', 'video', 'camera']
})

const ctx = computed( () => {
    return document.getElementById('canvasOutput')
})

function outputImage() {
    if(cameraMode.value) {
        takePhoto()
    } else {
        if(recording) {
            endRecord()
        } else {
            beginRecord()
        }
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

function takePhoto() {
    try{
        if(curOpt.value == 'image') {
            emit('outputImage')
        }
        const url = ctx.value.toDataURL()
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output.png';
        link.style.display = 'none'
        document.body.appendChild(link);
        link.click();
    } catch(error) {
        console.log(ctx.value)
        ElMessage(`${error}`)
    }
}

function beginRecord() { 
    recorder.value.start()
    console.log('start record')
    recording = true
    controllerWrapper.value.animate([
    { transform: 'rotate(0)'},
        { transform: 'rotate(360deg)'}
    ],
    400 )
    controller.value.animate([
        { transform: 'scale(1)'},
        { transform: 'scale(1.2)'}
    ], {
        duration: 500,
        fill: 'forwards'
    }
    
    )
}

function endRecord() {
    recorder.value.stop()
    console.log('end record')
    console.log(videoCaped.value)
    controllerWrapper.value.animate([
    { transform: 'rotate(0)'},
        { transform: 'rotate(360deg)'}
    ],
    400 )
    controller.value.animate([
        { transform: 'scale(1.2)'},
        { transform: 'scale(1)'}
    ],{
        duration: 500,
        fill: 'forwards'
    })
    recording = false 
    
}

onMounted( () => {
    recorder.value = new MediaRecorder(ctx.value.captureStream(60), {videoBitsPerSecond: 4000000})
    recorder.value.ondataavailable = (e) => {
        videoCaped.value.push(e.data)
        const url = URL.createObjectURL(new Blob(videoCaped.value, { type: 'video/webm' }));  
        var element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', "output");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element); 
    }
})


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
        <div class="controllerWrapper" ref="controllerWrapper" @click="outputImage">
            <div class="outSide" :style="{border: cameraMode? '8px solid gray': '2px dashed #ffb444'}">
                <div class="controller" ref="controller"
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
                    <el-Switch style="--el-switch-on-color: gray"
                        active-text="拍照"
                        inactive-text="录像"
                        :active-action-icon="View"
                        :inactive-action-icon="Hide"
                        inline-prompt
                        v-model="cameraMode"
                    />  
                </div>
                <div class="device"> 
                    <el-icon :size="30" @click="toggleDrawer" :color="isDark? darkColor: lightColor"><MoreFilled /></el-icon>
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
            width: 70%;
            border-radius: 50%; 
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