<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import cv from 'opencv.js';  

defineExpose( {
    outputImage: () => {
        loading.value = false
        cv.imshow('ImageOutput', dst);
        mat.delete();
    }
})

const loading = ref(true)
const imageOption = ref()
const imageSrc = ref(null)
const fileInput = ref(null)
const src = ref("Lena.png")
const srcList = ref(["Lena.png", "girl.jpeg", "milkyWay.jpg", "gang.webp", "gundam.jpeg", "trans.webp", "car.webp"])
let dst = new cv.Mat()
let mat
function input() {
    
    document.querySelector('#fileInput').click()
}
function inputChange(e) {
    imageSrc.value.src = URL.createObjectURL(e.target.files[0]);
}

onMounted(() => {
       
    imageSrc.value.onload = function() { 
        // await nextTick()
        
        mat = cv.imread(imageSrc.value);
        console.log(mat.size())
        
        cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY);
        let rect = new cv.Rect(100, 100, 200, 200);
        // dst = dst.roi(rect);
        
    };
        
})

</script>
<template>
    <div class="imageWrapper">
        <var-paper class="inoutput" :elevation="12" :radius="12">
            
            <div class="imageArea" @click="input"> 
                <img ref="imageSrc" class="imgInoutput" :src="`/src/assets/imgs/${src}`"/>
                <!-- <img id="imageSrc" > -->
            </div>
            <div class="labelArea">
                 <el-row justify="center" style="width: 100%;">
                    <el-col :span="6"  >
                        <div>Image Input</div>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-select v-model="src" placeholder="选择图片" size="large">
                            <el-option :label="item" :value="item" v-for="(item, index) in srcList" :key="index">
                                 
                            </el-option>
                        </el-select>
                    </el-col>
                 </el-row>
                 
                <label>
                    <input ref="fileInput" type="file" id="fileInput" name="file" style="display: none;" @change="inputChange"/>
                </label>
            </div>
        </var-paper> 
        <var-paper class="inoutput" :elevation="12" :radius="12">
            <div class="imageArea">
                <var-skeleton
                    title 
                    card
                    :rows="4"
                    :loading="loading"
                    v-if="loading"
                >
                </var-skeleton>
                <canvas id="ImageOutput" class="imgInoutput" :style="{display: loading? 'none' : 'block'}"></canvas>
            </div>
            <div class="labelArea">
                <div>Image Output</div>
                 
                <label>
                    <input type="file" id="fileInput" name="file" style="display: none;" />
                </label>
            </div>
        </var-paper>  
    </div>
</template>
<style lang="scss">
 
:deep(* .el-col-12) {
    display: flex;
    justify-content: center;
}
.imageWrapper {
    display: flex;
    width: 100vw;
    height: 100vh;
    margin-right: 10vw;
    justify-content: space-around;
    align-items: center;
    // background-color: green;
    .inoutput {
        flex-direction: column;
        width: 46%;
        height: 95vh;
        padding-top: 1%; 
        background-color: rgba($color: white, $alpha: 0.8);
        .imageArea {
            width: 100%;
            height: 92%;
            display: flex;
            flex-direction: column;
            justify-items: center;
            align-items: center;
            padding-top: 10%;
            .imgInoutput { 
                //display: flex;
                max-height: 90%;
                max-width: 90%;
                min-width: 55%;
                padding-top: 5%;
            }
            
        }
        .imageArea div {
            display: block;
        }
        .labelArea {
            width: 100%;
            color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            font-size: 20px;
            letter-spacing: 3px;
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