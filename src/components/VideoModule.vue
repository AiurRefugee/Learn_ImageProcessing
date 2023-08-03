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
const videoWrapper = ref(null)
let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

const faceMode = computed( () => camerSwitch.value ? "user" : "environment" )

const filtredConfigs = computed( () => store.getters.filteredProcesses )

let width, height, src, srcTemp,  dst, cap, mediaStream, fgmask, interval
 


// defineExpose({
//     toggleMode: async () => { 
//         videoWrapper.value.animate([
//             {transform: 'rotateY(0)'},
//             {transform: 'rotateY(360deg)'},
//         ], 800)
//         camerSwitch.value = !camerSwitch.value
//         await init()
//     }
// })

// async function init() { 
//     navigator.mediaDevices.getUserMedia({ video: {facingMode: faceMode.value}, audio: false })
//     .then(function(stream) {
//         mediaStream = stream
//         videoInput.value.srcObject = stream;
//         videoInput.value.play();
//     })
//     .catch(function(error) {
//         ElMessage.error(`${error}.`)
//         console.log("An error occurred! " + error);
//     });
//     await nextTick()
//     width = videoInput.value.width
//     height = videoInput.value.height 
//     src = new cv.Mat(height, width, cv.CV_8UC4);
//     dst = new cv.Mat(height, width, cv.CV_8UC1);
//     // srcTemp = new cv.Mat()
//     cap = new cv.VideoCapture(videoInput.value); 
//     if(interval) {
//         clearInterval(interval)
//     } 
//     console.log('val', filtredConfigs.value)
//     interval = setInterval( () => {
         
//         try {
//             canvasOutput.value.getContext('2d').clearRect(0, 0, width, height)
//             cap.read(src);  
//             // cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
//             processVideo() 
//             // if(filtredConfigs.value.filter( (item) => item.selected).length == 0 ) {
//             //     dst = src.clone()
//             // }
//             cv.imshow('canvasOutput', dst);
//         } catch(error) {
//             console.log(error)
//         }
        
//     }, 1000 / FPS)
    
// }

// function processVideo() {   
//     filtredConfigs.value.map( (process, index) => {  
//         try { 
//             if(process.selected) {
//                 process.f(process.title, src, dst, process.params.map( item => item.paramValue ))
//             }
//         } catch (error) {  
//             // clearInterval(interval)
//             console.log(error)
            
//         }   
//     })
    
// };

// onMounted(async () => { 
//     size.value = {
//         width: window.innerWidth,
//         height: window.innerHeight
//     } 
//     init()

// })

// onUnmounted(() => { 
//     if (mediaStream) {
//         const tracks = mediaStream.getTracks();
//         tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
//         mediaStream = null; // 清空媒体流对象
//     } 
//     if(interval) {
//         clearInterval(interval)
//     }
//     // src.delete()
//     // dst.delete()
// })

</script>
<template>
    <div ref="videoWrapper" class="videoWrapper"> 
        <!-- <video ref="videoInput" id="videoInput" >

        </video>  -->
        <!-- <canvas ref="canvasOutput" id="canvasOutput">

        </canvas> -->
        <div class="videoArea">
            <div class="contentWrapper">
                <video id="videoInput"></video>
            </div>
            <div class="saucer"></div>
        </div>
    </div>
</template>
<style lang="scss"> 
.videoWrapper {
    width: 95vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center; 
    overflow: hidden;
    //border: 5px solid gray;
    left: 0;
    position: absolute;
    .videoArea {
        width: 90vw;
        height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        .contentWrapper {
            width: 78vw;
            aspect-ratio: 16/9;
            border: 15px solid gray;
            display: flex;
            border-radius: 10px;
            video {
                max-width: 100%;
                height: 100%;
            }
        }
        .saucer {
            width: 50vw; 
            height: 10px;
            border: 8px solid gray;
            background-color: gray;
            border-radius: 20px;
        }
    }
}
</style>