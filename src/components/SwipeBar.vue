<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
const selectIndex = ref(1)
const options = ref(['image', 'video', 'camera'])
</script>
<template>
    <div class="swipeBar">
        <div class="swipeWrapper">
            <div class="swipeItem" v-for="(item, index) in options" :key="index"> 
                {{ item }}
            </div>
        </div>
    </div>
</template>
<style lang="scss">
div {
    // border: 1px solid white;
}
.swipeBar {
    overflow: hidden;
    // background-color: black;
    width: 100%;
    height: 100px;
    background-color: white;
    border: 1px solid black;
     
    
    .swipeWrapper {
        height: 100%;
        overflow: hidden;
        width: 100%;
        flex-direction: column;
        .swipeItem {
            width: 100%; 
            margin: 1%;
            height: 170px;
            
        } 
    }
    .select {
        
        border-top: 1px solid #ffb444;
        border-bottom: 1px solid #ffb444;
    }
}
</style>