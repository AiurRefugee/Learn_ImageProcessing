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
</template>
<style lang="scss" scoped>
.appContainer { 
    padding-top: 100px; 
    background-color: white;
    align-items: flex-start;
}
</style>