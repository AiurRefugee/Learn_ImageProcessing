<script setup>
import { onMounted, onActivated, ref, watch, nextTick, computed} from 'vue'
import { useRouter } from 'vue-router'; 
import { useStore } from 'vuex'; 
import { Sunny, Moon } from '@element-plus/icons-vue'

import { useDark, useToggle } from '@vueuse/core' 

const isDark = useDark()
const toggleDark = useToggle(isDark) 

const store = useStore()
const dark = ref(window.localStorage['vueuse-color-scheme'] == 'dark')
const pos = ref('left') 
const showDialog = ref(false) 
const iconWidth = ref(5)
const dialogItem = ref({})

const dialogContent = ref({
  'OpenCV': {
    title: 'OpenCV',
    imgSrc: 'src/assets/imgs/opencv.png',
    content: 'OpenCV (Open Source Computer Vision Library: http://opencv.org) is an open-source library that includes several hundreds of computer vision algorithms. The document describes the so-called OpenCV 2.x API, which is essentially a C++ API, as opposed to the C-based OpenCV 1.x API (C API is deprecated and not tested with "C" compiler since OpenCV 2.4 releases)'
  },
  'Vue': {
    title: 'Vue',
    imgSrc: 'src/assets/imgs/logo.svg',
    content: 'Vue 是一个框架，也是一个生态。其功能覆盖了大部分前端开发常见的需求。但 Web 世界是十分多样化的，不同的开发者在 Web 上构建的东西可能在形式和规模上会有很大的不同。考虑到这一点，Vue 的设计非常注重灵活性和“可以被逐步集成”这个特点。',
  },
  "Element +": {
    title: 'Element +',
    imgSrc: 'src/assets/imgs/element-plus-logo.svg',
    content: '据官方介绍，Element Plus是首个使用 TypeScript + Vue 3.2 开发，提供完整的类型定义文档的Composition API 重构的组件库。由于 Vue 3.0 进行了大版本升级，Element 作为其生态的组件库希望借此机会丢掉历史包袱，所以开发团队对 Element 进行了一次深度重构。换句话说，Element Plus的诞生正是基于Vue3重写了每一行代码。'
  }
})

const router = useRouter()

const status = computed( () => store.getters.cameraStatus)

const iconTextSize = computed( () => {
  if(window.innerWidth <= 1000 ) {
    return 'small'
  } else {
    return 'large'
  }
})
const size = ref('50%')

function openDialog(title) {
  dialogItem.value = dialogContent.value[title]
  showDialog.value = true
}

function changeTheme() {
  toggleDark()
}
function navigateTo(option) {
  store.dispatch('set_currentOption', option)
  if(option != "camera") {
      router.push({
        path: `/imageProcessing/${option}`
      })
  } else { 
     if(status.value == 'Normal') {
      router.push({
        path: `/imageProcessing/${option}`
      })
     } else {
      router.push({
        path: `/noCamera/${status.value}`
      })
     }
  }
}

onMounted(() => {   
  console.log('onMounted') 
  console.log(dark.value) 
})

onActivated( () => {
    console.log('onActivated') 
    console.log(dark.value)
})

</script>

<template>

  <div class="appContainer"> 
    <el-drawer v-model="showDialog" :direction="'ltr'" :size="size" :title="dialogItem.title" :show-close="false">
      <div class="drawerImage">
        <img :src="dialogItem.imgSrc"/>
      </div>
       
      <div class="drawerText">
        <p>{{ dialogItem.content }}</p>
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
            <el-link :underline="false" @click="openDialog('OpenCV')">OpenCV</el-link>
          </el-col> 
          <el-col :span="iconWidth" class="topItem">
            <el-link :underline="false" @click="openDialog('Vue')">Vue</el-link>
          </el-col>
          <el-col :span="iconWidth + 2" class="topItem">
            <el-link :underline="false" @click="openDialog('Element +')">Element +</el-link>
          </el-col>
          <el-col :span="iconWidth" class="topItem">
            <el-switch v-model="dark" :active-action-icon="Moon" :inactive-action-icon="Sunny" @change="changeTheme">
            </el-switch>
            <!-- <el-icon size="40" @click="changeTheme()"><Sunny /></el-icon> -->
          </el-col>
           
        </el-row>
      </div>
      <!-- <var-divider /> -->
    </div>
    
    <div class="main">
       
        <div class="centerItem" @click="navigateTo('image')">
          <PictureFilled class="centerIcon"/>
          <div class="text">
            <div>Image</div> 
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('video')">
          <VideoPlay class="centerIcon"/>
          <div class="text">
            <div>Video</div> 
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('camera')">
          <CameraFilled class="centerIcon"/>
          <div class="text">
            <div>Camera</div> 
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
// :deep(.el-drawer) {
//   width: 70%;
// }

.drawerImage {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    object-fit: fill;
    width: 60%;
    max-height: 100%;
  }
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

.appContainer{
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .popup-example-block {
    padding: 20px 24px;
    width: 250px;
    height: 100vh;
  }
  .topBar{
    width: 95%; 
    display: flex;
    justify-content: space-between;
    align-items: center;
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
      h1 {
        font-size: 50px;
      }
      @media (max-width: 1000px) {
        font-size: 20px;
        width: 95vw;
        h1 {
          font-size: 7.5vw;
        }
      }
      
    }
    .topbarIcons{
       min-width: 40%;
       //padding-right: 2%;
      @include center(); 
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
    // background-color: blue;
    width: 100vw;
    flex-grow: 1; 
    justify-content: center;
    padding-top: 5%;
    align-items: flex-start;
    @media(max-width: 1000px) {
      flex-direction: column;  
      justify-content: flex-start;
      align-items: center;
      padding-top: 0;
    }
    .centerItem {
      @include center();
      width: 33%; 
      height: 50%;
      font-size: 20px;
      flex-direction: column;
      flex-grow: 1;
      transition: all 0.5s ease;
      @media (max-width: 1000px) {
        width: 90%;
        max-height: 30%;
      }
      .centerIcon {
        width: 50%;
        @media (max-width: 1000px) {
          width: 30%;
          
        }
      }
      .text{
        @include center();
        width: 100%;
        height: 50px;
        font-size: 40px;
        @media (max-width: 1000px) {
            font-size: 2vh;
            align-items: center;
        }
      }
    }
      
      
    
  }

}
</style>
