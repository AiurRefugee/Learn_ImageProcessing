<script setup>
import { onMounted, ref, watch, nextTick} from 'vue'
import { useRouter } from 'vue-router';
import { StyleProvider, Themes } from '@varlet/ui'
import { useStore } from 'vuex';
const store = useStore()
const iconsize = ref('200')
const topTextSize = ref('20')
const pos = ref('left')
const topbarIconSize = ref(40)
const showOpenCV = ref(false)
const showVue = ref(false)
const showVarletUI = ref(false)
const currentTheme = ref(null)
const router = useRouter()

function changeTheme() {
  currentTheme.value = currentTheme.value ? null : Themes.dark
  StyleProvider(currentTheme.value)
}
function navigateTo(option) {
  store.dispatch('set_currentOption', option)
  router.push({
    path: `/imageProcessing/${option}`
  })
}
</script>

<template>

  <div class="appContainer">
    <div class="three" ref="canvasdom"></div>
    <var-popup v-model:show="showOpenCV" :position="pos" >
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
    </var-popup>
    <div class="topBar">
      <div class="title">Learn ImageProcessing</div>
      <div class="topbarIcons">
        <var-row style="width:100%" align="center" justify="flex-end" :gutter="20">
          <var-col :span="1" justify="center">
            <var-link :text-size="topTextSize" underline="hover" @click="showOpenCV = !showOpenCV">OpenCV</var-link>
          </var-col> 
          <var-col :span="1" justify="center">
            <var-link :text-size="topTextSize" underline="hover" @click="showVue = !showThree">Vue</var-link>
          </var-col>
          <var-col :span="1" justify="center">
            <var-link :text-size="topTextSize" underline="hover" @click="showVarletUI = !showVarletUI">Varlet UI</var-link>
          </var-col>
          <var-col :span="1" justify="center">
            <var-icon :name="`${!currentTheme ? 'white-balance-sunny' : 'weather-night'}`" @click="changeTheme" :size="topbarIconSize" :transition="400"/>
          </var-col>
          <var-col :span="1" justify="center">
            <var-icon name="github" :size="topbarIconSize"/>
          </var-col>
        </var-row>
      </div>
      <!-- <var-divider /> -->
    </div>
    
    <div class="main">
      
      <div class="showArea">
        <var-row class="inputIcons" justify="center" align="center">
          <var-col :span="6" justify="justify" direction="column" @click="navigateTo('image')">
              <var-icon name="image" :size="iconsize"></var-icon>
              <div class="text">从图片输入</div>
          </var-col>
          <var-col :span="6" justify="justify" direction="column" @click="navigateTo('video')">
              <var-icon name="play-circle" :size="iconsize"></var-icon>
              <div class="text">从视频输入</div>
          </var-col>
          <var-col :span="6" justify="justify" direction="column" @click="navigateTo('camera')">
              <var-icon name="radio-marked" :size="iconsize"></var-icon>
              <div class="text">从摄像头输入</div>
          </var-col>
        </var-row>
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
:deep(.var-box){
  align-content: center;
}

:deep(.var-swipe){
  overflow: hidden;
  user-select: none;
  width: 100%;
  height: 100%;
}
:deep(.var-swipe__indicators){
  margin-bottom: 2%;
}
:deep(.var-cell){
  width: 100%;
  font-size: 20px;
}
:deep(.var-col){
  justify-content: center;
}
:deep(.var-cell__content){
  @include center();
  justify-content: space-around;
  width: 100%;
  height: 100%;
}
:deep(.var-swipe__indicators){
  bottom: 0;
}
:deep(.var-popup__content){
  max-width: 50vw;
  max-height: 60vh;
}
.appContainer{
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  position: relative;
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
       min-width: 45%;
       padding-right: 2%;
      @include center();
      max-height: 100px; 
      @media (max-width: 1000px) {
        font-size: 20px;
        width: 100%;
      }
    }
    :deep(.var-icon){
      margin: 1%;
      cursor: pointer;
    }
  }
  .main{
    display: flex;
    width: 99vw;
    flex-grow: 1;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .showArea{
      width: 95%;
      height: 70%;
      display: flex;
      justify-content: flex-start;
      // padding-top: 2%;
      @media (max-width: 1000px) {
        padding-top: 0%;
      }
      align-items: space-between;
      flex-direction: column;

      :deep(.var-col){
        justify-content: center;
      }
      .inputIcons{
        width: 100%;
        @include center();
        cursor: pointer;
        justify-content: space-around;
        .text{
          @include center();
          font-size: 40px;
          @media (max-width: 1000px) {
              font-size: 14px;
          }
        }
      }
    }
  }

}
</style>
