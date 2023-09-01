<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted, onDeactivated} from 'vue' 
import cv from 'opencv.js';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';  

const store = useStore()

const videoList = ref([
    {
        label: 'ocean',
        value: '//vjs.zencdn.net/v/oceans.mp4'
    }
])  
const videoUrl = ref('//vjs.zencdn.net/v/oceans.mp4')
const videoUpload = ref(null)
const playerIconSize = ref(30)
const playing = ref(false)
const videoInput = ref(null) 
const size = ref(Object)
const canvasOutput = ref(null)
const FPS = 60;
const camerSwitch = ref(false)
const videoWrapper = ref(null)
const contentWrapper = ref(null)
const videoWitdth = ref(0)
const videoHeight = ref(0)
const displayPointer = ref(50)
let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

 


const filtredConfigs = computed( () => store.getters.filteredProcesses )

let width, height, src, dst, cap, fgmask, interval, duration

async function play() { 
    if(!playing.value && videoInput.value.src != ''){
        try {
            await videoInput.value.play()
            playing.value = !playing.value 
        } catch(error) {
            playing.value = false
            console.log(error)
            ElMessage({
                message: `${error}.`,
                grouping: true,
                type: 'error',
            })
        }
        
    } else {
        try {
            await videoInput.value.pause()
            playing.value = !playing.value 
        } catch(error) {
            playing.value = true
            console.log(error)
            ElMessage({
                message: `${error}.`,
                grouping: true,
                type: 'error',
            })
        }
    }
    
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
                // console.log(error)
            }
        }, 1000 / FPS)  
    }
}

function processVideo() {   
    src.copyTo(dst)
    filtredConfigs.value.map( (process, index) => {  
        try { 
            if(process.selected && process.videoAvaliable != false) {
                
                console.log('aaa', process.params.map( item => item.paramValue))
                let res = process.f(process.title, dst, dst, process.params.map( item => item.paramValue ))
                // if(!res) {
                //     process.selected = !process.selected 
                // }
            }
            if(process.videoAvaliable == false) {
                console.log('false')
                process.selected = false
            }
        } catch (error) {  
            // clearInterval(interval)
            
            console.log(error)
            
        }   
    })
    
};

// function pause() {
//     videoInput.value.pause()
// }

function zoom() {
    console.log('zoom', duration)
    if(videoInput.value.currentTime + 10 < duration) {
        videoInput.value.currentTime += 10
    } else {
        videoInput.value.currentTime = duration
    }
}

function antiZoom() {
    if(videoInput.value.currentTime - 10 > 0) {
        videoInput.value.currentTime -= 10
    } else {
        videoInput.value.currentTime = 0
    }
}

function upload() {
    videoUpload.value.click()
    videoInput.value.src = null
}

onMounted( async () => { 
    videoWitdth.value = contentWrapper.value.clientWidth * 0.8
    videoHeight.value = contentWrapper.value.clientHeight * 0.8 
    await nextTick()
    width = videoInput.value.width
    height = videoInput.value.height 
    canvasOutput.value.getContext('2d').clearRect(0, 0, width, height)

    videoInput.value.addEventListener('loadedmetadata', () => {
        duration = videoInput.value.duration
    })
    console.log(videoInput.value)
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    // srcTemp = new cv.Mat()
    cap = new cv.VideoCapture(videoInput.value); 
    await nextTick() 
    videoUpload.value.addEventListener( "change", () => {
    play()
    const file = videoUpload.value.files[0]
    const fileName = file.name 
    const url = URL.createObjectURL(file)
    videoInput.value.src = url
    videoList.value.push({
        label: fileName,
        value: url
    })
    videoUrl.value = url
    videoInput.value.load() 

    })
})



onUnmounted(() => { 
    console.log('video unmount')
    playing.value = false 
    if(interval) {
        clearInterval(interval)
    } 
    if(videoInput.value) {
        canvasOutput.value.getContext('2d').clearRect(0, 0, width, height)
    }
})

