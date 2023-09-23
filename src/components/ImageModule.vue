<script setup>
import { onMounted, ref, computed, watch, onDeactivated, onActivated, onUnmounted, nextTick, inject} from 'vue'
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';  

const store = useStore()
 
//inject
const $bus = inject('$bus')
$bus.on('outputImage', outputImage)

//ref
const imageUrl = ref('/src/assets/imgs/gundam.jpeg')
const imageUrlList = ref([])
const loading = ref(true)
const showViewer = ref(false)
const elImage = ref()
const imageOutSrc = ref(null)
const imageInput = ref(null) // <img>
const fileInput = ref(null) // <input>
const imageOutput = ref(null) // <canvas></canvas> 
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

let width, height, context

// computed
const curOpt = computed( () => store.getters.currentOption )
const processConfigs = computed( () => store.getters.processConfigs )
const worker = computed( () => store.getters.worker)
const configs = computed( () => {
    return processConfigs.value.map( (item, index) => {
        return {
            selected: item.selected,
            imageAvailable: item.imageAvailable,
            processIndex: index,
            params: item.params.map( item => item.paramValue)
        }
    })  
})


async function initWorker() {
    await nextTick()
    worker.value.onmessage = function(event) {  
        loading.value = false 
        console.log('da', event.data)
        let contextDraw = imageOutput.value.getContext('2d')
        contextDraw.clearRect(0, 0, width, height)  
        contextDraw.putImageData(event.data.image, 0, 0)
        imageOutSrc.value = imageOutput.value.toDataURL()
        imageUrlList.value.push(imageOutSrc.value) 
        
        if(event.data.type == 'error') { 
            console.log('error')
            event.data.indexs.map(item => {
                processConfigs.value[item].selected = false
                ElMessage({
                    message: `${processConfigs.value[item].title}参数错误.`,
                    grouping: true,
                    type: 'error',
                })
            }) 
        } 
        

    };
} 

function outputImage() {   
    imageUrlList.value.length = 0 
    processImage()
    // try { 
    //     processImage()
          
    // } catch(error) {
    //     console.log(error)
    //     ElMessage({
    //         message: error,
    //         grouping: true,
    //         type: 'error',
    //     })
    // }
}

const processImage = () =>  {  
    try {
        context.clearRect(0, 0, width, height)
        let image = document.getElementById('imageInput') 
        context.drawImage(image, 0, 0); 
        imageOutSrc.value = imageOutput.value.toDataURL()
        imageUrlList.value.push(imageOutSrc.value)
        // 获取图像数据
        let imageData = context.getImageData(0, 0, width, height);   
        worker.value.postMessage({
            image: imageData,
            paramsList: configs.value,
            type: 'image'

        }); // 发送图像数据给 Web Worker
    } catch(error) {
        ElMessage({
            message: error,
            grouping: true,
            type: 'error'
        })
        console.log(error)
    }
} 

function selectChange() {
    loading.value = true
}

function upload() {
    fileInput.value.click() 
}

function inputChange(e) {
    console.log('filechange')
    const file = e.target.files[0] 
    if(file) {
        let url = URL.createObjectURL(file)
        srcList.value.push({
            name: file.name,
            value: url
        })
        imageUrl.value = url
        loading.value = true
        initImage()
    } 
}

//初始化图片大小
function initImage() {
    let image = document.getElementById('imageInput')
    width = image.width
    height = image.height 
    imageOutput.value.width = width
    imageOutput.value.height = height
    imageInput.value.width = width
    imageInput.value.height = height 
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
 

onMounted(() => {
    console.log('image onMounted')
    context = imageOutput.value.getContext('2d')
    initWorker()
    imageInput.value.addEventListener('loadedmetadata', async () => {
        console.log('metaData Loaded')
        initImage()
    })  
    if(!curOpt.value) {
        store.dispatch('set_currentOption', 'image')
    }
})

onActivated( async () => {
    console.log('image Activated')
    if(!curOpt.value) {
        store.dispatch('set_currentOption', 'image')
    }
    
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
                <img id="imageInput" ref="imageInput" :src="imageUrl" style="display: none;" @load="initImage"/>
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
                        <el-button size="large" @click="outputImage"> Image Output</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.el-input--large .el-input__wrapper {
    @media(max-width: 1000px) {
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
.el-select-dropdown__item {
    max-width: 50vw;
    @media(max-width: 1000px) {
        max-width: min(50vw, 300px);
    }
}
.imageModuleWrapper {
    display: flex;
    width: 90vw;
    height: 100vh;
    // background-color: blue;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    overflow: hidden;
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
        $marSize: 30px;
        $marginHorizon: 30px;
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
            
            height : calc(90% - 2* $marSize); 
            margin: $marSize $marginHorizon;
            width: calc(100% - 2* $marginHorizon); 
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            // border: 2px solid white;
            border-radius: 12px;
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
            padding-top: $marginHorizon;
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
                color: gray;
                font-size: 15px;
            }
        }
    }


}
</style>