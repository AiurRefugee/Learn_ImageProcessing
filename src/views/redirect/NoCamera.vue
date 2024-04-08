<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute() 
function goBack() {
    router.go(-1)
}
const info = ref(route.params.info)
</script>
<template>
    <div class="appContainer">
        <div class="wrapper">
            <el-result
                icon="error"
                :title="info"
                sub-title="Please go back home"
            >
                <template #extra>
                <el-button type="primary" @click="goBack">Back</el-button>
                </template>
            </el-result>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.wrapper { 
    width: 100%;
    height: 100%;
    padding-top: 15%; 
    display: flex;
    justify-content: center;
    align-items: flex-start;
    // background-color: white; 
}
</style>