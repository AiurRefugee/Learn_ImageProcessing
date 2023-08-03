<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted} from 'vue' 
import cv from 'opencv.js';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'; 

const store = useStore()
const videoInput = ref(null) 
const size = ref(Object)
const canvasOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const cameraWrapper = ref(null)
let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

const faceMode = computed( () => camerSwitch.value ? "user" : "environment" )

const filtredConfigs = computed( () => store.getters.filteredProcesses )

let width, height, src, srcTemp,  dst, cap, mediaStream, fgmask, interval
 


defineExpose({
    toggleMode: async () => { 
        cameraWrapper.value.animate([
            {transform: 'rotateY(0)'},
            {transform: 'rotateY(360deg)'},
        ], 800)
        camerSwitch.value = !camerSwitch.value
        await init()
    }
})

async function init() { 
    navigator.mediaDevices.getUserMedia({ video: {facingMode: faceMode.value}, audio: false })
    .then(function(stream) {
        mediaStream = stream
        videoInput.value.srcObject = stream;
        videoInput.value.play();
    })
    .catch(function(error) {
        ElMessage.error(`${error}.`)
        console.log("An error occurred! " + error);
    });
    await nextTick()
    width = videoInput.value.width
    height = videoInput.value.height 
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    // srcTemp = new cv.Mat()
    cap = new cv.VideoCapture(videoInput.value); 
    if(interval) {
        clearInterval(interval)
    } 
    console.log('val', filtredConfigs.value)
    interval = setInterval( () => {
         
        try {
            canvasOutput.value.getContext('2d').clearRect(0, 0, width, height)
            cap.read(src);  
            // cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
            processVideo() 
            // if(filtredConfigs.value.filter( (item) => item.selected).length == 0 ) {
            //     dst = src.clone()
            // }
            cv.imshow('canvasOutput', dst);
        } catch(error) {
            console.log(error)
        }
        
    }, 1000 / FPS)
    
}

function processVideo() {   
    src.copyTo(dst)
    filtredConfigs.value.map( (process, index) => {  
        try { 
            if(process.selected) {
                let res = process.f(process.title, dst, dst, process.params.map( item => item.paramValue ))
                if(!res) {
                    process.selected = !process.selected
                    
                }
            }
        } catch (error) {  
            // clearInterval(interval)
            
            console.log(error)
            
        }   
    })
    
};

onMounted(async () => { 
    size.value = {
        width: window.innerWidth,
        height: window.innerHeight
    } 
    init()

})

onUnmounted(() => { 
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
        mediaStream = null; // 清空媒体流对象
    } 
    if(interval) {
        clearInterval(interval)
    }
    // src.delete()
    // dst.delete()
})

</script>
<template>
    <div ref="cameraWrapper" class="cameraWrapper"> 
        <video ref="videoInput" id="videoInput" :width="size.width" :height="size.height">

        </video> 
        <canvas ref="canvasOutput" id="canvasOutput">

        </canvas>
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
     #videoInput {
        display: none;
        width: 90vw;
        height: 100vh;
     }
     #canvasOutput {
        width: 100vw;
        height: 100vh;
        position: relative;
        background-color: black;
     }
     // animation: rotate360 1s linear;
}
</style>