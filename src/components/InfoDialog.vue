<script setup>
import { onMounted, ref, computed, onUnmounted, nextTick, watch, onActivated} from 'vue' 
import { marked } from 'marked'

const emit = defineEmits(['close']) 

const props = defineProps(['infoVisible', 'infoList']) 

const markedOption = {
    gfm: true,
    breaks: true

}

function close() {
    emit('close')
}

function parse(mark) { 
    let res = marked(mark, { breaks: true }) 
    return res
}

onActivated( async () => {
    await nextTick()
    console.log('infoDialog', props.infoVisible)
})

</script>
<template> 
    
    <el-dialog
        v-model="props.infoVisible"
        title="Details"  
        width="80vw" 
        align-center
        destroy-on-close
        @close="close" 
    >   
        <div class="dialog">
            <el-descriptions
                :title="infoList.title"
                :extra="infoList.theory || ''" 
                :column="1"
                :size="size"
                border
            >
                <el-descriptions-item :label="'steps'"  v-if="infoList.steps && infoList.steps.length ">
                    <el-carousel :autoplay="false" direction="horizontal" indicator-position="outside">
                        <el-carousel-item v-for="(item, index) in infoList.steps" :key="index"> 
                            <h3>{{ item.label }}</h3>
                            <div class="desc" v-html="parse(item.desc)"> 
                            </div>
                        </el-carousel-item>  
                    </el-carousel>
                </el-descriptions-item>
                <el-descriptions-item :label="item.paramName" v-for="(item, index) in infoList.params" :key="index">
                    {{ item.paramDesc }}
                </el-descriptions-item>
             
             </el-descriptions>
        </div>
    </el-dialog>
   
</template>
<style lang="scss" scoped> 
$paddingLR: 5%;
/* 隐藏滚动条及滚动轨道 */
::-webkit-scrollbar {
  width: 0; /* 隐藏垂直滚动条 */
  height: 0; /* 隐藏水平滚动条 */
}

/* 隐藏滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: transparent;
}

/* 隐藏滚动条的滑轨 */
::-webkit-scrollbar-track {
  background-color: transparent;
}
::v-deep(.el-descriptions__title) {
    font-size: 40px;
    letter-spacing: 2px; 
    max-width: 60%;
    word-wrap: break-word;
    margin-right: 2%;
}
:deep(.el-descriptions__label) {
    text-align: center;
}
:deep(.el-dialog) { 
    overflow: hidden;
}
:deep(.el-carousel__arrow--left) {
    @media(max-width: 1000px) {
        display: none;
    }
}
:deep(.el-carousel__arrow--right) {
    @media(max-width: 1000px) {
        display: none;
    }
}
:deep(.el-dialog) {
    overflow: hidden;
}
.el-carousel__item {
    overflow: auto; 
}  
hr {
    width: 100%;
}
:deep(.el-descriptions__extra) {
    text-indent: 20px; 
    max-height: 150px;
    overflow-y: auto;
}

.dialog {
    max-height: 80vh;
    overflow: auto;
    
}
.desc {
    display: flex;
    justify-content: space-around;
    flex-direction: column; 
    word-break: break-all;  
    overflow: auto;
    text-indent: 20px;
    white-space: pre-wrap;
    padding-left: $paddingLR;
    padding-right: $paddingLR;
}

</style>