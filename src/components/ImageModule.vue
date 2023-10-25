<script setup>
import { onMounted, ref, computed, watch, onDeactivated, onActivated, onUnmounted, nextTick, inject} from 'vue'
import cv from 'opencv.js';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';  
import { srcs } from '@/opencv/configs.js' 

const store = useStore()

//inject
const $bus = inject('$bus')
$bus.on('outputImage', outputImage)
$bus.on('photo', photo)

const imageUrl = ref('/src/assets/imgs/Lena.png')
const imageUrlList = ref([])
const loading = ref(true)
const showViewer = ref(false)
const elImage = ref()
const imageOutSrc = ref(null)
const imageInput = ref(null) // <img>
const fileInput = ref(null) // <input>
const imageOutput = ref(null) // <canvas></canvas> 
const srcList = ref(srcs)
let src
let dst = new cv.Mat()
let width, height, interval

const worker = computed( () => store.getters.worker)
const processConfigs = computed( () => store.getters.processConfigs)

const configs = computed( () => {
    let res = processConfigs.value.map( (item, index) => {
        return {
            selected: item.selected,
            imageAvailable: item.imageAvailable,
            processIndex: index,
            params: item.params.map( item => item.paramValue)
        }
    })   
    return res
})
  

async function outputImage() {  
    // let image = document.getElementById('imageInput')  
    imageUrlList.value.length = 0 
    try { 
        processImage() 
          
    } catch(error) {
        console.log(error)
        ElMessage({
            message: error,
            grouping: true,
            type: 'error',
        })
    }
}

function photo() {
    console.log('photo')
    // outputImage()
    const url = document.getElementById('imageOutput').toDataURL()
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.png';
    link.style.display = 'none'
    document.body.appendChild(link);
    link.click();
}

function drawImage() {
    
    let canvasDraw = document.getElementById('imageOutput')
    canvasDraw.width = width
    canvasDraw.height = height
    let contextDraw = canvasDraw.getContext('2d')
    contextDraw.clearRect(0, 0, width, height) 
    // console.log(width, height)
    let image = document.getElementById('imageInput')
    // 将图像绘制到 canvas 上
    contextDraw.drawImage(image, 0, 0); 
    let imageData = contextDraw.getImageData(0, 0, width, height);  
    imageUrlList.value.push(canvasDraw.toDataURL())
    return imageData
}

const processImage = () =>  {
    let imageData = drawImage()
    // 获取图像数据
    
    // console.log(width, height)
    worker.value.postMessage({
        image: imageData,
        paramsList: configs.value,
        type: 'image'
    }); // 发送图像数据给 Web Worker 

} 

function initWorker() {
    worker.value.onmessage = function(event) { 
        // console.log('message')
        loading.value = false  
        console.log(event.data.type)
        if(event.data.type == 'processError') { 
            // console.log('processError')
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false
                ElMessage({
                    message: `${processConfigs.value[item].title}参数错误或不支持处理图片.`,
                    grouping: true,
                    type: 'error',
                })
            }) 
        } else if (event.data.type == 'error') { 
            console.log('error', event.data.indexs)
            
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false 
            }) 
            ElMessage({
                message: `something went wrong`,
                grouping: true,
                type: 'error',
                duration: 1000
            }) 
        }
        let canvasDraw = document.getElementById('imageOutput')
        // initSize()
        canvasDraw.width = width
        canvasDraw.height = height
        let contextDraw = canvasDraw.getContext('2d')
        contextDraw.clearRect(0, 0, width, height) 
        console.log(event.data.image.width, event.data.image.height)
        contextDraw.putImageData(event.data.image, 0, 0)
        imageUrlList.value.push(canvasDraw.toDataURL())
        
        
        

    };
}

function initSize() {
    let image = document.getElementById('imageInput')
    width = image.width
    height = image.height
    // console.log(width, height)
}

function selectChange() {
    loading.value = true
}

function upload() {
    fileInput.value.click() 
}

function inputChange(e) {

    const file = e.target.files[0] 
    if(file) {
        let url = URL.createObjectURL(file)
        srcList.value.push({
            name: file.name,
            value: url
        })
        imageUrl.value = url
        loading.value = true
    } 
}

function preview() {
    if(!loading.value) {
        console.log('click')
        showViewer.value = true
    }
}

function closeViewer() {
    showViewer.value = false
}
 

onMounted( async () => {
    console.log('image onMounted')
    store.dispatch('set_currentOption', 'image')
    await nextTick()
    let image = document.getElementById('imageInput')
    width = image.clientWidth
    height = image.clientHeight 
    image.onload = () => {
        
        initSize()
        drawImage()
    }
    initWorker()
})

onActivated( async () => {
    console.log('image Activated')
    
})
onDeactivated( () => {
    console.log('image Deactivated')
})

