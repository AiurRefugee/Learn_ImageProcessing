<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import cv from 'opencv.js';  
import { ElMessage } from 'element-plus';  
import { useStore } from 'vuex';

const store = useStore()

const loading = ref(true)
const imageOption = ref()
const imageSrc = ref(null) // <img>
const fileInput = ref(null) // <input>
const imgName = ref("Lena.png")
const srcList = ref(["Lena.png", "girl.jpeg", "milkyWay.jpg", "gang.webp", "gundam.jpeg", "trans.webp", "car.webp"])
let src
let dst = new cv.Mat()

const filtredConfigs = computed( () => store.getters.filteredProcesses )

defineExpose( {
    outputImage: () => {
        
        loading.value = false
        try {  
            src = cv.imread(imageSrc.value)  
            processImage() 
            cv.imshow('imageOutput', src);
        } catch(error) {
            console.log(error)
            ElMessage.error(`${error}.`)
        }
    }, 
    
})

const processImage = () =>  {
    console.log('filtredConfigs', filtredConfigs.value.filter( item => item.selected ))
    for (const process of filtredConfigs.value) { 
        if(process.imageAvaliable && process.selected) {
        process.f(process.title, src, dst, process.params.map( item => item.paramValue ))
        src = dst
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
                            <el-option :label="item" :value="item" v-for="(item, index) in srcList" :key="index">
                                 
                            </el-option>
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
                </div>
                <!-- <canvas id="imageOutput" class="imgInoutput"></canvas> -->

                <canvas id="imageOutput" class="imgInoutput" :style="{display: loading? 'none' : 'block'}"></canvas>
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
    width: 100vw;
    height: 100vh;
    margin-right: 10vw;
    justify-content: flex-start;
    align-items: center;
    // background-color: green;
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
        .imageArea div {
            display: block;
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