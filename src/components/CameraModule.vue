<script setup>
import { onMounted, ref, computed, watch, nextTick, onUnmounted, onActivated, onDeactivated, inject} from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'; 
import { useRouter } from 'vue-router';
const router = useRouter()
const store = useStore()
const cameraInput = ref(null)
const canvasRead = ref(null) 
const cameraOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const cameraWrapper = ref(null) 
const errorContent = ref('') 

//摄像头分辨率
let widthConfig = 1920
let heightConfig = 1440
 
let contextRead, contextDraw
let Message

//inject
const $bus = inject('$bus')
$bus.on('toggleMode', toggleMode)

const curOpt = computed( () => store.getters.currentOption )
const faceMode = computed( () => camerSwitch.value ? "user" : "environment" )
const worker = computed( () => store.getters.worker)

const processConfigs = computed( () => store.getters.processConfigs )
const configs = computed( () => {
    return processConfigs.value.map( (item, index) => {
        return {
            selected: item.selected,
            videoAvailable: item.videoAvailable,
            processIndex: index,
            params: item.params.map( item => item.paramValue)
        }
    })  
})
let width, height, mediaStream
let interval = null


function toggleMode () {
    cameraWrapper.value.animate([
        {transform: 'rotateY(0)'},
        {transform: 'rotateY(360deg)'},
    ], 800)
    camerSwitch.value = !camerSwitch.value 
    initCamera()
}

//根据屏幕方向计算width, height
function calWidthByOrientation() { 
    let orientation = screen.orientation.type 
    let w = orientation == 'landscape-primary' || orientation == 'landscape-secondary' ? widthConfig : heightConfig
    let h = orientation == 'landscape-primary' || orientation == 'landscape-secondary' ? heightConfig : widthConfig
    let res = {
        facingMode: faceMode.value,
        width: { ideal: w },
        height: { ideal: h }
    } 
    return res
}
 
async function initCamera() {
    try {  
        if(mediaStream) {
            release() 
        } 
            // console.log('gettingCamera')
        mediaStream = await navigator.mediaDevices.getUserMedia(
            {   video: calWidthByOrientation(),
                audio: false
            }
        )   
        if(mediaStream) {
            let settings = mediaStream.getVideoTracks()[0].getSettings();
            console.log('mediaStream', mediaStream) 
            let orientation = screen.orientation.type
            if(orientation == 'landscape-primary' || orientation == 'landscape-secondary') {
                width = Math.max(settings.width, settings.height)
                height = Math.min(settings.width, settings.height)
            } else {
                width = Math.min(settings.width, settings.height)
                height = Math.max(settings.width, settings.height)
            }
             
            cameraInput.value.srcObject = mediaStream  
            cameraInput.value.play()
            if(interval) {
                clearTimeout(interval)
            }   
            initVideoSize()
        } else {
            router.push({
                path: `/noCamera/CameraError`,
                replace: true
            })
            return false
        }
    } catch(error) {
        // ElMessage({
        //         type: 'error',
        //         message: 'something went wrong',
        //         grouping: true
        //     })
        release()
        errorContent.value = error.toString()
        console.log(error)
    }

} 
 

async function initWorker() {
    await nextTick()
    worker.value.onmessage = function(event) { 
        // console.log('onMessage')
        interval = setTimeout(processVideo,
        1000 / FPS) 
        if(event.data.msg == 'error') {  
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false 
            })
            // ElMessage({
            //     message: `something went wrong`,
            //     grouping: true,
            //     type: 'error',
            //     duration: 1000
            // }) 
            console.log(error)
            errorContent.value = error.toString()
        } 

        if(!contextDraw || !contextRead) {
            contextDraw = cameraOutput.value.getContext('2d', { willReadFrequently: true })
            contextRead = canvasRead.value.getContext('2d', { willReadFrequently: true })
        }

        contextDraw.clearRect(0, 0, width, height) 
        contextDraw.putImageData(event.data.image, 0, 0)

        if(event.data.type == 'processError') { 
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false
                ElMessage({
                    message: `${processConfigs.value[item].title} 发生错误。${event.data.msg}.`,
                    grouping: true,
                    type: 'error',
                })
            }) 
        }  
        

    };
}

