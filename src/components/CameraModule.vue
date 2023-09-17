<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted, onActivated, onDeactivated} from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'; 
const store = useStore()
const cameraInput = ref(null)
const canvasRead = ref(null) 
const cameraOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const cameraWrapper = ref(null) 
let cameraVideoLoading = false

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

async function init() {
    await nextTick()
    console.log('cameraVideoLoading', cameraVideoLoading)
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
    console.log(width)
    cameraInput.value.srcObject = display
    cameraInput.value.play()
    if(interval) {
        clearInterval(interval)
    }  
    
    initVideo()

} 
 

function initWorker() {
    worker.value.onmessage = function(event) { 
        // console.log('onMessage')
        if(event.data.msg == 'loading') {
            // ElMessage({
            //     message: `Waiting for OpenCV to be loaded.`,
            //     grouping: true,
            //     type: 'error',
            // })
            cameraVideoLoading = false
            return false
        }

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
        cameraVideoLoading = false

    };
}

function initVideo() {  
    canvasRead.value.width = width
    canvasRead.value.height = height  
    cameraOutput.value.width = width
    cameraOutput.value.height = height  
    cameraOutput.value.getContext('2d').clearRect(0, 0, width, height)
    interval = setInterval( () => { 
        try { 
            processVideo()   
        } catch(error) {
            console.log(error)
        } 
    }, 1000 / FPS) 
}

function processVideo() {
    // console.log('processing Camera') 
    if(!cameraVideoLoading) {
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
        cameraVideoLoading = true
    }
}

function release() {
    cameraVideoLoading = false
    if (mediaStream) { 
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
        mediaStream = null; // 清空媒体流对象
    }
    if(interval) {
        console.log('clear')
        clearInterval(interval) 
        interval = null
    } 
    // console.log('cameraOutput', cameraOutput.value)
    // cameraOutput.value.getContext('2d').clearRect(0, 0, width, height)
    
}

onMounted( async () => { 
    console.log('camera onMounted')  
    console.log('interval', interval)
    if(!interval) { 
        await nextTick()
        initWorker()
        await init()
    }

})

onActivated( async () => {
    console.log('camera onActivated') 
    console.log('interval', interval) 
    if(!interval) {
        await nextTick()
        initWorker()
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
        <video ref="cameraInput" id="cameraInput"></video>
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
        opacity: 0.5;
        // width: 100vw;
        // height: 100vh;
        z-index: 0;
        object-fit: cover;
        position: absolute;
     }
     #cameraOutput {
        width: 100vw;
        height: 100vh; 
        background-color: black;
        object-fit: cover;
        z-index: 1;  
     }
     // animation: rotate360 1s linear;
}
</style>