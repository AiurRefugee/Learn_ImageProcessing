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
const displayPointer = ref(80)
let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

const filtredConfigs = computed( () => store.getters.filteredProcesses )

let width, height, src, dst, cap, fgmask, interval

function play() {
    console.log('a')
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
        <div class="videoArea" >
            <div class="contentWrapper" ref="contentWrapper">
                <!-- <video id="videoInput" ref="videoInput" :width="videoWitdth" :height="videoHeight"
                    src="/src/assets/videos/video.m4s" style="display: none;" autoplay controls loop>
                </video> -->
                <div class="playerWrapper">
                    <div class="videoArea" :style="{'width': videoWitdth * displayPointer / 100 + 'px', 'height': videoHeight + 'px'}" @click="play">
                        <video id="videoInput" ref="videoInput" :width="videoWitdth" :height="videoHeight"
                            src="/src/assets/videos/video.m4s"  autoplay loop>
                        </video>
                        
                    </div>
                    <canvas id="canvasOutput" ref="canvasOutput" :width="videoWitdth" :height="videoHeight"></canvas>
                    
                </div>
                
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
            // flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            .playerWrapper { 
                justify-content: flex-start;
                align-items: center;
                // background-color: white;
                display: flex; 
                height: 100%;
                overflow: hidden;
                
                .videoArea {
                    position: absolute; 
                    overflow: hidden;
                    border: 10px solid whie;
                    border-right: 2px solid white;
                    video {
                        position: absolute;
                        left: 0;
                        top: 0;  
                        object-fit: fill;
                        z-index: 1; 
                    } 
                    
                }
                #canvasOutput { 
                    display: flex;
                //     position: absolute;
                //     left: 0;
                //     top: 0;
                    // aspect-ratio: 16/9; 
                    // left: 0; 
                    // z-index:  1;
                    // // max-width: 100%; 
                    // // height: 95%;
                }
                .pointerArea {
                    width: 95%;
                    height: 30px;
                    position: absolute;
                    bottom: 0;
                }
            }
            
            
        }
        .saucer {
            width: 50vw; 
            height: 10px;
            margin-top: 1%;
            border: 5px solid gray;
            background-color: gray;
            border-radius: 10px;
        }
    }
}
</style>