onDeactivated( () => { 
    console.log('video deactive')
    playing.value = false 
    if(interval) {
        clearInterval(interval)
    }
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
                <div class="playerWrapper" @click="play">
                    <div class="videoContent" :style="{
                        'width': `${displayPointer}%`, 'height': videoHeight + 'px',
                        'border-right': displayPointer != 0 ? '2px solid white' : ''
                        }">
                        <video ref="videoInput" :src="videoUrl" id="videoInput"  :width="videoWitdth" :height="videoHeight"
                            loop crossorigin="true" muted> 
                        </video>
                        
                    </div>
                    <div class="canvasWrapper">
                        <canvas id="canvasOutput" ref="canvasOutput" :width="videoWitdth" :height="videoHeight"></canvas>
                    </div>                    
                </div>
                <div class="videoController" :style="{'max-height': videoHeight,'overflow': 'hidden'}">
                    <el-row justify="center" align="middle" style="width: 80%;">
                        <el-col :span="3">
                            <text>Input Source</text>
                        </el-col>
                        <el-col :span="3">
                            <el-select v-model="videoUrl" placeholder="请选择输入源" @change="play">
                                <el-option :label="''" :value="''" @click="upload"> 
                                    <el-icon><UploadFilled/></el-icon>
                                    <span style="margin-left: 5px;">上传视频</span>
                                </el-option>
                                <el-option :label="item.label" :value="item.value" v-for="(item, index) in videoList" :key="index"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12" >
                            <el-icon :size="playerIconSize" @click="antiZoom"><DArrowLeft /></el-icon>
                            <el-icon :size="playerIconSize" v-if="!playing" @click="play"><VideoPlay /></el-icon>
                            <el-icon :size="playerIconSize" v-else @click="play"><VideoPause /></el-icon>
                            
                            <el-icon :size="playerIconSize" @click="zoom"><DArrowRight /></el-icon>
                        </el-col>
                        <el-col :span="3">
                            <text>Mask</text>
                        </el-col>
                        <el-col :span="3">
                            <el-slider v-model="displayPointer" :step="0.1"></el-slider>
                        </el-col>
                    </el-row>
                </div>  
                </div>
            <div class="saucer"></div>
            <input type="file" style="display: none;" id="videoUpload" ref="videoUpload">
        </div>
        
    </div>
</template>
<style lang="scss"> 

.videoWrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    padding-left: 5vw;
    align-items: center; 
    overflow: hidden;
    //border: 5px solid gray; 
    @media (max-width: 1000px) {
        width: 100vw;
        height: 90vh;
        top: 0;
        flex-direction: column;
        // background-color: white;
        justify-content: center;
        padding: 0;
    }
    .videoArea {
        width: 85vw;
        height: 90vh;
        display: flex;
        flex-direction: column;
        // background-color: black;
        align-items: center;
        justify-content: center;
        .contentWrapper {
            width: calc(85vw - 15px * 2);
            // height: 100%;
            aspect-ratio: 16/9; 
            max-height: 90vh;
            border: 15px solid gray;
            background-color: black;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px;
            @media(max-width: 1000px) {
                width: calc(90vw - 50px);
                height: 95%;
            }
            .playerWrapper { 
                justify-content: flex-start;
                align-items: center;
                position: relative;
                // background-color: white;
                display: flex; 
                // min-width: 80%;
                height: 100%;
                overflow: hidden;
                
                .videoContent {
                    position: absolute; 
                    overflow: hidden;
                    border: 10px solid whie;
                    // border-right: 2px solid white;
                    video {
                        position: absolute;
                        left: 0;
                        top: 0;   
                        z-index: 1; 
                        object-fit: fill;
                    } 
                    
                }
                .canvasWrapper {
                    overflow: hidden;
                    max-height: 80vh;
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
                }
                
                
            }
            .videoController {
                width: 100%;
                min-height: 10%;
                max-height: 80px;
                display: flex;
                justify-content: space-around;
                color: white;
                background: linear-gradient(to bottom, gray 1px, black);
                opacity: 0.8;
                padding-bottom: 5px;
                // position: absolute;
                // bottom: 0;
                // z-index: 2;
                // transform: translateY(-100%);
                // background-color: white;
                .el-col {
                    display: flex;
                    justify-content: space-around;

                }
                .el-slider__bar {
                    background-color: gray;
                    border-color: white;
                }
                .el-slider__button-wrapper {
                    border-color: white;
                }
                .el-input__wrapper {
                    background-color: transparent;
                }
                .el-input__inner {
                    color: white;
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
            @media(max-width: 1000px) {
                // position: absolute;
                // bottom: 0;
                // height: 5px;
                // border-color: #dddddd;
                // border: 1px solid #dddddd;
                // transform: translateY(-30px);
                // background-color: #dddddd;
                display: none;
            }
        }
    }
}
</style>