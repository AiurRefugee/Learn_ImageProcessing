<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import cv from 'opencv.js';
const videoInput = ref(null)
const canvasOutput = ref(null)
let width, height, src, dst, cap
onMounted(() => {

    navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"}, audio: false })
    .then(function(stream) {
        videoInput.value.srcObject = stream;
        videoInput.value.play();
    })
    .catch(function(err) {
    console.log("An error occurred! " + err);
    });

    const FPS = 30;
    width = videoInput.value.width
    height = videoInput.value.height
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    cap = new cv.VideoCapture(videoInput.value);
    console.log(cap)
function processVideo() {
    try {
         
        let begin = Date.now();
        // start processing.
        cap.read(src);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
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
        <video ref="videoInput" id="videoInput" width="800" height="800" >

        </video>
        <canvas id="canvasFrame"></canvas>
        <canvas id="canvasOutput">

        </canvas>
    </div>
</template>
<style lang="scss">
.videoWrapper {
    width: 100vw;
    height: 100vh;
    // background-color: green;
     #videoInput {
        display: none;
     }
}
</style>