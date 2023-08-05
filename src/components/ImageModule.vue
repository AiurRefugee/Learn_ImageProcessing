<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
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
const canvasOutput = ref(null) // <canvas></canvas>
const imgName = ref("Lena.png")
const srcList = ref(["Lena.png", "girl.jpeg", "milkyWay.jpg", "gang.webp", "gundam.jpeg", "trans.webp", "car.webp"])
let src
let dst = new cv.Mat()

const filtredConfigs = computed( () => store.getters.filteredProcesses )

defineExpose( {
    outputImage: () => {
        imageUrl.value = null
        imageUrlList.value = []
        loading.value = false
        try {  
            src = cv.imread(imageSrc.value)  

            cv.imshow('canvasOutput', src);
            imageUrl.value = canvasOutput.value.toDataURL()
            imageUrlList.value.push(imageUrl.value)

            processImage()   
            
            // let imgData = new ImageData(new Uint8ClampedArray(src.data, src.cols, src.rows))
            // canvasOutput.value.getContext('2d').putImageData(imgData, 0, 0);
            // imageUrlList.value.push(canvasOutput.value.toDataURL())
        } catch(error) {
            console.log(error)
            ElMessage.error(`${error}.`)
        }
    }, 
    
})

const processImage = () =>  {
    for (const process of filtredConfigs.value) { 
        if(process.imageAvaliable && process.selected) {
            let res = process.f(process.title, src, dst, process.params.map( item => item.paramValue ))
            if(!res) {
                process.selected = !process.selected
            }
            src = dst

            cv.imshow('canvasOutput', src);
            imageUrl.value = canvasOutput.value.toDataURL()
            imageUrlList.value.push(imageUrl.value)
            // let imgData = new ImageData(new Uint8ClampedArray(src.data, src.cols, src.rows))
            // canvasOutput.value.getContext('2d').putImageData(imgData, 0, 0);
            // imageUrlList.value.push(canvasOutput.value.toDataURL())
        }
    }
}

function input() {
    
    document.querySelector('#fileInput').click()
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

</script>
<template>
    <el-row class="imageWrapper">
        <div class="inoutput" :elevation="12" :radius="12">
            
            <div class="imageArea" @click="input"> 
                <img id="imageSrc" ref="imageSrc" class="imgInoutput" :src="`/src/assets/imgs/${imgName}`"/>
                <!-- <img id="imageSrc" > -->
            </div>
            <div class="labelArea">
                 <el-row justify="center" align="middle" style="width: 100%;">
                    <el-col :span="6">
                        <el-text size="large">Image Input</el-text>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-select v-model="imgName" placeholder="选择图片" size="large">
                            <el-option :label="item" :value="item" v-for="(item, index) in srcList" :key="index"> </el-option>
                        </el-select>
                    </el-col>
                 </el-row>
                 
                <label>
                    <input ref="fileInput" type="file" id="fileInput" name="file" style="display: none;" @change="inputChange"/>
                </label>
            </div>
        </div> 
        <div class="inoutput" :elevation="12" :radius="12">
            <div class="imageArea">
                <div class="imgInoutput"> 
                    <el-skeleton :rows="10" animated v-if="loading">
                    </el-skeleton>

                    <el-image :src="imageUrl" 
                        :preview-src-list="imageUrlList"
                        fit="cover"
                        v-if="!loading"
                        >
                    </el-image>
                </div>

                <!-- <canvas id="canvasOutput" class="imgInoutput"></canvas> -->

                <canvas ref="canvasOutput" id="canvasOutput" class="imgInoutput" :style="{display: loading? 'none' : 'none'}"></canvas>
            </div>
            <div class="labelArea" justify="center">
                <el-row>
                    <el-col :span="24">
                        <el-text size="large"> Image Output</el-text>
                    </el-col>
                </el-row>
            </div>
        </div>  
    </el-row>
</template>
<style lang="scss">
 
.imageWrapper {
    display: flex;
    width: 90vw;
    height: 100vh;
    margin-right: 10vw;
    justify-content: flex-start;
    align-items: center;
    left: 0;
    position: absolute;
    .inoutput { 
        display: flex;
        flex-direction: column;
        width: 40vw;
        height: 95vh; 
        margin-left: 4vw;
        border-radius: 12px;
        justify-content: space-around;
        box-shadow: 0px 0px 10px 5px gray;
        // background-color: rgba($color: white, $alpha: 0.8);
        .imageArea {
            width: 100%;
            height: 80%;
            display: flex;
            padding-top: 5%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            //padding-top: 10%;
            .imgInoutput { 
                //display: flex;
                max-height: 90%;
                max-width: 90%;
                min-width: 55%;
                // padding-top: 5%;
            }
            
        }
        
        .labelArea {
            width: 100%;
            // color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 15%; 
            letter-spacing: 3px;
            // border: 1px solid black;
            // font-weight: 800;
            .selectArea {
                display: block;
                height: 50px; 
                width: 300px; 

            }
        }
    }  
    
   
}
</style>