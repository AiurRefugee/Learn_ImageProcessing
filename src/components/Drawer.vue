<script setup>
import { onMounted, ref, computed, onUnmounted, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { classification, configs } from '@/opencv/configs.js'
import cv from 'opencv.js' 
import { ElMessage } from 'element-plus';  
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark) 
const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const direction = ref("ltr")
const labelWidth = ref(6)
const contentWidth = ref(24 - labelWidth.value)
const maxCollapseNum = ref(2)
let imgInput, src
let dst = new cv.Mat()
const selectedProcessions = ref([])
const primaryClassnameList = classification.map( item => item.primaryClass)
 
const drawerConfigs = ref(configs)
const classNames = ref(classification)
const drawerSwitch = computed( () => store.getters.drawerSwitch )
const curOpt = computed( () => store.getters.currentOption )
const filtredConfigs = computed( () => {
  console.log(selectedProcessions.value)
  if( selectedProcessions.value && selectedProcessions.value.length ) {
    return   drawerConfigs.value.filter( (item) => selectedProcessions.value.includes(item.secondrayClass) )
  } else {
    return   drawerConfigs.value
  }
  return []
})

function show() {
  console.log(selectedProcessions.value)
}

function output() { 
  toggleDark()
  console.log(localStorage)
  if(curOpt.value == 'image') { 
    try { 
      src = cv.imread(imgInput)  
      for (const process of filtredConfigs.value) { 
        if(process.imageAvaliable && process.selected) {
          process.f(process.title, src, dst, process.params.map( item => item.paramValue ))
          src = dst
        }
      } 
      if(filtredConfigs.value.filter( (item) => item.selected).length) {
        cv.imshow('imageOutput', dst);
      } else {
        cv.imshow('imageOutput', src);
      }
        

    } catch(error) {
      console.log(error)
      ElMessage.error(`${error}.`)
    }

  }
}

function changeHandle(val) {
  console.log(val)
}
onMounted( async () => {
  // await nextTick() 
  imgInput = document.getElementById('imageSrc')  
   
})
onUnmounted( () => {
  // src.delete()
  // dst.delete()
})

</script>
<template> 
     <transition name="drawer" >
        <div class="drawer" v-if="drawerSwitch" @click="output" ref="el">
            <div class="filterBar">
              <el-row justify="start" align="middle">
                <el-col :span="3">
                  <el-text>
                    <h4>筛选：</h4>
                  </el-text>
                </el-col> 
                <el-col :span="21" >
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
                  <el-space direction="vertical" :size="20" fill="fill">
                    <el-collapse-item :name="process.title" :title="process.title" 
                      v-for="(process, index) in filtredConfigs" :key="index">
                    <el-space size="10" direction="vertical" fill>
                      
                      <el-row align="middle">
                        <el-col :span="20"> 
                          <el-switch v-model="process.selected"></el-switch>
                        </el-col>
                        <el-col :span="4">
                          <el-link :underline="false">
                            <el-icon><View /></el-icon>Learn More
                          </el-link>
                        </el-col> 
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <div class="switchGrid">
                            <el-row v-for="(Switch, index) in process.params.filter( element => element.widget.type == 'switch')"
                              justify="start" align="middle" :key="index">
                              <el-col :span="12">{{ Switch.paramName }}</el-col>
                              <el-col :span="12">
                                <el-switch v-model="Switch.paramValue"></el-switch>
                              </el-col>
                            </el-row>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row v-for="(slider, index) in process.params.filter( element => element.widget.type == 'slider')" :key="index">
                        <el-col :span="labelWidth"> {{ slider.paramName }}</el-col>
                        <el-col :span="contentWidth">
                          <el-slider v-model="slider.paramValue" show-input
                            show-stop="true" input-size="small" :step="slider.widget.step"
                            :min="slider.widget.min" :max="slider.widget.max">
                          </el-slider>
                        </el-col>
                      </el-row>
                      <el-row v-for="(selecter, index) in process.params.filter( element => element.widget.type == 'selecter')" :key="index">
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
}
.drawer-enter-from,
.drawer-leave-to {
    opacity: 0;
    transform: translateX(-100%);
} 
.primaryClass {
  max-height: 200px;
}
.drawer {
    width: 35vw;
    height: 95vh;
    //display: flex;
    border-radius: 12px;
    // box-shadow: 2px 2px 10px gray;
    // background-color: rgba(151, 151, 151, 0.395);
    
    backdrop-filter: blur(10px);
    position: absolute;
    left: 0;
    z-index: 999;
    margin-left: 4vw;
    padding-left: 1%;
    padding-right: 1%;
    .filterBar {
      width: 100%;
      height: 60px;
      // color: gray;
    } 
    .scrollerWrapper {
      width: 100%;
      height: 93%;
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