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
const loading = ref(false)

//摄像头分辨率
let widthConfig = 960
let heightConfig = 640
 
let contextRead, contextDraw
let Message

//inject
const $bus = inject('$bus')
$bus.on('toggleMode', toggleMode)

const curOpt = computed( () => store.getters.currentOption )
const faceMode = computed( () => camerSwitch.value ? "user" : "environment" )
const worker = computed( () => store.getters.worker)

const processConfigs = computed( () => store.getters.processConfigs)

const configs = computed( () => {
    return processConfigs.value.map( (item, index) => ({ 
        title: item.title,
        index: item.index,
        selected: item.selected,
        videoAvailable: item.videoAvailable, 
        params: item.params.map( item => item.paramValue) 
    })) 
})
let width, height, mediaStream 


function toggleMode () {
    cameraWrapper.value.animate([
        {transform: 'rotateY(0)'},
        {transform: 'rotateY(360deg)'},
    ], 1200)
    camerSwitch.value = !camerSwitch.value 
    initCamera()
}

 
async function initCamera() {
    loading.value = true
    console.log('cameraInit')
    try {  
        if(mediaStream) {
            release() 
        } 
        // console.log('gettingCamera')
        mediaStream = await navigator.mediaDevices.getUserMedia(
            {   video: {
                facingMode: faceMode.value,
                    width: widthConfig,
                    height: heightConfig,
                },
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
            
            initVideoSize()
        } else {
            loading.value = false
            router.push({
                path: `/noCamera/CameraError`,
                replace: true
            })
            return false
        }
    } catch(error) { 
        loading.value = false
        release()
        router.push({
                path: `/noCamera/CameraError`,
                replace: true
            })
            return false
        errorContent.value = error.toString()
        console.log(error)
    }

} 
 

async function initWorker() {
    await nextTick()
    worker.value.onmessage = function(event) { 
        // console.log('onMessage')
        processVideo()
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
    setTimeout(() => {
        loading.value = false
    }, 1000)
}

function processVideo() {
    if(curOpt.value != 'camera' || !cameraInput.value) {
        return false
    }
    try {
        
        if(!contextRead || !contextDraw) {
            contextRead = canvasRead.value.getContext('2d', { willReadFrequently: true })  
            contextDraw = cameraOutput.value.getContext('2d', { willReadFrequently: true })
        }
        // contextDraw.clearRect(0, 0, width, height) 
        contextDraw.clearRect(0, 0, width, height)
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
        errorContent.value = error.toString()
        initCamera()
        return false
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
}

async function cameraModuleInit() {
    
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
    await initCamera()  
    try {  
        processVideo() 
    } catch(error) { 
        release()
        console.log(error)
        errorContent.value = error.toString()
    }
}

onMounted(() => { 
    console.log('camera onMounted')   
    store.dispatch('set_currentOption', 'camera')
    cameraModuleInit()
})

onActivated( () => {
    console.log('camera onActivated')   
})


onDeactivated( () => {
    console.log('camvea onDeactivated')
    release()
})

onUnmounted(() => {
    console.log('camera onUnmounted')
    store.dispatch('set_currentOption', '')
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
        <canvas ref="cameraOutput" id="cameraOutput" :style="{'opacity': loading ? '0' : '1'}"></canvas>
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
        // transition: all 0.8s ease-out;
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