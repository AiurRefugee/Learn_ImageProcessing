<script setup>
import { onMounted, ref, computed, onDeactivated} from 'vue' 
import cv from 'opencv.js';  
import { ElMessage } from 'element-plus';  
import { useStore } from 'vuex';

const store = useStore()

const imageUrl = ref(null)
const imageUrlList = ref([])
const loading = ref(true)
const imageOption = ref()
const imageSrc = ref(null) // <img>
const fileInput = ref(null) // <input>
const imageOutput = ref(null) // <canvas></canvas>
const imgName = ref("gang.webp")
const srcList = ref(["Lena.png", "line.png", "girl.jpeg", "milkyWay.jpg", "gang.webp", "gundam.jpeg", "trans.webp", "car.webp"])
let src
let dst = new cv.Mat()

const filtredConfigs = computed( () => store.getters.filteredProcesses )

defineExpose( {
    outputImage
})

function outputImage() {
    imageUrl.value = null
    imageUrlList.value = []
    loading.value = false
    try {  
        src = cv.imread(imageSrc.value)  

        cv.imshow('imageOutput', src);
        imageUrl.value = imageOutput.value.toDataURL()
        imageUrlList.value.push(imageUrl.value)

        processImage()   
        
        // let imgData = new ImageData(new Uint8ClampedArray(src.data, src.cols, src.rows))
        // imageOutput.value.getContext('2d').putImageData(imgData, 0, 0);
        // imageUrlList.value.push(imageOutput.value.toDataURL())
    } catch(error) {
        console.log(error)
        ElMessage.error(`${error}.`)
    }
}

const processImage = () =>  {
    for (const process of filtredConfigs.value) { 
        if(process.imageAvaliable && process.selected) {
            let res = process.f(process.title, src, dst, process.params.map( item => item.paramValue ))
            if(!res) {
                process.selected = !process.selected
            }
            src = dst

            cv.imshow('imageOutput', src);
            imageUrl.value = imageOutput.value.toDataURL()
            imageUrlList.value.push(imageUrl.value)
            // let imgData = new ImageData(new Uint8ClampedArray(src.data, src.cols, src.rows))
            // imageOutput.value.getContext('2d').putImageData(imgData, 0, 0);
            // imageUrlList.value.push(imageOutput.value.toDataURL())
        }
    }
}

function selectChange() {
    loading.value = true
}

function upload() { 
    fileInput.value.click()
}
function inputChange(e) {
    const file = e.target.files[0]
    imageSrc.value.src = URL.createObjectURL(file);
    console.log(e.target.files[0])
    imageUrlList.value.push(file.name)
}

onMounted(() => {
    // alert(window.innerWidth)
    imageSrc.value.onload = function() { 
        // await nextTick()
        
        // dst = cv.imread(imageSrc.value); 
        
        //cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY);
        let rect = new cv.Rect(100, 100, 200, 200);
        // dst = dst.roi(rect);
        
    };
        
})

onDeactivated( () => {
    console.log('image Deactivated')
})

</script>
<template>
    <div class="imageModuleWrapper">

        <div class="inoutput">
            <div class="imageArea">  
                <div class="imgWrapper">
                    <img id="imageSrc" ref="imageSrc" :src="`/src/assets/imgs/${imgName}`"
                    :style="{display: loading ? 'flex' : 'none'}" />
                    <el-image :src="imageUrl"  
                        :preview-src-list="imageUrlList" 
                        v-if="!loading"
                        hide-on-click-modal
                        >
                    </el-image>  
                </div>
                

                <!-- <canvas id="imageOutput" class="imageWrapper"></canvas> -->

                <canvas ref="imageOutput" id="imageOutput" style="display: none;"></canvas>
            </div>
            <div class="labelArea" justify="center">
                <el-row justify="center" :gutter="40" style="width: 90%;">
                    <el-col :span="12" class="labelItem">
                        <el-select v-model="imgName" placeholder="选择图片" size="large" @change="selectChange">
                            <el-option :label="''" :value="''" @click="upload"> 
                                <el-icon><UploadFilled/></el-icon>
                                <span style="margin-left: 5px;">上传图片</span>
                            </el-option>
                            <el-option :label="item" :value="item" v-for="(item, index) in srcList" :key="index"> </el-option>
                            
                        </el-select>
                        <input type="file" ref="fileInput" name="file" style="display: none;" @change="inputChange">
                    </el-col>
                    <el-col :span="12" class="labelItem">
                        <el-button size="large" @click="outputImage"> Image Output</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>  
    </div>
</template>
<style lang="scss">
.el-input--large .el-input__wrapper {
    @media(max-width: 1000px) {
        height: 40px;
    }
} 
.el-button--large {
    @media(max-width: 1000px) {
        height: 40px;
    }
}
.el-image {
    // max-width: 90%;
    // max-height: 100%;
}
.el-image-viewer__next, .el-image-viewer__prev, .el-image-viewer__close {
    background-color: transparent;
}
.el-image-viewer__canvas {
    max-width: 90%;
}
.imageModuleWrapper {
    display: flex;
    width: 90vw;
    height: 100vh; 
    // background-color: blue;
    justify-content: flex-start;
    align-items: center; 
    position: absolute;
    left: 0;
    @media(max-width: 1000px) {
        // padding-top: 15%;
        width: 100vw;
        height: 90vh;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
    }
    // @media(max-width: 490px) {
    //     height: 78vh;
    // }
    .inoutput { 
        display: flex;
        flex-direction: column;
        width: 85vw;
        height: 95vh; 
        margin-left: 4vw;
        border-radius: 12px;
        justify-content: flex-start; 
        align-items: center;
        position: relative;
        box-shadow: 0px 0px 5px 2px gray;
        @media(max-width: 1000px) {
            width: 90vw; 
            height: 90%; 
            margin: 0;
        }
        @media(max-width: 490px) {
            width: 90vw;
        }
        .imageArea { 
            height: 85%; 
            margin: 2%;
            display: flex;  
            justify-content: center;
            align-items: center;   
            overflow: hidden;
            // border: 2px solid white; 
            border-radius: 10px; 
            z-index: 2; 
            .imgWrapper {  
                border-radius: 10px;
                overflow: hidden; 
                display: flex; 
                // border: 2px solid white; 
                justify-content: center;
                img { 
                    border-radius: 10px; 
                    z-index: 99; 
                } 
            }
            
            
        }
        
        .labelArea {
            width: 100%;
            // color: black;
            display: flex; 
            justify-content: center;
            height: 12%;
            position: absolute; 
            bottom: 2%;
            @media(max-width: 1000px) {
                font-size: 12px;
            } 
            .labelItem {
                display: flex;
                justify-content: center;
            }
        }
    }  
    
   
}
</style>