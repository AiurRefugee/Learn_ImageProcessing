<script setup>
import { onMounted, ref, computed, nextTick, onActivated, onDeactivated, onUnmounted} from 'vue' 
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';  

import { DArrowLeft, VideoPlay, DArrowRight, VideoPause } from '@element-plus/icons-vue'

const store = useStore()

const suffixList = ['mp4', 'm4s', 'avi']

const videoList = ref([
    {
        label: 'test',
        // value: '/src/assets/videos/Ghostrunner 2023.08.19 - 15.28.32.02.mp4'
        value: '/src/assets/videos/sintel.mp4'
    }
])
const videoUrl = ref('/src/assets/videos/sintel.mp4')
const videoUpload = ref(null)
const playerIconSize = ref('40px')
const playing = ref(false)
const videoInput = ref(null)
const size = ref(Object)
const canvasOutput = ref(null)
const canvasRead = ref(null)
const FPS = 60; 
const videoModuleWrapper = ref(null) 
const displayPointer = ref(50) 
let videoLoading = false 
let contextRead, contextDraw




const curOpt = computed( () => store.getters.currentOption ) 
const worker = computed( () => store.getters.worker)
const processConfigs = computed( () => store.getters.processConfigs)

const configs = computed( () => {
    return processConfigs.value.map( (item, index) => ({ 
        title: item.title,
        index: item.index,
        selected: item.selected,
        videoAvailable: item.videoAvailable, 
        params: item.params.map( item => item.paramValue) 
    })) 
})

let width, height, duration 
let interval = null

// flag true 播放 false 暂停
async function play(flag) { 
    if(videoInput.value.src != ''){
        try { 
            if(flag) {
                await videoInput.value.play()
                playing.value = true
                processVideo()  
            } else {
                await videoInput.value.pause()
                playing.value = false
                clearTimeout(interval)
                interval = null
            }
        } catch(error) { 
            console.log(error)
            ElMessage({
                message: `${error}.`,
                grouping: true,
                type: 'error',
            })
        }

    } 


}
 

function processVideo() {   
    if(playing.value) { 
        console.log('processing Video')   
        if(!contextRead || !contextDraw) {
            contextRead = canvasRead.value.getContext('2d', { willReadFrequently: true })  
            contextDraw = canvasOutput.value.getContext('2d', { willReadFrequently: true })
        }
        
        contextRead.clearRect(0, 0, width, height) 
        // 将图像绘制到 canvas 上
        contextRead.drawImage(videoInput.value, 0, 0); 
        // 获取图像数据
        let imageData = contextRead.getImageData(0, 0, width, height);  
        // console.log(imageData.width, imageData.height)
        worker.value.postMessage({
            image: imageData,
            paramsList: configs.value,
            type: 'video'
        }); // 发送图像数据给 Web Worker 
         
    }
}

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
}

async function fileChange() {
    console.log('fileChange')
    const file = videoUpload.value.files[0]
    if(file) { 
        const fileName = file.name
        const suffix = fileName.split('.').pop()
        if(suffixList.indexOf(suffix) != -1) {
            const url = URL.createObjectURL(file)
            videoInput.value.src = url
            videoList.value.push({
                label: fileName,
                value: url
            })
            videoUrl.value = url
            videoInput.value.load()
        } else {
            ElMessage({
                type: 'error',
                message: '输入格式不支持'
            })
        }
        
    } 
}

function init() {  
    console.log('video Init')  
    store.dispatch('set_currentOption', 'video')  
}

async function initWorker() {
    await nextTick()
    // worker.value.postMessage( {
    //     type: 'update'
    // })
    worker.value.onmessage = function(event) { 
        // console.log('message')
        videoLoading = false
        interval = setTimeout(processVideo,
        1000 / FPS)

        // console.log(event.data)
        if(event.data.type == 'processError') { 
            // console.log('processError')
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false
                ElMessage({
                    message: `${processConfigs.value[item].title} 发生错误。${event.data.msg}`,
                    grouping: true,
                    type: 'error',
                })
            }) 
        }  else if (event.data.type == 'error') { 
            console.log('error', event.data.indexs)
            ElMessage({
                message: `something went wrong`,
                grouping: true,
                type: 'error',
                duration: 1000
            }) 
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false 
            }) 
        }
        
        if(!contextDraw) {
            contextDraw = canvasOutput.value.getContext('2d', { willReadFrequently: true })
        }
        contextDraw.clearRect(0, 0, width, height) 
        contextDraw.putImageData(event.data.image, 0, 0)
        
        
        

    };
}  

