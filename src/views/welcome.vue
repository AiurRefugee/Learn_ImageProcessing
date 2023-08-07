<script setup>
import { onMounted, ref, watch, nextTick, computed} from 'vue'
import { useRouter } from 'vue-router';
import { StyleProvider, Themes } from '@varlet/ui'
import { useStore } from 'vuex'; 

import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark) 

const store = useStore()
const theme = ref(false) 
const topTextSize = ref('20')
const pos = ref('left')
const topbarIconSize = ref(40)
const showOpenCV = ref(false)
const showVue = ref(false)
const showEle = ref(false) 
const status = ref(-1)
const iconWidth = ref(5)

const router = useRouter()

const iconsize = computed( () => { 
  if(window.innerWidth <= 1000 ) {
    return 150
  } else {
    return 200
  }
  
})

function changeTheme() {
  toggleDark()
}
function navigateTo(option) {
  store.dispatch('set_currentOption', option)
  if(status != "camera") {
      router.push({
        path: `/imageProcessing/${option}`
      })
  } else { 
    switch(status.value ) {
      case -1:
        router.push({
          path: `/imageProcessing/${option}`
        })
      case 0:      
        router.push('/noCamera/No Camera Avaliable') 
      case 1:
        router.push('/noCamera/Failed to access device information')
      case 2:
        router.push('/noCamera/Browser does not support mediaDevices API')

    }
     
  }
}

onMounted(() => {  
  localStorage['vueuse-color-scheme'] = 'dark'
  store.dispatch('systemInit') 
})
</script>

