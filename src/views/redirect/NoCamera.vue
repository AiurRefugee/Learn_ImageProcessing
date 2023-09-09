<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
console.log(route.params)
function goBack() {
    router.push('/')
}
</script>
<template>
    <div class="appContainer">
        <div class="wrapper">
            <el-result
                icon="error"
                title="No Camera Avaliable"
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
    padding-top: 100px; 
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: white; 
}
</style>