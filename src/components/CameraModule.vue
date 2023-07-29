<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted} from 'vue' 
import cv from 'opencv.js';
import { ElMessage } from 'element-plus'
const videoInput = ref(null) 
const size = ref(Object)
const canvasOutput = ref(null)

let width, height, src, dst, cap, mediaStream

let isFrontCamera = false; // 当前是否使用前置摄像头


defineExpose({
    switchCamera: async () => {
    console.log('close')
      if (mediaStream) {
        // 关闭当前正在使用的媒体流
        mediaStream.getTracks().forEach(track => track.stop());
      }

      try {
        // 获取新的媒体流，根据isFrontCamera判断使用前后摄像头
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: isFrontCamera ? 'environment' : 'user' }
        });

        // 更新视频元素的srcObject，实现切换摄像头
        const videoElement = document.getElementById('videoElement');
        videoElement.srcObject = mediaStream;

        isFrontCamera = !isFrontCamera; // 切换标志位，下次切换另一个摄像头
      } catch (error) {
        ElMessage.error(`${error}.`)
        console.error('获取媒体流失败：', error);
      }
    }

})
onMounted(async () => { 
    size.value = {
        width: window.innerWidth,
        height: window.innerHeight
    } 
    
    navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"}, audio: false })
    .then(function(stream) {
        mediaStream = stream
        videoInput.value.srcObject = stream;
        videoInput.value.play();
    })
    .catch(function(error) {
        ElMessage.error(`${error}.`)
        console.log("An error occurred! " + error);
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
    } catch (error) {
        // ElMessage.error(`${error}.`)
        console.log(error)
    }
};

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
    <div class="videoWrapper">
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
     animation: rotate360 1s linear;
}
</style>