<script setup>
import { onMounted, onActivated, ref, computed, nextTick, watch, inject} from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'; 
import moment from 'moment';
import { Sunny, Moon, VideoCamera, Picture} from '@element-plus/icons-vue' 

let timeInterval

//inject
const $bus = inject('$bus')

//ref 
const recording = ref(false)
const videoCaped = ref([])
const timeCount = ref(0)
const timeString = ref('00:00:00')
const controllerWrapper = ref(null)
const controller = ref(null) 
const recorder = ref(null)

const store = useStore()
const router = useRouter()
const refresh = ref(null)
const cameraMode = ref(false) // true 拍照 false 摄像 
const videoDisabled = ref(false)
const options = ref(['image', 'video', 'camera'])


const curOpt = computed( () => store.getters.currentOption )
const cameraCount = computed(() => store.getters.cameraNum)
const cameraStatus = computed( () => store.getters.cameraStatus) 
const theme = computed( 
  {
    get() {
      console.log(store.getters.theme)
      return store.getters.theme
    }, 
    set(val) {
      console.log('val', val)
      store.dispatch('change_Theme', val)
    }
  }
) 
 
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

watch( curOpt, () => {
    console.log('watch')
    if(curOpt.value == 'image') { 
        cameraMode.value = true
        videoDisabled.value = true

    } else {
        videoDisabled.value = false
    }
})


// function changedark() {
//   toggleDark()
//   window.localStorage.setItem("vueuse-color-scheme", 'dark');
// }

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
    if(timeCount.value > 0) {
        endRecord()
    }
    if(option != curOpt.value) {
        store.dispatch('set_currentOption', option)
        if(option == "camera") { 
            console.log('con', cameraStatus.value) 
            if(cameraStatus.value != 'Normal') {
                router.push({
                    path: `/noCamera/${cameraStatus.value}`,
                    replace: true
                })
                return false
            }
        } 
        router.push({
            path: `/imageProcessing/${option}`,
            replace: true
        })
        
        
    }
}

function toggleMode() {
    refresh.value.animate([
        { transform: 'rotate(0)'},
        { transform: 'rotate(360deg)'}
    ],
    500
    ) 
    $bus.emit('toggleMode')
}

function toggleDrawer() {
    store.dispatch('toggle_currentOption')

}

