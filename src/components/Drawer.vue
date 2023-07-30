<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { classification, configs } from '@/opencv/configs.js'
import cv from 'opencv.js' 
import { ElMessage } from 'element-plus'; 
const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const direction = ref("ltr")
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
    if(curOpt.value == 'image') {
      
      try {
        src = cv.imread(imgInput) 
        for (const process of configs) {
          if(process.imageAvaliable && process.selected) {
            process.f(src, dst, process.params.map( item => item.paramValue ))
          }
        }
        
        cv.imshow('imageOutput', dst);
      } catch(error) {
       // ElMessage.error(`${error}.`)
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
</script>
<template> 
     <transition name="drawer">
        <div class="drawer" v-if="drawerSwitch" @click="output" >
            <el-scrollbar>
              <el-row justify="start" align="middle">
                <el-col :span="3">
                  <h4>筛选：</h4>
                </el-col> 
                <el-col :span="21" >
                  <el-select v-model="selectedProcessions" filterable @change="show"
                    placeholder="请选择条件" multiple collapse-tags max-collapse-tags="3">
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
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-space direction="vertical" size="10" fill="fill">
                  <el-collapse-item :name="process.title" :title="process.title" 
                    v-for="(process, index) in filtredConfigs" :key="index">
                   <el-space size="10" direction="vertical" fill>
                    <el-row>
                      <el-col :span="19">
                        <el-checkbox label="on" v-model="process.selected"></el-checkbox>
                      </el-col>
                      <el-col :span="5">
                        <el-button text type="primary" icon="View" size="small" class="el-icon--right">Learn More</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-for="(slider, index) in process.params.filter( element => element.widget.type == 'slider')" :key="index">
                      <el-col :span="4"> {{ slider.paramName }}</el-col>
                      <el-col :span="20">
                        <el-slider v-model="slider.paramValue" show-input input-size="small"
                          :min="slider.widget.min" :max="slider.widget.max">
                        </el-slider>
                      </el-col>
                    </el-row>
                    <el-row v-for="(selecter, index) in process.params.filter( element => element.widget.type == 'selecter')" :key="index">
                      <el-col :span="4"> {{ selecter.paramName }}</el-col>
                      <el-col :span="20">
                        <el-select v-model="selecter.paramValue" placeholder="" size="small">
                          <el-option :label="selecter.widget.selectLables[index]" :value="option" v-for="(option, index) in selecter.widget.selectValues" :key="index"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                   </el-space>
                  </el-collapse-item>
                </el-space>
              </el-collapse>
            </el-scrollbar>
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
    width: 25vw;
    height: 91vh;
    //display: flex;
    border-radius: 15px;
    box-shadow: 2px 2px 10px gray;
    //background-color: transparent;
    background-color: rgba($color: white, $alpha: 0.8);
    backdrop-filter: blur(5px);
    position: absolute;
    left: 0;
    z-index: 999;
    margin-left: 1.5%;
    padding: 1%
}
</style>