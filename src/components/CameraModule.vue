<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted} from 'vue' 
import cv from 'opencv.js';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'; 

const store = useStore()
const cameraInput = ref(null) 
const size = ref(Object)
const cameraOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const cameraWrapper = ref(null)
let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

const faceMode = computed( () => camerSwitch.value ? "user" : "environment" )

const filtredConfigs = computed( () => store.getters.filteredProcesses )

let width, height, src, srcTemp,  dst, cap, mediaStream, fgmask, interval, faces, classifier
 


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
        cameraInput.value.srcObject = stream;
        cameraInput.value.play();
    })
    .catch(function(error) {
        ElMessage.error(`${error}.`)
        console.log("An error occurred! " + error);
    });
    await nextTick()
    
    width = cameraInput.value.width
    height = cameraInput.value.height  
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    // srcTemp = new cv.Mat()
    cap = new cv.VideoCapture(cameraInput.value); 
    if(interval) {
        clearInterval(interval)
    } 
    console.log('val', cameraOutput.value)
    interval = setInterval( () => {
         
        try {
            cameraOutput.value.getContext('2d').clearRect(0, 0, width, height)
            cap.read(src);  
            // cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
            processVideo() 
            // if(filtredConfigs.value.filter( (item) => item.selected).length == 0 ) {
            //     dst = src.clone()
            // }
            cv.imshow('cameraOutput', dst);
            // faceDetect()
        } catch(error) {
            // console.log(error)
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

function faceDetect() {
    cap.read(src);
    src.copyTo(dst);
    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
    // detect faces.
    classifier.detectMultiScale(dst, faces, 1.1, 3, 0);
    // draw faces.
    for (let i = 0; i < faces.size(); ++i) {
        let face = faces.get(i);
        let point1 = new cv.Point(face.x, face.y);
        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
        cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
    }
    cv.imshow('canvasOutput', dst);
}

onMounted(async () => { 
    console.log(' camera mount ') 
    size.value = {
        width: window.innerWidth,
        height: window.innerHeight
    } 
    init() 
    faces = new cv.RectVector();
    classifier = new cv.CascadeClassifier();

    // load pre-trained classifiers
    try {
        classifier.load('/src/opencv/haarcascade_frontalface_default.xml');
    } catch(error) {
        console.log(error)
    }

})

onUnmounted(() => { 
    console.log('camera unmount')
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop()); // 停止每个轨道的捕获
        mediaStream = null; // 清空媒体流对象
        // cameraOutput.value.getContext('2d').clearRect(0, 0, width, height)
    } 
    if(interval) {
        clearInterval(interval)
    }
    src.delete()
    dst.delete()
})

</script>
<template>
    <div ref="cameraWrapper" class="cameraWrapper"> 
        <video ref="cameraInput" id="cameraInput" width="2560" height="1440">

        </video> 
        <canvas ref="cameraOutput" id="cameraOutput">

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
     #cameraInput {
        display: none;
        width: 100vw;
        height: 100vh;
     }
     #cameraOutput {
        width: 100vw;
        height: 100vh;
        position: relative;
        background-color: black;
        z-index: 1;
     }
     // animation: rotate360 1s linear;
}
</style>