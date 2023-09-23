<script setup>
import { onMounted, ref, computed, nextTick, onActivated, onDeactivated, onUnmounted} from 'vue' 
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';  

const store = useStore()

const videoList = ref([
    {
        label: 'test',
        // value: '/src/assets/videos/Ghostrunner 2023.08.19 - 15.28.32.02.mp4'
        value: '/src/assets/videos/video.m4s'
    }
])
const videoUrl = ref('/src/assets/videos/video.m4s')
const videoUpload = ref(null)
const playerIconSize = ref('40px')
const playing = ref(false)
const videoInput = ref(null)
const size = ref(Object)
const canvasOutput = ref(null)
const canvasRead = ref(null)
const FPS = 30; 
const videoModuleWrapper = ref(null) 
const displayPointer = ref(50) 
let videoLoading = false 
let contextRead, contextDraw


const curOpt = computed( () => store.getters.currentOption )
const processConfigs = computed( () => store.getters.processConfigs ) 
const worker = computed( () => store.getters.worker)
const configs = computed( () => {
    return processConfigs.value.map( (item, index) => {
        return {
            selected: item.selected,
            videoAvailable: item.videoAvailable,
            processIndex: index,
            params: item.params.map( item => item.paramValue)
        }
    })  
})

let width, height, duration 
let interval = null

async function play() { 
    if(!playing.value && videoInput.value.src != ''){
        try {
            await videoInput.value.play()
            playing.value = !playing.value
             
            try {  
                processVideo() 
            } catch(error) {
                console.log(error)
            } 
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
            clearTimeout(interval)
            interval = null
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


}
 

function processVideo() {   
    if(playing.value) {
        console.log('processing Video')   
        contextRead.clearRect(0, 0, width, height) 
        // 将图像绘制到 canvas 上
        contextRead.drawImage(videoInput.value, 0, 0); 
        // 获取图像数据
        let imageData = contextRead.getImageData(0, 0, width, height);  
        // console.log(configs.value)
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
        const url = URL.createObjectURL(file)
        videoInput.value.src = url
        videoList.value.push({
            label: fileName,
            value: url
        })
        videoUrl.value = url
        videoInput.value.load()
    } 
}

async function init() {  
    console.log('video Init') 
    await nextTick()  
    store.dispatch('set_currentOption', 'video')  
}

async function initWorker() {
    await nextTick()
    worker.value.onmessage = function(event) { 
        // console.log('message')
        videoLoading = false
        interval = setTimeout(processVideo,
        1000 / FPS)
        if(event.data.msg == 'loading') { 
            // videoLoading = false
            return false
        }
 
        contextDraw.clearRect(0, 0, width, height) 
        contextDraw.putImageData(event.data.image, 0, 0)
        
        if(event.data.type == 'error') { 
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false
                ElMessage({
                    message: `${processConfigs.value[item].title}参数错误或不支持视频处理.`,
                    grouping: true,
                    type: 'error',
                })
            })
            // ElMessage({
            //     message: `${item.title}参数错误.`,
            //     grouping: true,
            //     type: 'error',
            // })
        } 
        

    };
}  

//初始化视频大小
function initVideo() {
    let video = document.getElementById('videoInput') 
    duration = video.duration
    width = video.videoWidth
    height = video.videoHeight
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
    if(!interval) {
        await initWorker() 
        await init()
        videoInput.value.addEventListener('loadedmetadata', async () => {
            console.log('metaData Loaded')
            initVideo()
        })  
        videoUpload.value.addEventListener( "change", fileChange)   
        // document.body.style.setProperty('--el-text-color-primary', 'white')
        window.addEventListener('resize', reSize)
    }
})

onActivated(  async () => {
    console.log('video Activated') 
    // if(!interval) {
    //     await initWorker() 
    //     await init()
    //     videoInput.value.addEventListener('loadedmetadata', init)  
    //     videoUpload.value.addEventListener( "change", fileChange)   
    //     // document.body.style.setProperty('--el-text-color-primary', 'white')
    //     window.addEventListener('resize', reSize)
    // }
    
})

onDeactivated( () => {
    console.log('video onDeactivated')
    // document.body.style.setProperty('--el-text-color-primary', 'black')
    playing.value = false
    videoLoading = false
    try{
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
    <div ref="videoModuleWrapper" class="videoModuleWrapper"> 
        <div class="videoArea" >
            <div class="tvHead">
                <div class="playerWrapper" @click="play">
                    <div class="videoCanvasWrapper" v-if="curOpt == 'video'">
                        <!-- <div class="videoWrapper" :style="{ 
                            'width': `${displayPointer}%`,
                            'border-right': displayPointer != 0 ? '2px solid #ffffff42' : ''
                            }"> -->
                            <video ref="videoInput" :src="videoUrl" id="videoInput" poster
                                loop crossorigin="true" muted>
                            </video>

                        <!-- </div> -->
                        <canvas id="canvasOutput" ref="canvasOutput"  ></canvas>
                        <canvas id="canvasRead" ref="canvasRead" style="display: none;"></canvas>
                    </div>

                </div>
                <div class="videoController" >
                    <el-row justify="center" align="middle" style="width: 80%;">
                        <el-col :span="3">
                            <text>Input Source</text>
                        </el-col>
                        <el-col :span="3">
                            <el-select v-model="videoUrl" placeholder="请选择输入源" @change="play">
                                <div class="el-select-dropdown__item" @click="upload">
                                    <el-icon><UploadFilled/></el-icon>
                                    <span style="margin-left: 5px;">上传视频</span>
                                </div>
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

.videoController .el-scrollbar {
    max-width: 30vw;
}
.videoModuleWrapper {
    width: 86vw;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    align-items: center;
    position: absolute;
    margin-left: 4vw;
    left: 0; 
    @media (max-width: 1000px) {
        width: 100vw;
        height: 90vh;
        padding: 0;
        margin: 0;
        flex-direction: column; 
        justify-content: center;

    }

    .videoArea {
        width: 85vw;
        height: 95%;
        display: flex;
        flex-direction: column;
        // background-color: black;
        align-items: center;
        justify-content: space-between;
        .tvHead {
            $boderSize: 15px;
            width: calc(85vw - $boderSize * 2);
            height: 90%;
            margin-top: $boderSize;
            position: relative;
            outline: $boderSize solid gray;
            background-color: black; 
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 12px;
            @media(max-width: 1000px) {
                width: calc(95vw - 50px);
                height: 95%;
                margin-top: 5%;
            }
            .playerWrapper {
                $videoMinW: 60vw;
                $videoMinH: 30vh;
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
                        position: absolute;
                        left: 0;
                        z-index: 1;
                    } 
                    #canvasOutput {
                        display: flex;  
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain; 
                        z-index: 1;
                    } 
                } 
            }
            .videoController {
                width: 100%;
                min-height: 10%;
                max-height: 80px;
                display: flex;
                justify-content: space-around; 
                z-index: 2;
                bottom: 0;
                padding-bottom: 5px;
                color: white;
                transition: all 0.5s ease;
                background: linear-gradient(to bottom, gray 1px, black);
                // opacity: 0.8;
                // padding-bottom: 5px; 
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
            border: 5px solid gray;
            background-color: gray;
            border-radius: 10px;
            @media(max-width: 1000px) { 
                display: none;
            }
        }
    }
}
</style>