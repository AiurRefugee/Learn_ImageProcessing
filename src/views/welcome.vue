<script setup>
import { onMounted, ref, watch, nextTick} from 'vue'
import { useRouter } from 'vue-router';
import { StyleProvider, Themes } from '@varlet/ui'
import { useStore } from 'vuex'; 

import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark) 

const store = useStore()
const iconsize = ref('200')
const topTextSize = ref('20')
const pos = ref('left')
const topbarIconSize = ref(40)
const showOpenCV = ref(false)
const showVue = ref(false)
const showVarletUI = ref(false)
const currentTheme = ref(null)
const status = ref(-1)
const iconWidth = ref(5)

const router = useRouter()


function changeTheme() {
  currentTheme.value = currentTheme.value ? null : Themes.dark
  StyleProvider(currentTheme.value)
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
  setTimeout(() => {
    toggleDark()
  }, 3000);
  localStorage['vueuse-color-scheme'] = 'dark'
  store.dispatch('systemInit')
})
</script>

<template>

  <div class="appContainer">
    <div class="three" ref="canvasdom"></div>
    <!-- <var-popup v-model:show="showOpenCV" :position="pos" >
      <var-cell :border="true">
        <var-image src="src/assets/preview/textures/m1.png"></var-image>
      </var-cell>
      <var-cell></var-cell>
    </var-popup>
    <var-popup v-model:show="showVue" :position="pos" >
      <var-cell :border="true">
        <var-image src="src/assets/imgs/vue.png"></var-image>
      </var-cell>
      <var-cell>Vue 是一个框架，也是一个生态。其功能覆盖了大部分前端开发常见的需求。但 Web 世界是十分多样化的，不同的开发者在 Web 上构建的东西可能在形式和规模上会有很大的不同。考虑到这一点，Vue 的设计非常注重灵活性和“可以被逐步集成”这个特点。</var-cell>
    </var-popup>
    <var-popup v-model:show="showVarletUI" :position="pos" >
      <var-cell :border="true">
        <var-image src="src/assets/imgs/varlet.png"></var-image>
      </var-cell>
      <var-cell>Varlet 是一个基于 Vue3 开发的 Material 风格移动端组件库，全面拥抱 Vue3 生态，由社区团队维护。支持 Typescript、按需引入、暗黑模式、主题定制、国际化，并提供 VSCode 插件保障良好的开发体验。</var-cell>
    </var-popup> -->
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
            <el-link   underline="hover" @click="showVarletUI = !showVarletUI">Varlet UI</el-link>
          </el-col>
          <el-col :span="3" class="topItem" @click="toggleDark">
            <el-icon size="40"><Sunny /></el-icon>
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
          <el-icon size="200"><PictureFilled /></el-icon>
          <div class="text">
            <el-text size="large">
              <h1>从图片输入</h1>
            </el-text>
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('video')">
          <el-icon size="200"><VideoPlay /></el-icon>
          <div class="text">
            <el-text size="large">
              <h1>从视频输入</h1>
            </el-text>
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('camera')">
          <el-icon size="200"><CameraFilled /></el-icon>
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
div{
  //border: 2px solid black;
  // margin: 5px;
  
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
  :deep(.var-popup__content){
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
        font-size: 30px;
        width: 95vw;
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
    flex-grow: 1;
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