//初始化视频大小
function initVideo() {
    let video = document.getElementById('videoInput') 
    duration = video.duration
    width = Math.min(video.videoWidth, 2560)
    height = Math.min(video.videoHeight, 1440)
    videoInput.value.width = width
    videoInput.value.height = height
    canvasOutput.value.width = width
    canvasOutput.value.height = height
    canvasRead.value.width = width
    canvasRead.value.height = height   
    contextRead = canvasRead.value.getContext('2d', { willReadFrequently: true })  
    contextDraw = canvasOutput.value.getContext('2d', { willReadFrequently: true })
    contextDraw.clearRect(0, 0, width, height)
}

async function reSize() {
    console.log('resize') 
}

onMounted( async () => {
    console.log('video onMounted') 
    store.dispatch('set_currentOption', 'video')
    await nextTick()
    if(!interval) {
        initWorker() 
        init()
        videoInput.value.addEventListener('loadedmetadata', async () => {
            console.log('metaData Loaded')
            initVideo()
            play(false)
        })  
        videoUpload.value.addEventListener( "change", fileChange)   
        // document.body.style.setProperty('--el-text-color-primary', 'white')
        // window.addEventListener('resize', reSize)
    }
})

onActivated(  async () => {
    console.log('video Activated')  
    
})

onDeactivated( () => {
    console.log('video onDeactivated')
    // document.body.style.setProperty('--el-text-color-primary', 'black')
    playing.value = false
    videoLoading = false
    try{
        if(!contextDraw) {
            contextDraw = canvasOutput.value.getContext('2d', { willReadFrequently: true })
        }
        contextDraw.clearRect(0, 0, width, height)
    } catch {
        
    }
    if(interval) {
        clearTimeout(interval)
        interval = null
    } 
})

onUnmounted( () => {
    console.log('video onUnmounted') 
    playing.value = false
    videoLoading = false
    try{
        if(!contextDraw) {
            contextDraw = canvasOutput.value.getContext('2d', { willReadFrequently: true })
        }
        contextDraw.clearRect(0, 0, width, height)
    } catch {
        
    }
    if(interval) {
        clearTimeout(interval)
        interval = null
    } 
})

</script>
<template>
     <!-- <div class="errorDiv">
        errorMessage: {{ errorContent }}
    </div> -->
    <div ref="videoModuleWrapper" class="videoModuleWrapper"> 
        <div class="videoArea" >
            <div class="tvHead"  @click="play(!playing)">
                <div class="playerWrapper">
                    <div class="videoCanvasWrapper" v-if="curOpt == 'video'">
                        <!-- <div class="videoWrapper" :style="{ 
                            'width': `${displayPointer}%`,
                            'border-right': displayPointer != 0 ? '2px solid #ffffff42' : ''
                            }"> -->
                            <video ref="videoInput" :src="videoUrl" id="videoInput" poster
                                loop crossorigin="true">
                            </video>

                        <!-- </div> -->
                        <canvas id="canvasOutput" ref="canvasOutput"  ></canvas>
                        <canvas id="canvasRead" ref="canvasRead" style="display: none;"></canvas>
                    </div>

                </div>
                <div class="videoController" >  
                    <div class="videoInputSource">
                        <text>Input Source</text>
                        <el-select v-model="videoUrl" placeholder="请选择输入源" @change="play(false)">
                            <div class="el-select-dropdown__item" @click="upload">
                                <el-icon><UploadFilled/></el-icon>
                                <span style="margin-left: 5px;">上传视频</span>
                            </div>
                            <el-option :label="item.label" :value="item.value" v-for="(item, index) in videoList" :key="index"></el-option>
                        </el-select>

                    </div>
                    <div class="controllerCenter">
                        <div class="leftright" @click="antiZoom">
                            <!-- <DArrowLeft /> -->
                            <el-icon :size="playerIconSize" ><DArrowLeft /></el-icon>
                        </div >
                        <div class="centerIcon" v-if="!playing" @click="play(true)">
                            <!-- <VideoPlay /> -->
                            <el-icon :size="playerIconSize" v-if="!playing" ><VideoPlay/></el-icon>
                        </div>
                        <div class="centerIcon" v-else @click="play(false)">
                            <!-- <VideoPause /> -->
                             <el-icon :size="playerIconSize"><VideoPause /></el-icon>
                        </div>
                        <div class="leftright" @click="zoom">
                            <!-- <DArrowRight /> -->
                            <el-icon :size="playerIconSize" ><DArrowRight /></el-icon>
                        </div>
                        <!-- <el-icon :size="playerIconSize" @click="antiZoom"><DArrowLeft /></el-icon>
                        <el-icon :size="playerIconSize" v-if="!playing" @click="play"><VideoPlay /></el-icon>
                        <el-icon :size="playerIconSize" v-else @click="play"><VideoPause /></el-icon>

                        <el-icon :size="playerIconSize" @click="zoom"><DArrowRight /></el-icon> -->
                    </div>
                    <div class="mask">
                        <text>Mask</text>  
                        <el-slider v-model="displayPointer" :step="0.1"></el-slider>
                    </div> 
                </div>
                </div>
            <!-- <div class="saucer"></div> -->
            <input type="file" style="display: none;" id="videoUpload" ref="videoUpload">
        </div>

    </div>
