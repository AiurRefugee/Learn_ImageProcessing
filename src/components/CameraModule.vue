<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted} from 'vue' 
import cv from 'opencv.js';
import { ElMessage } from 'element-plus'
import { 
MakeBorder,
InRange,
BackgroundSubtract
} from '@/opencv/api.js'
const videoInput = ref(null) 
const size = ref(Object)
const canvasOutput = ref(null)
const FPS = 30;
const camerSwitch = ref(false)
const videoWrapper = ref(null)
let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

const faceMode = computed( () => {
    return camerSwitch.value ? "user" : "environment"
})

let width, height, src, dst, cap, mediaStream, fgmask
 


defineExpose({
    toggleMode: async () => { 
        videoWrapper.value.animate([
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
    console.log('width', width)
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    cap = new cv.VideoCapture(videoInput.value); 
}

async function processVideo() {
    try {
        canvasOutput.value.getContext('2d').clearRect(0, 0, size.width, size.height)
        let begin = Date.now();
        // start processing.
        cap.read(src);
        BackgroundSubtract(src, dst, fgbg)

        //cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);
        // InRange(src, dst)
        await nextTick()
        cv.imshow('canvasOutput', dst);
        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (error) {
        // ElMessage.error(`${error}.`)
        console.log(error)
    }
};

onMounted(async () => { 
    size.value = {
        width: window.innerWidth,
        height: window.innerHeight
    } 
    await init() 
    // schedule the first one.
    setTimeout(processVideo, 0);

})

onUnmounted(() => { 
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
        mediaStream = null; // 清空媒体流对象
    } 
    src.delete()
    dst.delete()
})

</script>
<template>
    <div ref="videoWrapper" class="videoWrapper"> 
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
.videoWrapper {
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