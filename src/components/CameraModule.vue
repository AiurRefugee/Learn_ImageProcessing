<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted, onActivated} from 'vue'
import cv from 'opencv.js';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';

const store = useStore()
const cameraInput = ref(null)
const canvasRead = ref(null)
const size = ref(Object)
const cameraOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const cameraWrapper = ref(null) 
let videoLoading = false

const faceMode = computed( () => camerSwitch.value ? "user" : "environment" )
const worker = computed( () => store.getters.worker)

const filtredConfigs = computed( () => store.getters.filteredProcesses )
const configs = computed( () => {
    let res = filtredConfigs.value.map( (item, index) => {
        return {
            selected: item.selected,
            params: item.params.map( item => item.paramValue)
        }
    }) 
    return res
})

let width, height, mediaStream, fgmask, interval, faces, classifier



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
    navigator.mediaDevices.getUserMedia({ video:
        {
            facingMode: faceMode.value,
            width: 3840,
            height: 2560

        },
        audio: false
    })
    .then(function(stream) {
        mediaStream = stream
        cameraInput.value.srcObject = stream;
        cameraInput.value.play();
        
    })
    .catch(function(error) {
        ElMessage({
            message: error,
            grouping: true,
            type: 'error',
        })
        console.log("An error occurred! " + error);
    });
    await nextTick()
    let video = document.getElementsByTagName('video')[0]
 
    width = video.clientWidth
    height = video.clientHeight
    console.log(height)
    canvasRead.value.width = width
    canvasRead.value.height = height  
    cameraOutput.value.width = width
    cameraOutput.value.height = height 
    if(interval) {
        clearInterval(interval)
    } 

    worker.value.onmessage = function(event) { 
        let context = cameraOutput.value.getContext('2d', { willReadFrequently: true }) 
        context.clearRect(0, 0, width, height) 
        context.putImageData(event.data.image, 0, 0)
        videoLoading = false
        if(event.data.type == 'error') { 
            let item = filtredConfigs.value[event.data.index]
            item.selected = false
            ElMessage({
                message: `${item.title}参数错误.`,
                grouping: true,
                type: 'error',
            })
        } 

    }; 
        
    setTimeout( () => {
        interval = setInterval( () => {

        try { 
            processVideo()  
        } catch(error) {
            console.log(error)
        }

        }, 1000 / FPS)
    }, 3000)

}

// function processVideo() {
//     src.copyTo(dst)
//     filtredConfigs.value.map( (process, index) => {
//         try {
//             if(process.selected) {
//                 let res = process.f(process.title, dst, dst, process.params.map( item => item.paramValue ))
//                 if(!res) {
//                     process.selected = !process.selected

//                 }
//             }
//         } catch (error) {
//             // clearInterval(interval)

//             console.log(error)

//         }
//     })

// };
 
function processVideo() {
    if(!videoLoading) {
        const context = canvasRead.value.getContext('2d', { willReadFrequently: true }) ;   
        context.clearRect(0, 0, width, height)
        context.fillStyle = 'black'; // 或其他背景色
        context.fillRect(0, 0, width, height);    
        // 将图像绘制到 canvas 上
        context.drawImage(cameraInput.value, 0, 0); 
        // 获取图像数据
        let imageData = context.getImageData(0, 0, width, height);  
        
        worker.value.postMessage({
            image: imageData,
            paramsList: configs.value
        }); // 发送图像数据给 Web Worker
        videoLoading = true
        }
}

onMounted( async () => { 
    await init() 

})

onActivated( async () => {
    await init()
})

onUnmounted(() => {
    console.log('camera unmount')
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
        mediaStream = null; // 清空媒体流对象
        // cameraOutput.value.getContext('2d', { willReadFrequently: true }) .clearRect(0, 0, width, height)
    }
    if(interval) {
        clearInterval(interval)
    } 
})

</script>
<template>
    <div ref="cameraWrapper" class="cameraWrapper">
        <video ref="cameraInput" id="cameraInput" > 
        </video>
        <canvas ref="cameraOutput" id="cameraOutput">
        <canvas id="canvasRead" ref="canvasRead" style="display: none;"></canvas>


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
canvas {
    object-fit: fill;
}
.cameraWrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
     #cameraInput {
        // display: none;
        opacity: 0.5;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        object-fit: cover;
        position: absolute;
     }
     #cameraOutput {
        width: 100vw;
        height: 100vh; 
        background-color: black;
        z-index: 1; 
        opacity: 0.5;
     }
     // animation: rotate360 1s linear;
}
</style>