onUnmounted( () => {
    console.log('image onUnmounted')
})

</script>
<template>
    <div class="imageModuleWrapper">

        <div class="inoutput">
            <div class="imageArea"> 
                <img id="imageInput" ref="imageInput" :src="imageUrl" style="display: none;"/>
                <img id="imageSrc" :src="imageUrl"
                    :style="{display: loading ? 'flex' : 'none'}" />
                <el-image-viewer :src="imageOutSrc"
                    :url-list="imageUrlList"
                    v-if="showViewer"
                    fit="contain"
                    ref="elImage"
                    :infinite="false"
                    hide-on-click-modal 
                    @close="closeViewer"
                    >
                </el-image-viewer>  
                <!-- <canvas id="canvasRead"></canvas> -->
                <canvas ref="imageOutput" id="imageOutput" :style="{display: !loading ? 'flex' : 'none'}" @click="preview"></canvas>
            </div> 
            <div class="labelArea">
                <el-row justify="center" align="middle" :gutter="20" style="width: 100%;">
                    <el-col :span="12" class="labelItem">
                        <text style="display: flex; justify-content: center; width: 80px;">Image:</text>
                        <el-select v-model="imageUrl" placeholder="选择图片" size="large" @change="selectChange">
                            <li class="el-select-dropdown__item" @click="upload">
                                <el-icon><UploadFilled/></el-icon>
                                <span style="margin-left: 5px;">上传图片</span>
                            </li>
                            <el-option :label="item.name" :value="item.value" v-for="(item, index) in srcList" :key="index"> </el-option>

                        </el-select>
                        <input type="file" ref="fileInput" style="display: none;" @change="inputChange">
                    </el-col>
                    <el-col :span="12" class="labelItem">
                        <el-button size="large" @click="outputImage(false)"> Image Output</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.el-input--large .el-input__wrapper {
    @media(orientation: portrait) {
        height: 40px;
    }
}
.el-select, .el-button--large {
    width: 70%;
 }
 .el-image {
    display: none;
    overflow: hidden;
    justify-content: center;
    max-height: 100%;
    max-width: 100;
    width: auto;
    border-radius: 15px; 
 } 
 .labelArea .el-scrollbar {
    max-width: 30vw;
 }
.el-button--large {
    @media(orientation: portrait) {
        height: 40px;
    }
}

.el-image-viewer__next, .el-image-viewer__prev, .el-image-viewer__close {
    background-color: transparent;
}
.el-image-viewer__canvas {
    max-width: 90%;
} 
.el-select-dropdown__item {
    max-width: 50vw;
    @media(orientation: portrait) {
        max-width: min(50vw, 300px);
    }
}
.imageModuleWrapper {
    display: flex;
    width: 90dvw;
    height: 100dvh;
    
    background-color: var(--el-bg-color);
    transition: background-color 0.5s ease-in;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    overflow: hidden;
    left: 0;
    @media(orientation: portrait) {
        // padding-top: 15%;
        width: 100dvw;
        
        height: 90dvh;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
    }
    // @media(max-width: 490px) {
    //     height: 78vh;
    // }
    .inoutput {
        $marSize: 30px;
        $marginHorizon: 30px;
        display: flex;
        flex-direction: column;
        width: 85dvw;
        height: 95dvh;
        margin-left: 4dvw;
        border-radius: 12px;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        overflow: hidden;
        box-shadow: 0px 0px 5px 2px gray;
        @media(orientation: portrait) {
            width: 90dvw;
            height: 90%;
            margin: 0;
        }
        @media(max-width: 490px) {
            width: 90dvw;
        }
        .imageArea {
            
            height : calc(90% - 2* $marSize); 
            margin: $marSize $marginHorizon;
            width: calc(100% - 2* $marginHorizon); 
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            // border: 2px solid white;
            border-radius: 15px;
            // z-index: 11; 
                #imageSrc {
                    border-radius: 15px;
                    object-fit: contain;
                    max-width: 100%;
                    max-height: 100%;
                    // z-index: 121;
                }
                #imageOutput {
                    border-radius: 15px;
                    object-fit: contain;
                    max-width: 100%;
                    max-height: 100%;
                    cursor: pointer;
                } 
                


        }
        .divider {
            width: 98%;
            border: 1px solid rgba(128, 128, 128, 0.093);
            // box-shadow: 5px 1px 1px rgba(182, 182, 182, 0.48);
        }
        .labelArea {
            width: 100%;
            // color: black;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            // padding-top: $marginHorizon;
            height: 10%;
            position: absolute;
            font-size: 20px;
            bottom: 0;
            @media(orientation: portrait) {
                font-size: 12px;
            }
            .labelItem {
                display: flex;
                justify-content: center; 
                align-items: center;
                color: gray;
                font-size: 15px;
            }
        }
    }


}
</style>