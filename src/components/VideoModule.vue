<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted} from 'vue' 
import cv from 'opencv.js';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'; 

const store = useStore()

let playing = ref(false)
const videoInput = ref(null) 
const size = ref(Object)
const canvasOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const videoWrapper = ref(null)
const contentWrapper = ref(null)
const videoWitdth = ref(0)
const videoHeight = ref(0)
let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

const filtredConfigs = computed( () => store.getters.filteredProcesses )

let width, height, src, dst, cap, fgmask, interval

function play() {
    
    if(!playing.value){
        videoInput.value.play()
    } else {
        videoInput.value.pause()
    }
    playing.value = !playing.value 
    if(!interval) { 
        interval = setInterval( () => {
            try {
                if(canvasOutput.value) {
                    canvasOutput.value.getContext('2d').clearRect(0, 0, width, height)
                }
                
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

onMounted( async () => { 
    videoWitdth.value = contentWrapper.value.clientWidth * 0.8
    videoHeight.value = contentWrapper.value.clientHeight * 0.8 
    await nextTick()
    width = videoInput.value.width
    height = videoInput.value.height 
    console.log(videoInput.value)
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    // srcTemp = new cv.Mat()
    cap = new cv.VideoCapture(videoInput.value); 
    await nextTick()
    // videoInput.value.play()
    videoInput.value.addEventListener("timeupdate", async () => {
    //   console.log('playing')
    })
    
})

onUnmounted(() => { 
     
    if(interval) {
        clearInterval(interval)
    }
    src.delete()
    dst.delete()
    if(videoInput.value) {
        canvasOutput.value.getContext('2d').clearRect(0, 0, width, height)
    }
})

</script>
<template>
    <div ref="videoWrapper" class="videoWrapper"> 
        <!-- <video ref="videoInput" id="videoInput" >

        </video>  -->
        <!-- <canvas ref="canvasOutput" id="canvasOutput">

        </canvas> -->
        <div class="videoArea" ref="contentWrapper">
            <div class="contentWrapper" @click="play">
                <video id="videoInput" ref="videoInput" :width="videoWitdth" :height="videoHeight"
                    src="/src/assets/videos/video.m4s" style="display: none;" autoplay controls loop>
                </video>
                <!-- <video id="videoInput" ref="videoInput" :width="videoWitdth" :height="videoHeight"
                    src="/src/assets/videos/video.m4s"  autoplay controls loop>
                </video> -->
                <canvas id="canvasOutput" ref="canvasOutput"></canvas>
            </div>
            <div class="saucer"></div>
        </div>
    </div>
</template>
<style lang="scss"> 
video {
    max-width: 100%;
    height: 100%;
}
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
        height: 100vh;
        display: flex;
        flex-direction: column;
        // background-color: black;
        align-items: center;
        justify-content: center;
        .contentWrapper {
            width: 82vw;
            // height: 100%;
            aspect-ratio: 16/9;
            max-height: 80vh;
            border: 15px solid gray;
            background-color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            #canvasOutput {
                max-width: 100%;
                max-height: 100%;
            }
            
        }
        .saucer {
            width: 50vw; 
            height: 10px;
            margin-top: 10px;
            border: 5px solid gray;
            background-color: gray;
            border-radius: 10px;
        }
    }
}
</style>