<template>

  <div class="appContainer">
    <div class="three" ref="canvasdom"></div>
    <el-drawer v-model="showOpenCV" direction="btt" title="OpenCV" :show-close="false">
      <div class="drawerImage">
        <img src="src/assets/imgs/opencv-logo.png"/>
      </div>
       
      <div class="drawerText">
        <p>OpenCV (Open Source Computer Vision Library: http://opencv.org) is an open-source library that includes several hundreds of computer vision algorithms. The document describes the so-called OpenCV 2.x API, which is essentially a C++ API, as opposed to the C-based OpenCV 1.x API (C API is deprecated and not tested with "C" compiler since OpenCV 2.4 releases)</p>
      </div>
     
    </el-drawer>
    <el-drawer v-model="showVue" direction="btt" title="Vue" :show-close="false">
      <div class="drawerImage">
        <el-image src="src/assets/imgs/logo.svg"></el-image> 
      </div>
       
      <div class="drawerText">
        <p>
          据官方介绍，Element Plus是首个使用 TypeScript + Vue 3.2 开发，提供完整的类型定义文档的Composition API 重构的组件库。由于 Vue 3.0 进行了大版本升级，Element 作为其生态的组件库希望借此机会丢掉历史包袱，所以开发团队对 Element 进行了一次深度重构。换句话说，Element Plus的诞生正是基于Vue3重写了每一行代码。
        </p>
      </div> 
    </el-drawer>  
    <el-drawer v-model="showEle" direction="btt" title="ElementPlus" :show-close="false">
      <div class="drawerImage">
        <img src="src/assets/imgs/element-plus-logo.svg"/> 
      </div>
       
      <div class="drawerText">
        <p>
          Vue 是一个框架，也是一个生态。其功能覆盖了大部分前端开发常见的需求。但 Web 世界是十分多样化的，不同的开发者在 Web 上构建的东西可能在形式和规模上会有很大的不同。考虑到这一点，Vue 的设计非常注重灵活性和“可以被逐步集成”这个特点。
        </p>
      </div> 
    </el-drawer>  
    <div class="topBar">
      <div class="title">
        <el-text size="large">
          <h1>Learn ImageProcessing</h1>
        </el-text>
      </div>
      <div class="topbarIcons">
        <el-row style="width:100%;" :gutter="2" justify="end" align="middle">
          <el-col :span="iconWidth" class="topItem">
            <el-link   underline="hover" @click="showOpenCV = !showOpenCV">OpenCV</el-link>
          </el-col> 
          <el-col :span="iconWidth" class="topItem">
            <el-link  underline="hover" @click="showVue = !showThree">Vue</el-link>
          </el-col>
          <el-col :span="iconWidth" class="topItem">
            <el-link   underline="hover" @click="showEle = !showEle">Element+</el-link>
          </el-col>
          <el-col :span="3" class="topItem">
            <el-switch v-model="theme" style="--el-switch-on-color: gray" @change="changeTheme">
            </el-switch>
            <!-- <el-icon size="40" @click="changeTheme()"><Sunny /></el-icon> -->
          </el-col>
          <el-col :span="2" class="topItem">
            <var-icon name="github" :size="topbarIconSize"/>
          </el-col>
        </el-row>
      </div>
      <!-- <var-divider /> -->
    </div>
    
    <div class="main">
      
      <div class="showArea">
        <div class="centerItem" @click="navigateTo('image')">
          <el-icon :size="iconsize"><PictureFilled /></el-icon>
          <div class="text">
            <el-text size="large">
              <h1>从图片输入</h1>
            </el-text>
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('video')">
          <el-icon :size="iconsize"><VideoPlay /></el-icon>
          <div class="text">
            <el-text size="large">
              <h1>从视频输入</h1>
            </el-text>
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('camera')">
          <el-icon :size="iconsize"><CameraFilled /></el-icon>
          <div class="text">
            <el-text size="large">
              <h1>从摄像头输入</h1>
            </el-text>
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<style lang="scss" scoped>
$blueHeavy: #4747d6;
$blueFull: #636b80d3;
$blueLite: #3252b167;
$sidebarFontSize: 30px;
p{
  //border: 2px solid black;
  // margin: 5px;
  text-indent: 20px;
} 
.drawerImage {
  width: 100vw;
  height: 40%;
  display: flex;
  justify-content: center;
}
.drawerText {
  width: 100%;
  height: 60%;
  overflow: auto;
  color: #858585;
}
@mixin center{
  display: flex;
  justify-content: center;
  align-items: center;
} 
.centerItem {
  @include center();
  width: 33%;
  font-size: 40px;
  flex-direction: column;
  @media (max-width: 1000px) {
    width: 500px;
  }
}
.appContainer{
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  position: relative;
  //background-color: black;
  :deep(.el-drawer__content){
    width: 50vw;
    max-height: 60vh;
  }
  .three{
    position: absolute;
    left: 0;
    top: 0;
  }
  .popup-example-block {
    padding: 20px 24px;
    width: 250px;
    height: 100vh;
  }
  .topBar{
    width: 95%;
    min-height: 10%;
    display: flex;
    justify-content: space-between;
    @media (max-width: 1000px) {
      flex-direction: column;
      max-height: 150px;
    }
    .title{ 
      min-height: 8vh;
      font-size: 50px;
      padding-right: 1%;
      font-style: italic;
      letter-spacing: 3px;
      @include center();
      padding-left: 2%;
      justify-content: flex-start;
      font-weight: 900;
      font-family: math;
      @media (max-width: 1000px) {
        font-size: 26px;
        width: 95vw;
      }
      h1 {
        font-size: 30px;
      }
    }
    .topbarIcons{
       min-width: 40%;
       //padding-right: 2%;
      @include center();
      max-height: 100px; 
      .topItem {
        @include center();
        a {
          font-size: 20px;
        }
      }
      @media (max-width: 1000px) {
        font-size: 20px;
        width: 100%;
        flex-direction: column;
      }
    } 
  }
  .main{
    display: flex;
    width: 99vw;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    @media (max-width: 1000px) {
      flex-direction: column;
      justify-content: flex-start;
      padding-top: 10%;
    }
    .showArea{
      width: 85%;
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
      // padding-top: 2%;
      @media (max-width: 1000px) {
        padding-top: 0%; 
      } 
      
        .text{
          @include center();
          width: 100%;
          font-size: 40px;
          @media (max-width: 1000px) {
              font-size: 20px;
          }
        }
      
    }
  }

}
</style>
