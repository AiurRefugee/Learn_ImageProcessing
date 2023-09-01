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
const imgName = ref("Lena.png")
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

function input() { 
    fileInput.value.click()
}
function inputChange(e) {
    imageSrc.value.src = URL.createObjectURL(e.target.files[0]);
}

onMounted(() => {
       
    imageSrc.value.onload = function() { 
        // await nextTick()
        
        // dst = cv.imread(imageSrc.value); 
        
        //cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY);
        let rect = new cv.Rect(100, 100, 200, 200);
        // dst = dst.roi(rect);
        
    };
        
})

onDeactivated( () => {
    console.log('onDeactivated')
})

</script>
<template>
    <div class="imageWrapper">

        <div class="inoutput">
            <div class="imageArea">
                <div class="imgInoutput"> 
                    <!-- <el-skeleton :rows="4" animated v-if="loading">
                    </el-skeleton> -->
                    <img id="imageSrc" ref="imageSrc" class="imgInoutput" :src="`/src/assets/imgs/${imgName}`" :style="{display: loading ? 'flex' : 'none'}"/>
                    <el-image :src="imageUrl" 
                        fit="cover"
                        :preview-src-list="imageUrlList" 
                        v-if="!loading"
                        >
                    </el-image>
                </div>

                <!-- <canvas id="imageOutput" class="imgInoutput"></canvas> -->

                <canvas ref="imageOutput" id="imageOutput" style="display: none;"></canvas>
            </div>
            <div class="labelArea" justify="center">
                <el-row justify="center" :gutter="40" style="width: 80%;">
                    <el-col :span="12" class="labelItem">
                        <el-select v-model="imgName" placeholder="选择图片" size="large" @change="selectChange">
                            <el-option :label="item" :value="item" v-for="(item, index) in srcList" :key="index"> </el-option>
                        </el-select>
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
        height: 30px;
    }
} 
.el-image {
    max-height: 100%;
}
.el-button--large {
    @media(max-width: 1000px) {
        height: 30px;
    }
}
.imageWrapper {
    display: flex;
    width: 90vw;
    height: 100vh;
    margin-right: 10vw;
    background-color: blue;
    justify-content: flex-start;
    align-items: center; 
    @media(max-width: 1000px) {
        width: 100vw;
        height: 90vh;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin: 0;
    }
    .inoutput { 
        display: flex;
        flex-direction: column;
        width: 85vw;
        height: 95vh; 
        margin-left: 4vw;
        border-radius: 12px;
        justify-content: flex-start; 
        position: relative;
        box-shadow: 0px 0px 5px 2px gray;
        @media(max-width: 1000px) {
            width: 80vw; 
            height: 70vh;
            margin: 5% 0 2% 0;
        }
        // background-color: rgba($color: white, $alpha: 0.8);
        .imageArea {
            max-width: 100%;
            height: 85%;
            display: flex;  
            padding: 2%;
            justify-content: center;
            align-items: center; 
            overflow: hidden;
            @media(max-width: 1000px) {
                padding: 0 5% 0 5%;;
            }
            //padding-top: 10%;
            .imgInoutput {  
                display: flex;
                justify-content: center;
                overflow: hidden;  
                img {
                    display: flex;
                    border-radius: 10px; 
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
            bottom: 0;
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