function initVideoSize() {   
    cameraInput.value.width = width
    cameraInput.value.height = height
    canvasRead.value.width = width
    canvasRead.value.height = height  
    cameraOutput.value.width = width
    cameraOutput.value.height = height  
    contextRead = canvasRead.value.getContext('2d', { willReadFrequently: true })  
    contextDraw = cameraOutput.value.getContext('2d', { willReadFrequently: true })
    contextRead.clearRect(0, 0, width, height)
    contextDraw.clearRect(0, 0, width, height)
    if(!interval) {
        try {  
            processVideo() 
        } catch(error) {
            // ElMessage({
            //     type: 'error',
            //     message: 'something went wrong',
            //     grouping: true
            // })
            release()
            console.log(error)
            errorContent.value = error.toString()
        }
    }
}

function processVideo() {
    // console.log('processing Camera')  
        // console.log('camera processing') 
        try {
            
            if(!contextRead || !contextDraw) {
                contextRead = canvasRead.value.getContext('2d', { willReadFrequently: true })  
                contextDraw = cameraOutput.value.getContext('2d', { willReadFrequently: true })
            }
            // contextDraw.clearRect(0, 0, width, height) 
            contextRead.clearRect(0, 0, width, height) 
            // 将图像绘制到 canvas 上
            contextRead.drawImage(cameraInput.value, 0, 0); 
            // 获取图像数据
            let imageData = contextRead.getImageData(0, 0, width, height);  
            // console.log('postMessage')
            worker.value.postMessage({
                image: imageData,
                paramsList: configs.value,
                type: 'video'
            }); // 发送图像数据给 Web Worker
            // console.log('processingCamera')
        } catch(error) {
            console.log(error)
            initCamera()
            errorContent.value = error.toString()
        }
          
}

function release() { 
    // if(Message) {
    //     Message.close()
    // }
    if (mediaStream) { 
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
        mediaStream = null; // 清空媒体流对象
    } 
    // console.log('clear')
    clearTimeout(interval) 
    interval = null  
}

function cameraModuleInit() {
    if(!curOpt.value) {
        store.dispatch('set_currentOption', 'camera')
    }
    Message = ElMessage({ 
        message: 'Module is loading.',
        duration: 1000
    })
    console.log('orientation:', screen.orientation.type)
    screen.orientation.addEventListener('change' ,async function() {
        // 在方向变化时执行相应的操作，例如旋转视频元素
        // 你可以根据设备的方向来旋转视频元素
        console.log('orientation:', screen.orientation.type) 
        if(curOpt.value == 'camera') {
            await initCamera()
        }
    });  
    initWorker()
    initCamera()  
}

onMounted(() => { 
    console.log('camera onMounted')   
    store.dispatch('set_currentOption', 'camera')
    if(!interval) {
        cameraModuleInit()
    }

})

onActivated( () => {
    console.log('camera onActivated')  
    if(!interval) { 
        cameraModuleInit()
    }
})


onDeactivated( () => {
    console.log('camvea onDeactivated')
    release()
})

onUnmounted(() => {
    console.log('camera onUnmounted')
    release()
})


</script>
<template>
    <!-- errorInfo -->
    <!-- <div class="errorDiv">
        <p>errorMessage: {{ errorContent }}</p>
    </div> -->
    <div ref="cameraWrapper" class="cameraWrapper">
        <video ref="cameraInput" id="cameraInput" ></video>
        <canvas ref="cameraOutput" id="cameraOutput"></canvas>
        <canvas id="canvasRead" ref="canvasRead" style="display: none;"></canvas>
    </div>
</template>
<style lang="scss">
@keyframes rotate360 {
    0% {
    transform: rotateY(0deg); /* 0度开始旋转 */
    }
    100% {
    transform: rotateY(360deg); /* 360度旋转，一周 */
    }
} 
.errorDiv {
    position: fixed;
    width: 40vw;
    height: 60px;
    top: 2%;
    z-index: 100;
    border-radius: 15px;
    color: var(--el-text-color-primary);
    display: flex;
    justify-content: center;
    background-color: var(--el-bg-color);
}
.cameraWrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: var(--el-bg-color);
     #cameraInput { 
        width: 100vw;
        position: absolute;
        // z-index: 999;
        // opacity: 0.5;
        filter: brightness(1.5);
        display: none;
        height: 100vh; 
        object-fit: contain;  
     }
     #cameraOutput {
        width: 100vw;
        height: 100vh; 
        // display: flex; 
        // opacity: 0.5;
        // display: none;
        background-color: var(--el-bg-color);
        object-fit: cover;
        // z-index: 1;  
     }
     // animation: rotate360 1s linear;
}
</style>