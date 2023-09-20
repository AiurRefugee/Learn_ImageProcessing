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
let contextRead, contextDraw
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
        release() 
        mediaStream = await navigator.mediaDevices.getUserMedia(
            { video:
                {
                    facingMode: faceMode.value,
                    width: 3840,
                    height: 2560 
                },
                audio: false
            }
        ) 
        let settings = mediaStream.getVideoTracks()[0].getSettings();
        switch(screen.orientation.type) {
            case 'landscape-primary':
            case 'landscape-secondary':
                width = Math.max(settings.width, settings.height);
                height = Math.min(settings.width, settings.height);  
                console.log(width, height)
                break;
            case 'portrait-primary':
            case 'portrait-secondary':
                width = Math.min(settings.width, settings.height);
                height = Math.max(settings.width, settings.height); 
                console.log(width, height)
                break;
            default: 
                width = 3840
                height = 2560
        }
        
        
        // console.log(settings.width, settings.height)
        cameraInput.value.srcObject = mediaStream 
        if(interval) {
            clearTimeout(interval)
        }   
        initVideo()
    } catch(error) {
        release()
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
        contextDraw.clearRect(0, 0, width, height) 
        contextDraw.putImageData(event.data.image, 0, 0)

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
    contextRead = canvasRead.value.getContext('2d', { willReadFrequently: true })  
    contextDraw = cameraOutput.value.getContext('2d', { willReadFrequently: true })
    contextDraw.clearRect(0, 0, width, height)
    if(!interval) {
        try {  
            processVideo() 
        } catch(error) {
            release()
            console.log(error)
        }
    }
}

function processVideo() {
    // console.log('processing Camera')  
        // console.log('camera processing') 
        contextRead.clearRect(0, 0, width, height) 
        // 将图像绘制到 canvas 上
        contextRead.drawImage(cameraInput.value, 0, 0); 
        // 获取图像数据
        let imageData = contextRead.getImageData(0, 0, width, height);  
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

// function rotationChange() {
//     console.log('rotation changed to:', screen.orientation.type);
// }

// screen.orientation.addEventListener('change', rotationChange);


// onMounted( async () => { 
//     console.log('camera onMounted')  
//     console.log('interval', interval)
//     if(!interval) { 
//         await nextTick()
//         initWorker()
//         await nextTick()
//         await init()
//     }

// })

onActivated( async () => {
    console.log('camera onActivated') 
    console.log('interval', interval) 
    Message = ElMessage({ 
        message: 'Module is loading.',
        duration: 0
    })
    console.log('orientation:', screen.orientation.type)
    screen.orientation.addEventListener('change' ,async function() {
        // 在方向变化时执行相应的操作，例如旋转视频元素
        // 你可以根据设备的方向来旋转视频元素
        console.log('orientation:', screen.orientation.type) 
        await init()
    });
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
        display: none;
        height: 100vh; 
        object-fit: cover; 
        orientation: landscape;
     }
     #cameraOutput {
        width: 100vw;
        height: 100vh; 
        display: flex; 
        // display: none;
        background-color: gray;
        object-fit: contain;
        z-index: 1;  
     }
     // animation: rotate360 1s linear;
}
</style>