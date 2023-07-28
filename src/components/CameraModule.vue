<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import cv from 'opencv.js';
const videoInput = ref(null) 
const size = ref(Object)
const canvasOutput = ref(null)

let width, height, src, dst, cap

onMounted(async () => { 
    size.value = {
        width: window.innerWidth,
        height: window.innerHeight
    } 
    
    navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"}, audio: false })
    .then(function(stream) {
        videoInput.value.srcObject = stream;
        videoInput.value.play();
    })
    .catch(function(err) {
    console.log("An error occurred! " + err);
    });

    const FPS = 30;
    await nextTick()
    width = videoInput.value.width
    height = videoInput.value.height
    console.log('width', width)
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    cap = new cv.VideoCapture(videoInput.value);
     
 async function processVideo() {
    try {
        canvasOutput.value.getContext('2d').clearRect(0, 0, size.width, size.height)
        let begin = Date.now();
        // start processing.
        cap.read(src);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        await nextTick()
        cv.imshow('canvasOutput', dst);
        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (err) {
        console.log("g")
    }
};

// schedule the first one.
setTimeout(processVideo, 0);

})

</script>
<template>
    <div class="videoWrapper">
        <video ref="videoInput" id="videoInput" :width="size.width" :height="size.height">

        </video> 
        <canvas ref="canvasOutput" id="canvasOutput">

        </canvas>
    </div>
</template>
<style lang="scss">
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
}
</style>