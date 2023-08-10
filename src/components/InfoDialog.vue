<script setup>
import { onMounted, ref, computed, onUnmounted, nextTick, watch} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; 
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core'  

const props = defineProps(['infoVisible', 'infoList']) 

</script>
<template> 
    <el-dialog
        v-model="props.infoVisible"
        title="Details"  
        width="60%"
        align-center
    >   
        
        <el-descriptions
            :title="infoList.title"
            :extra="infoList.theory || ''"
            direction="vertical"
            :column="2"
            :size="size"
            border
        >
            <el-descriptions-item :label="item.paramName" v-for="(item, index) in infoList.params" :key="index">
                {{ item.paramDesc }}
            </el-descriptions-item>
             
    </el-descriptions>
    </el-dialog>
</template>
<style lang="scss" scoped> 
::v-deep(.el-descriptions__title) {
    font-size: 40px;
    letter-spacing: 2px;
}
.dialog {
    width: 90vw;
    height: 90vh;
}

</style>