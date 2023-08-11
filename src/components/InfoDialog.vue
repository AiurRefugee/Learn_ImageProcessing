<script setup>
import { onMounted, ref, computed, onUnmounted, nextTick, watch} from 'vue' 
import { marked } from 'marked'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; 
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core'  

const props = defineProps(['infoVisible', 'infoList']) 

const markedOption = {
    gfm: true,
    breaks: true

}

function parse(mark) {
    console.log(mark)
    let res = marked(mark, { breaks: true })
    console.log(res)
    return res
}
// const output = computed( () => {

// })

</script>
<template> 
    <el-dialog
        v-model="props.infoVisible"
        title="Details"  
        width="60%" 
    >   
        
        <el-descriptions
            :title="infoList.title"
            :extra="infoList.theory || ''" 
            :column="1"
            :size="size"
            border
        >
            <el-descriptions-item :label="'steps'" >
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
}
:deep(.el-descriptions__label) {
    text-align: center;
}
:deep(.el-dialog) {
   height: 200px;
}
.el-carousel__item {
    overflow: auto;

} 
hr {
    width: 100%;
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