</template>
<style lang="scss">

.errorDiv {
    position: fixed;
    width: 40vw;
    height: 60px;
    top: 2%;
    z-index: 100;
    border-radius: 15px;
    color: var(--el-text-color-primary);
    display: flex;
    justify-content: center;
    background-color: var(--el-bg-color);
}
.videoController .el-scrollbar {
    max-width: 30dvw;
}
.videoModuleWrapper {
    width: 86dvw;
    height: 100dvh;
    display: flex; 
    justify-content: center;
    align-items: center;
    overflow: hidden; 
    position: absolute;
    margin-left: 4dvw;
    left: 0; 
    background-color: var(--el-bg-color);
    transition: background-color 0.5s ease-in;
    @media(orientation: portrait) {
        width: 100dvw;
        height: 90dvh;
        padding: 0;
        margin: 0;
        flex-direction: column; 
        justify-content: center;

    }
    $boderSize: 15px;
    .videoArea {
        width: 85dvw;
        height: 95%;
        display: flex;
        flex-direction: column;
        position: relative;
        // background-color: black;
        align-items: center;
        justify-content: center;
        
        .tvHead { 
            width: calc(85dvw - $boderSize * 2);
            height: calc(100% - $boderSize * 2); 
            // margin-top: $boderSize;
            position: relative;
            outline: $boderSize solid gray;
            background-color: black; 
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 15px; 
            @media(orientation: portrait) {
                width: calc(95dvw - 40px);
                height: 98%;
                // top: 0;
                // margin-top: 5%; 
            }
            .playerWrapper {
                $videoMinW: 60dvw;
                $videoMinH: 30dvh;
                justify-content: center;
                align-items: center;
                position: relative; 
                display: flex; 
                height: 100%;
                width: 100%;
                overflow: hidden;
                .videoCanvasWrapper {
                    display: flex;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    justify-content: center;
                    align-items: center;  
                    // border-right: 2px solid white;
                    
                    video {  
                        width: 100%;
                        height: 100%; 
                        // position: absolute;
                        left: 0;
                        max-width: 2560px;
                        max-height: 1440px;
                        object-fit: contain;
                        z-index: 1;
                        display: none;
                    } 
                    #canvasOutput {
                        display: flex;  
                        width: 100%;
                        height: 100%;
                        object-fit: contain; 
                        z-index: 1;
                        @media(max-width: 600px) {
                            rotate: 90deg;
                        }
                    } 
                } 
            }
            .videoController {
                width: 100%;
                height: 10%;
                min-height: 50px;
                max-height: 80px;
                display: grid;
                grid-template-columns: 30% auto 30%;
                justify-items: center;
                align-items: center;
                grid-auto-rows: 100%;
                z-index: 2; 
                padding-bottom: 5px;
                color: white;
                transition: all 0.5s ease;
                background: linear-gradient(to bottom, gray 1px, black);
                // opacity: 0.8;
                // padding-bottom: 5px; 
                text {
                    display: flex;
                    padding: 0 5%;
                    @media(max-width: 800px) {
                        display: none;
                    }
                }
                .videoInputSource {
                    width: 80%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                }
                .mask {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 80%; 

                }
                .controllerCenter {
                    display: flex;
                    width: 100%;
                    height: 100%; 
                    justify-content: space-around;
                    align-items: center;
                    min-height: 45px;
                    svg, .el-icon {
                        width: 100% !important;
                        height: 100% !important;
                    }
                    .centerIcon {
                        width: 45px; 
                        aspect-ratio: 1/1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        // height: 80%; 
                        @media(max-width: 800px) {
                            width: 30px;
                        }
                    }
                    
                    .leftright {
                        width: 35px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        aspect-ratio: 1/1;
                        @media(max-width: 800px) {
                            width: 20px;
                        }
                    } 
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
        // .saucer {
        //     width: 70dvw;
        //     height: 10px;
        //     position: absolute;
        //     bottom: 0;
        //     border: 5px solid gray;
        //     background-color: gray;
        //     border-radius: 10px;
        //     @media(max-width: 1000px) { 
        //         display: none;
        //     }
        // }
    }
}
</style>