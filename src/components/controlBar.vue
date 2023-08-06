<script setup>
import { onMounted, ref, computed, nextTick, watch} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core' 
import moment from 'moment'; 
import cv from 'opencv.js';
const isDark = useDark()
const toggleDark = useToggle(isDark) 

let timeInterval

const recording = ref(false)

const videoCaped = ref([])
const timeCount = ref(0) 
const timeString = ref('00:00:00')
const controllerWrapper = ref(null)
const controller = ref(null)
const lightColor = ref('black')
const darkColor = ref('white')
const recorder = ref(null)

const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const cameraMode = ref(false) // true 拍照 false 摄像
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
    let res
    switch(curOpt.value) {
        case 'image': res = document.getElementById('imageOutput'); break;
        case 'video': res = document.getElementById('canvasOutput'); break;
        case 'camera':  res = document.getElementById('cameraOutput')
    }
    console.log('ctx', res)
    return res
})
 

const dark = computed( () => useDark())

function outputImage() {
    if(cameraMode.value) {
        takePhoto()
    } else {
        if(recording.value) {
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
    ctx.value = null
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

function downloadVideo(data) {
    videoCaped.value.push(data)
    const url = URL.createObjectURL(new Blob(videoCaped.value, { type: 'video/webm' }));  
    var element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', "output");
    element.style.display = 'none';
    document.body.appendChild(element);
    // element.click();
    document.body.removeChild(element); 
}

function takePhoto() {
    try{
        // ctx.value.getContext('2d').clearRect(0, 0, ctx.value.width, ctx.value.height) 
        if(curOpt.value == 'image') {
            emit('outputImage')
        }
        // cv.imshow(ctx.value.id)
        console.log(ctx.value)
        const url = ctx.value.toDataURL() 
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output.png';
        link.style.display = 'none'
        document.body.appendChild(link);
        link.click();
    } catch(error) {
        console.log(error)
        ElMessage.error(`${error}`)
    }
}

function beginRecord() {  
    timeCount.value = 0
    timeString.value = '00:00:00'
    console.log('record', ctx.value)
    
    recorder.value = new MediaRecorder(ctx.value.captureStream(60), {videoBitsPerSecond: 8000000})
    recorder.value.ondataavailable = (e) => {
        downloadVideo(e.data)
    }
    // ctx.value.getContext('2d').clearRect(0, 0, ctx.value.width, ctx.value.height)
    if(curOpt.value == 'image') {
        emit('outputImage')
    }
    timeInterval = setInterval( () => {
        timeCount.value += 1
        let time = moment.duration(timeCount.value, 'seconds')  //得到一个对象，里面有对应的时分秒等时间对象值
        let hours = time.hours() 
        let minutes = time.minutes()
        let seconds = time.seconds()
        timeString.value = moment({h:hours, m:minutes, s:seconds}).format('HH:mm:ss') 
        
    }, 1000)
    
    recorder.value.start()
    console.log('start record')
    recording.value = true
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
    clearInterval(timeInterval)
    timeCount.value = 0
    timeString.value = '00:00:00'
    ElMessage.closeAll()
    console.log('stop record')
    // timeString.value = '00:00:00'
    recorder.value.stop() 
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
    recording.value = false 
    videoCaped.value = []
    
}

onMounted( async () => {
    console.log('control mount')
    
})


</script>
<template> 
    <div class="timeCount" :style="{
        'display': recording? 'flex': 'none', 
        }">
        <div class="point"></div>
        <div>{{ timeString }}</div>
    </div>
    <el-row class="controlBar">
        <!-- <div style="color: gray;">
            {{ dark }}
        </div> -->
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
                        
                        @click="toggleMode" :size="30" >
                        <Refresh />
                    </el-icon>
                     
                    <!-- {{ 'cameraStatus:' + cameraStatus }}
                    {{ 'curOpt:' + curOpt }}
                    {{ 'cameraNum:' + cameraCount }}  
                    {{ 'cameraStatus:' + cameraStatus }} -->
                </div>
                <div class="device">
                    <el-Switch style="--el-switch-on-color: gray"
                        active-text="Photos"
                        inactive-text="Videos"
                        :width="70"
                        :active-action-icon="View"
                        :inactive-action-icon="Hide"
                        inline-prompt
                        :disabled="recording"
                        v-model="cameraMode"
                    />  
                </div>
                <div class="device"> 
                    <el-icon :color="gray" :size="30" @click="toggleDrawer" ><MoreFilled /></el-icon>
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
    color: white;
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

.timeCount {
    // display: none;
    position: absolute;
    left: 50%;
    top: 2%;
    width: 8%;
    height: 30px; 
    display: inline-block;
    justify-content: center;
    background-color: #000000bd;
    transform: translateX(-50%); 
    transition: all 0.2s ease-in; 
    text-align: justify;
    .point {
        width: 10px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        margin-right: 10px;
        background-color: red;
    }
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
    @media (max-width: 1000px) {
        width: 100vw;
        height: 10vh;
        flex-direction: row;
        align-content: center;
        bottom: 0;
    }
    .spacer {
        width: 100%;
        padding-bottom: 5%;
        flex: 1;
        
        // background-color: #ffb444;
        @media (max-width: 1000px) {
            flex-direction: row;
            padding: 0;
        }
        .swipeWrapper {
            width: 100%;
            height: 100%;
            flex-direction: column; 
            justify-content: flex-end;
            
            .contentWrapper {
                width: 50%;
                height: 200px;
                flex-direction: column; 
                 
                @media (max-width: 1000px) {
                    flex-direction: row;
                    width: 100%;
                    height: 9vh;
                }
                // color: white;
                .swipeItem{
                    width: 100%;
                    height: 80px;
                    cursor: pointer;
                    @media (max-width: 1000px) {
                        width: 30%;

                    }
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
        cursor: pointer;
        
        @media (max-width: 1000px) {
            width: 15vw;
        }
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
        @media(max-width: 1000px) {
            padding: 0;
            flex-direction: row;
            align-items: center;
        }
        .device { 
            // color: white; 
            flex-direction: column;
            justify-content: flex-start; 
            // background-color: #ffb444;
            margin: 2%;
            color: gray;
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