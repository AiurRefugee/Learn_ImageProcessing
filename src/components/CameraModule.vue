<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted} from 'vue' 
import cv from 'opencv.js';
import { ROI } from '@/opencv/api'
const videoInput = ref(null) 
const size = ref(Object)
const canvasOutput = ref(null)
const videoWrapper = ref(null)
const useBackCamera = ref(true) // true "environment" false "user"
const FPS = 30;

let width, height, src, dst, cap, mediaStream
 

const facingMode = computed(() => {
    return useBackCamera.value ? "environment" : "user"
})

defineExpose({
    toggleMode: async () => {
        videoWrapper.value.animate([
        { transform: 'rotateY(0)'},
        { transform: 'rotateY(360deg)'}
    ],
    800
    )
        console.log('close')
      if (mediaStream) {
        // 关闭当前正在使用的媒体流
        mediaStream.getTracks().forEach(track => track.stop());
      }

      try {
        useBackCamera.value = !useBackCamera.value
        init()
      } catch (error) {
        console.error('获取媒体流失败：', error);
      }
    }

})

async function processVideo() {
    try {
        canvasOutput.value.getContext('2d').clearRect(0, 0, size.width, size.height)
        let begin = Date.now();
        // start processing.
        cap.read(src);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        await nextTick()
        dst = ROI (src, 200, 200, 400, 400) 
        cv.imshow('canvasOutput', dst);
        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (err) {
        console.log(err)
    }
};

async function init() {
    navigator.mediaDevices.getUserMedia({ video: {facingMode: facingMode.value}, audio: false })
    .then(function(stream) {
        mediaStream = stream
        videoInput.value.srcObject = stream;
        videoInput.value.play();
    })
    .catch(function(err) {
    console.log("An error occurred! " + err);
    });

    
    await nextTick()
    width = videoInput.value.width
    height = videoInput.value.height
    console.log('width', width)
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    cap = new cv.VideoCapture(videoInput.value);
}

onMounted(async () => { 
    size.value = {
        width: window.innerWidth,
        height: window.innerHeight
    } 
    await nextTick()
    init()

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
    <div class="videoWrapper" ref="videoWrapper">
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
    background-color: black;
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
     //animation: rotate360 1s linear;
}
</style>