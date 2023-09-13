<script setup>
import { onMounted, ref, computed, onDeactivated} from 'vue'
import cv from 'opencv.js';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

const store = useStore()

const imageUrl = ref('/src/assets/imgs/Lena.png')
const imageUrlList = ref([])
const loading = ref(true)
const imageOption = ref()
const imageOutSrc = ref(null)
const imageSrc = ref(null) // <img>
const fileInput = ref(null) // <input>
const imageOutput = ref(null) // <canvas></canvas>
const imgName = ref("gang.webp")
const srcList = ref(
    [
        {
            name: "Lena",
            value: '/src/assets/imgs/Lena.png'
        },
        {
            name: "line",
            value: '/src/assets/imgs/line.png'
        },
        {
            name: "girl",
            value: '/src/assets/imgs/girl.jpeg'
        },
        {
            name: "milkyWay",
            value: '/src/assets/imgs/milkyWay.jpg'
        },
        {
            name: "gang",
            value: '/src/assets/imgs/gang.webp'
        },
        {
            name: "gundam",
            value: '/src/assets/imgs/gundam.jpeg'
        },
        {
            name: "trans",
            value: '/src/assets/imgs/trans.webp'
        },
        {
            name: "car",
            value: '/src/assets/imgs/car.webp'
        }
])
let src
let dst = new cv.Mat()

const filtredConfigs = computed( () => store.getters.filteredProcesses )

defineExpose( {
    outputImage
})

function outputImage() {
    imageUrlList.value.length = 0

    try {
        src = cv.imread(imageSrc.value)



        processImage()
        loading.value = false
        // let imgData = new ImageData(new Uint8ClampedArray(src.data, src.cols, src.rows))
        // imageOutput.value.getContext('2d').putImageData(imgData, 0, 0);
        // imageUrlList.value.push(imageOutput.value.toDataURL())
    } catch(error) {
        console.log(error)
        ElMessage({
            message: error,
            grouping: true,
            type: 'error',
        })
    }
}

const processImage = () =>  {
    cv.imshow('imageOutput', src);
    imageOutSrc.value = imageOutput.value.toDataURL()
    imageUrlList.value.push(imageOutSrc.value)
    for (const process of filtredConfigs.value) {
        if(process.imageAvaliable && process.selected) {
            let res = process.f(process.title, src, dst, process.params.map( item => item.paramValue ))
            if(!res) {
                process.selected = !process.selected
            }
            src = dst

            cv.imshow('imageOutput', src);
            imageOutSrc.value = imageOutput.value.toDataURL()
            imageUrlList.value.push(imageOutSrc.value)
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
    console.log('a', imageUrl.value)
}
function inputChange(e) {

    const file = e.target.files[0]
    console.log(file)
    if(file) {
        let url = URL.createObjectURL(file)
        srcList.value.push({
            name: file.name,
            value: url
        })
        imageUrl.value = url
        loading.value = true
    }
    console.log('input', imageUrl.value)
}

onMounted(() => {
    // fileInput.value.addEventListener('change', () => {
    //     inputChange()
    // })
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
                    <img id="imageSrc" ref="imageSrc" :src="imageUrl"
                        :style="{display: loading ? 'flex' : 'none'}" />
                    <el-image :src="imageOutSrc"
                        :preview-src-list="imageUrlList"
                        v-if="!loading"
                        fit="fill"
                        hide-on-click-modal
                        >
                    </el-image>
                </div>


                <!-- <canvas id="imageOutput" class="imageWrapper"></canvas> -->

                <canvas ref="imageOutput" id="imageOutput" style="display: none;"></canvas>
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
.el-select, .el-button--large {
    width: 70%;
 }
 .el-image {
    display: flex;
    overflow: hidden;
    justify-content: center;
 }
 .labelArea .el-scrollbar {
    max-width: 30vw;
 }
.el-button--large {
    @media(max-width: 1000px) {
        height: 40px;
    }
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
        overflow: hidden;
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
            $marSize: 10px;
            $height : calc(90% - 2* $marSize);
            height: $height;
            margin: $marSize;
            max-width: calc(100% - 2* $marSize);
            max-height: $height;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            // border: 2px solid white;
            border-radius: 10px;
            // z-index: 11;
            .imgWrapper {
                border-radius: 10px;
                overflow: hidden;
                // max-height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                // border: 2px solid white;
                // z-index: 10;
                display: flex;
                justify-content: center;
                img {
                    border-radius: 10px;
                    object-fit: fill;
                    // z-index: 121;
                }
                // .imageWrapperIn {
                //     display: flex;
                //     justify-content: center;
                //     align-items: center;
                //     overflow: hidden;

                //     border-radius: 10px;

                // }

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
            height: 10%;
            position: absolute;
            font-size: 20px;
            bottom: 0;
            @media(max-width: 1000px) {
                font-size: 12px;
            }
            .labelItem {
                display: flex;
                justify-content: center;
                align-items: center;
                align-items: center;
                color: gray;
                font-size: 15px;
            }
        }
    }


}
</style>