function downloadVideo(data) {
    videoCaped.value.push(data)
    const url = URL.createObjectURL(new Blob(videoCaped.value, { type: 'video/mp4' }));
    var element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', "output");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

async function takePhoto() {
    controller.value.animate([  
        {transform: 'scale(1.0)'},
        {transform: 'scale(0.9)', 
         filter: 'brightness(1.0)'}, 
        {transform: 'scale(1.0)'}
    ], {
        duration: 100,
        easing: 'ease-in',
        fill: 'forwards'
    })
    setTimeout( async () => {
        try{
        // ctx.value.getContext('2d').clearRect(0, 0, ctx.value.width, ctx.value.height)
            if(curOpt.value == 'image') {
            $bus.emit('outputImage', false)
                
            }
            await nextTick() 
            const url = ctx.value.toDataURL()
            const link = document.createElement('a');
            link.href = url;
            link.download = 'output.png';
            link.style.display = 'none'
            document.body.appendChild(link);
            link.click();
        } catch(error) {
            console.log(error)
            ElMessage
        }
    }, 100)
}

function beginRecord() {
    timeCount.value = 0
    timeString.value = '00:00:00' 
    recording.value = true
    if(curOpt.value == 'image') {
        emit('outputImage')
    }

    setTimeout( () => {
        countOn()
    }, 1000)

    recorder.value = new MediaRecorder(ctx.value.captureStream(60), {videoBitsPerSecond: 8000000})
    recorder.value.ondataavailable = (e) => {
        downloadVideo(e.data)
    }
    // ctx.value.getContext('2d').clearRect(0, 0, ctx.value.width, ctx.value.height)


    recorder.value.start()
    console.log('start record')

    // controllerWrapper.value.animate([
    //     { transform: 'rotate(0)'},
    //     { transform: 'rotate(360deg)'}
    // ],
    // 400 )

}

function countOn() {
    timeCount.value += 1
    let time = moment.duration(timeCount.value, 'seconds')  //得到一个对象，里面有对应的时分秒等时间对象值
    let hours = time.hours()
    let minutes = time.minutes()
    let seconds = time.seconds()
    timeString.value = moment({h:hours, m:minutes, s:seconds}).format('HH:mm:ss')
    if(recording.value) {
        setTimeout( () => {
            countOn()
        }, 1000)
    }
}

function endRecord() {
    recording.value = false
    clearInterval(timeInterval)
    timeCount.value = 0
    timeString.value = '00:00:00'
    ElMessage.closeAll()
    console.log('stop record')
    // timeString.value = '00:00:00'
    if(recorder.value) {
        recorder.value.stop()
    } 

    videoCaped.value.length = 0

}

onMounted( async () => {
    console.log('control mount')
    await nextTick()
    console.log(curOpt.value)
    if(curOpt.value == 'image') {
        cameraMode.value = true
        videoDisabled.value = true
    }
})

onActivated( () => {
    console.log('onActivated')
    dark.value = window.localStorage['vueuse-color-scheme'] == 'dark'
    console.log(dark.value)
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
            <div class="spaceItem" v-for="(item, index) in options" :key="index" @click="control(item)">
                <div :class="{active: curOpt == item}">{{ item }}</div>
            </div>  
        </div>
        <div class="controllerWrapper" ref="controllerWrapper" @click="outputImage">
            <div class="outSide" :style="{border: cameraMode? '5px solid rgb(208 208 208)' : '5px solid rgb(208 208 208)'}">
                <div class="controller" ref="controller"
                    :style="{
                        'background-color': cameraMode? 'rgb(208 208 208)' : 'red',
                        'border-radius': recording ? '10px' : '50%',
                        'width': recording ? '60%' : '80%'
                        }">
                    </div>
            </div>
        </div>
        <div class="spacer"> 
                <!-- <div class="spaceItem" v-if="curOpt == 'camera' && cameraStatus == 'Normal' && cameraCount > 1"> -->

                <div class="spaceItem">  
                    <el-Switch  
                        active-text="Photos"
                        size="large"
                        inactive-text="Videos" 
                        :width="70"
                        :active-action-icon="Picture"
                        :inactive-action-icon="VideoCamera"
                        inline-prompt
                        :disabled="recording || videoDisabled"
                        v-model="cameraMode"
                    />

                </div>
                <div class="spaceItem">
                    <el-switch v-model="theme" size="large" :width="50"
                    :active-action-icon="Moon" :inactive-action-icon="Sunny" />
                </div> 
                <div class="spaceItem" v-if="curOpt == 'camera' && cameraCount > 1 && cameraStatus == 'Normal'" ref="refresh">
                    <el-icon class="spaceItem" 
                        color="white"
                        @click="toggleMode" :size="30" >
                        <Refresh />
                    </el-icon>

                    <!-- {{ 'cameraStatus:' + cameraStatus }} -->
                    <!-- {{ 'curOpt:' + curOpt }} -->
                    <!-- {{ 'cameraNum:' + cameraCount }}   -->
                    <!-- {{ 'cameraStatus:' + cameraStatus }} -->
                </div> 
                <div v-else></div>
                <div class="spaceItem" @click="toggleDrawer">
                    <el-icon :color="'#5a5a5a'" :size="30"  ><MoreFilled /></el-icon>
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
$controlZ: 50;
.timeCount {
    // display: none;
    position: absolute;
    left: 50%;
    top: 2%;
    padding: 0 5%;
    backdrop-filter: blur(5px);
    height: 40px;
    display: inline-block;
    justify-content: center;
    border-radius: 5px;
    background-color: rgb(45 44 44 / 64%);
    transform: translateX(-50%);
    transition: all 0.2s ease-in;
    text-align: justify;
    z-index: 999;
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
    display: flex;
    position: absolute;
    right: 0;
    z-index: $controlZ;
    overflow: hidden; 
    flex-direction: column;
    @media (max-width: 1000px) {
        width: 100vw;
        height: 10vh;
        flex-direction: row;
        align-content: center;
        padding-top: 10px;
        padding-bottom: 15px;
        top: null;
        bottom: 0;
    }
    .spacer {
        width: 100%; 
        flex-wrap: wrap;
        flex: 1;
        max-height: 40vh;
        flex-direction: column;
        // background-color: #ffb444;
        @media (max-width: 1000px) {
            flex-direction: row;
            padding: 0;
        } 
 
        // color: white;
        .spaceItem{
            width: 100%;
            flex-grow: 1;
            font-size: 2vh;
            display: flex;
            justify-content: center;
            min-height: 3vh;
            font-weight: 900;
            text-shadow: 2px 0px 2px rgb(70, 70, 70);
            cursor: pointer;
            @media (max-width: 1000px) {
                width: 30%;
                font-size: 2.5vw;
            }
            @media (max-width: 600px) {
                width: 50%;
                font-size: 3.5vw;
            }
        }
        .active {
            color: $button_Color;
            transform: scale(1.5);
            transition: all 0.2s ease-in-out;
        }   
        
                
    }
    .spacer:last-child {
        flex-wrap: nowrap;
        @media(max-width: 600px) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-items: center;
        }

    }  

    .controllerWrapper {
        width: 60%;
        min-width: 100px;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        // background-color: #ffb444;
        @media (max-width: 1000px) {
            height: 80%;
            width: auto;
            aspect-ratio: 1/1;
        }
        @media (max-width: 1000px) {
            min-width: 80px;
        }
        .outSide {
            width: 60%;
            min-width: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border-radius: 50%;
            aspect-ratio: 1/1;
            transition: all 0.5s ease;
            @media (max-width: 1000px) {
                min-width: 60px;
            }
            .controller {
                width: 85%;
                aspect-ratio: 1/1;
                transition: all 0.6s ease;
                filter: brightness(1.1);

            }
        }
    }  
        

}
</style>