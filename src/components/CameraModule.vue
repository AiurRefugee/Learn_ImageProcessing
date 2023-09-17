<script setup>
import { onMounted, ref, computed, watch, nextTick, onUnmounted, onActivated, onDeactivated} from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'; 
const store = useStore()
const cameraInput = ref(null)
const canvasRead = ref(null) 
const cameraOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const cameraWrapper = ref(null) 
const vloading = ref(true)
let cameraVideoLoading = false
let Message

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



defineExpose({
    toggleMode: async () => {
        cameraWrapper.value.animate([
            {transform: 'rotateY(0)'},
            {transform: 'rotateY(360deg)'},
        ], 800)
        camerSwitch.value = !camerSwitch.value
        await nextTick()
        await init()
    }
})

watch( vloading, () => {
    Message.close()
})

async function init() {
    try {
        await nextTick() 
        let display = await navigator.mediaDevices.getUserMedia(
            { video:
                {
                    facingMode: faceMode.value,
                    width: 3840,
                    height: 2560 
                },
                audio: false
            }
        ) 
        let settings = display.getVideoTracks()[0].getSettings();
        width = settings.width;
        height = settings.height;  
        // console.log(width)
        cameraInput.value.srcObject = display 
        if(interval) {
            clearTimeout(interval)
        }   
        initVideo()
    } catch(error) {
        console.log(error)
    }

} 
 

function initWorker() {
    worker.value.onmessage = function(event) { 
        // console.log('onMessage')
        interval = setTimeout(processVideo,
        1000 / FPS)
        if(event.data.msg == 'loading') {  
            return false
        }
        vloading.value = false
        let context = cameraOutput.value.getContext('2d', { willReadFrequently: true }) 
        context.clearRect(0, 0, width, height) 
        context.putImageData(event.data.image, 0, 0)

        if(event.data.type == 'error') { 
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false
                ElMessage({
                    message: `${processConfigs.value[item].title}参数错误或不支持视频处理.`,
                    grouping: true,
                    type: 'error',
                })
            }) 
        }  
        

    };
}

function initVideo() {  
    canvasRead.value.width = width
    canvasRead.value.height = height  
    cameraOutput.value.width = width
    cameraOutput.value.height = height  
    cameraOutput.value.getContext('2d').clearRect(0, 0, width, height)
    if(!interval) {
        try {  
            processVideo() 
        } catch(error) {
            console.log(error)
        }
    }
}

function processVideo() {
    // console.log('processing Camera')  
        // console.log('camera processing')
        const context = canvasRead.value.getContext('2d', { willReadFrequently: true }) ;   
        context.clearRect(0, 0, width, height)
        context.fillStyle = 'black'; // 或其他背景色
        context.fillRect(0, 0, width, height);    
        // 将图像绘制到 canvas 上
        context.drawImage(cameraInput.value, 0, 0); 
        // 获取图像数据
        let imageData = context.getImageData(0, 0, width, height);  
        // console.log('postMessage')
        worker.value.postMessage({
            image: imageData,
            paramsList: configs.value
        }); // 发送图像数据给 Web Worker
          
}

function release() {
    cameraVideoLoading = false
    if (mediaStream) { 
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
        mediaStream = null; // 清空媒体流对象
    } 
    console.log('clear')
    clearTimeout(interval) 
    interval = null  
}

onMounted( async () => { 
    console.log('camera onMounted')  
    console.log('interval', interval)
    if(!interval) { 
        await nextTick()
        initWorker()
        await nextTick()
        await init()
    }

})

onActivated( async () => {
    console.log('camera onActivated') 
    console.log('interval', interval) 
    Message = ElMessage({ 
        message: 'Module is loading.',
        duration: 0
    })
    if(!interval) {
        await nextTick()
        initWorker()
        await nextTick()
        await init() 
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
    <div ref="cameraWrapper" class="cameraWrapper">
        <video ref="cameraInput" id="cameraInput" autoplay></video>
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
canvas {
    object-fit: fill;
}
.cameraWrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
     #cameraInput {
        // display: none; 
        width: 100vw;
        position: absolute;
        z-index: 0;
        opacity: 0;
        height: 100vh; 
        object-fit: cover; 
     }
     #cameraOutput {
        width: 100vw;
        height: 100vh; 
        display: flex;
        background-color: black;
        object-fit: contain;
        z-index: 1;  
     }
     // animation: rotate360 1s linear;
}
</style>