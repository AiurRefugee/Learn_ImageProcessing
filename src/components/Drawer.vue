<script setup>
import { onMounted, ref, computed, onUnmounted, nextTick, watch} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { classification, configs } from '@/opencv/configs.js'
import cv from 'opencv.js' 
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core' 
const emit = defineEmits(['outputImage']) 

const isDark = useDark()
const toggleDark = useToggle(isDark) 
const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const direction = ref("ltr")
const labelWidth = ref(5)
const filterBarLabel = ref(3)

const contentWidth = ref(24 - labelWidth.value)
const maxCollapseNum = ref(2)
let imgInput, videoInput, canvasOutput, src, cap, videoWitdth, videoHeight, begin, delay
const FPS = 30
let dst = new cv.Mat()
const selectedProcessions = ref([])
const primaryClassnameList = classification.map( item => item.primaryClass)
 
const drawerConfigs = ref(configs)
const classNames = ref(classification)
const drawerSwitch = computed( () => store.getters.drawerSwitch )
const curOpt = computed( () => store.getters.currentOption )
const filtredConfigs = computed( () => { 
  if( selectedProcessions.value && selectedProcessions.value.length ) {
    return   drawerConfigs.value.filter( (item) => selectedProcessions.value.includes(item.secondrayClass) )
  } else {
    return   drawerConfigs.value
  } 
}) 

const dark = computed( () => {
  console.log(isDark.value)
  return isDark.value
})

watch(filtredConfigs.value, (val) => { 
  store.dispatch('set_filteredProcesses', val)
  // console.log(store.getters.filteredProcesses.map( item => item.selected ))
})

function output() {  
  if(curOpt.value == 'image') {  
    emit('outputImage')
  }  
}

function processImage() {
  for (const process of filtredConfigs.value) { 
    if(process.imageAvaliable && process.selected) {
      process.f(process.title, src, dst, process.params.map( item => item.paramValue ))
      src = dst
    }
  }
}

function toggle() {
  store.dispatch('toggle_currentOption')
}

function processVideo() {
  try {
    begin = Date.now(); 
    cap.read(src); 
    //cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    canvasOutput.getContext('2d').clearRect(0, 0, videoWitdth, videoHeight)
    for (const process of filtredConfigs.value) { 
      if(process.imageAvaliable && process.selected) {
        process.f(process.title, src, src, process.params.map( item => item.paramValue ))
         
      }
    }
    delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  } catch(error) {
    console.log(error)
    ElMessage(`${error}`)
  }
}

function changeHandle(val) {
  console.log(val)
}
onMounted( async () => { 
  // console.log('test'. filtredConfigs.value)
  store.dispatch('set_filteredProcesses', filtredConfigs.value)
  
   
})
onUnmounted( () => {
  // src.delete()
  // dst.delete()
})

</script>
<template> 
     <transition name="drawer" >
        <div class="drawer" v-show="drawerSwitch" @click="output" ref="el"
          :style="{'background-color': isDark? 'rgb(0 0 0 / 40%)' : 'rgb(255 255 255 / 40%)'}">
            <div class="filterBar">
              <el-row justify="space-between" align="middle">
                <el-col :span="filterBarLabel">
                  <el-text @click="toggleDark">
                    <h4>筛选：</h4>
                  </el-text>
                </el-col> 
                <el-col :span="24 - filterBarLabel" >
                  <el-select v-model="selectedProcessions" filterable @change="show"
                    placeholder="请选择条件" multiple collapse-tags :max-collapse-tags="maxCollapseNum">
                    <el-option-group
                      v-for="group in classNames"
                      :key="group.primaryClass"
                      :label="group.primaryClass"
                    >
                      <el-option
                        v-for="item in group.secondrayClass"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-option-group>
                  </el-select>
                </el-col>
              </el-row>
            </div> 
            <div class="scrollerWrapper">
              <el-scrollbar> 
                <el-collapse v-model="activeNames" @change="handleChange">
                  <el-space direction="vertical" :size="15" fill="fill">
                    <el-collapse-item :name="process.title" :title="process.title" 
                      v-for="(process, index) in filtredConfigs" :key="index">
                      <el-space size="10" direction="vertical" fill>
                        
                        <el-row align="middle" justify="space-between">
                           
                            <el-switch v-model="process.selected"></el-switch>
                            
                            <el-link :underline="false">
                              <el-icon><View /></el-icon>Learn More
                            </el-link> 
                        </el-row>
                        <el-row>
                          <el-col :span="24">
                            <div class="switchGrid">
                              <el-row v-for="(Switch, index) in process.params.filter( element => element.widget.type == 'switch')"
                                justify="start" align="middle" :key="index">
                                <el-col :span="8">{{ Switch.paramName }}</el-col>
                                <el-col :span="8">
                                  <el-switch v-model="Switch.paramValue"></el-switch>
                                </el-col>
                              </el-row>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row v-for="(slider, index) in process.params.filter( element => element.widget.type == 'slider')" 
                          justify="center" :key="index">
                          <el-col :span="labelWidth"> {{ slider.paramName }}</el-col>
                          <el-col :span="contentWidth">
                            <el-slider v-model="slider.paramValue" show-input
                              show-stop="true" input-size="small" :step="slider.widget.step"
                              :min="slider.widget.min" :max="slider.widget.max">
                            </el-slider>
                          </el-col>
                        </el-row>
                        <el-row v-for="(selecter, index) in process.params.filter( element => element.widget.type == 'selecter')"
                          justify="center" :key="index">
                          <el-col :span="labelWidth"> {{ selecter.paramName }}</el-col>
                          <el-col :span="contentWidth">
                            <el-select v-model="selecter.paramValue" placeholder="" size="small">
                              <el-option :label="selecter.widget.selectLabels[index]" :value="option" v-for="(option, index) in selecter.widget.selectValues" :key="index"></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </el-space>
                    </el-collapse-item>
                  </el-space>
                </el-collapse>
              </el-scrollbar>
            </div>
        </div>
     </transition>
     <div class="mask" v-if="drawerSwitch"  @click="toggle"></div>
</template>
<style lang="scss" scoped>
$button_Color: #ffb444;
div{
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // border: 1px solid white;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.5s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 1;
  
  transform: translateX(0);
  -webkit-backdrop-filter: blur(10px); 
  backdrop-filter: blur(10px);
}
.drawer-enter-from,
.drawer-leave-to {
    opacity: 0; 
    transform: translateX(-100%);
    backdrop-filter: blur(2px);
} 
:root {
  --el-color-primary: green;
}
.primaryClass {
  max-height: 200px;
}
.mask {
  width: 90vw;
  height: 100vh;
  position: absolute;
  background-color: transparent;
  left: 0;
  top: 0;
  z-index: 1;
}
.drawer {
    width: 40vw;
    height: 95vh;
    //display: flex;
    border-radius: 12px;
    box-shadow: 2px 2px 10px rgba(205, 204, 204, 0.6);
    // background-color: rgba($color: #8d8d8d, $alpha: 0.5); 
    // border: 1px solid white;
    -webkit-backdrop-filter: blur(10px); 
    backdrop-filter: blur(10px);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    left: 0;
    z-index: 999;
    margin-left: 4vw;
    // padding-left: 1%;
    // padding-right: 1%;
    
    .filterBar {
      width: 90%;
      height: 60px;
      // color: gray;
    } 
    .scrollerWrapper {
      width: 90%;
      height: 90%;
    }
    .switchGrid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 50%);
      grid-column-gap: 20px;
      overflow: auto;
    }
} 

</style>