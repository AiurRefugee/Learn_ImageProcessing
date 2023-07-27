<script setup>
import { onMounted, ref, computed, nextTick} from 'vue'
const selectIndex = ref(1)
const options = ref(['image', 'video', 'camera'])
</script>
<template>
    <div class="swipeBar">
        <div v-for=" (item, index) in options" :key="index" class="swipitem" :class="{ select: index == selectIndex }">
            {{ item }}
        </div>
    </div>
</template>
<style lang="scss">
.swipeBar {
    overflow: hidden;
    // background-color: black;
    width: 100%;
    min-height: 30%;
    // background-color: blue;
    border: 1px solid black;
    flex: 1;
    flex-direction: column;
    .swipitem {
        width: 70%; 
        margin: 1%;
        
    } 
    .select {
        
        border-top: 1px solid #ffb444;
        border-bottom: 1px solid #ffb444;
    }
}
</style>