<script setup>
import { onMounted, onActivated, ref, watch, nextTick, computed} from 'vue'
import { useRouter } from 'vue-router'; 
import { useStore } from 'vuex'; 
import { Sunny, Moon } from '@element-plus/icons-vue'
const curOpt = computed( () => store.getters.currentOption ) 

// import { useDark, useToggle } from '@vueuse/core' 

// const isDark = useDark()
// const toggleDark = useToggle(isDark) 

const store = useStore()
// const dark = ref(window.localStorage['vueuse-color-scheme'] == 'auto')
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
const theme = computed( 
  {
    get() {
      // console.log(store.getters.theme)
      return store.getters.theme
    }, 
    set(val) {
      console.log('val', val)
      store.dispatch('change_Theme', val)
    }
  }
)

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

// function changeTheme(val) {
//   console.log(val)
//   store.dispatch('change_Theme', val)
// }

function navigateTo(option) {
  store.dispatch('set_currentOption', option)
  if(option != "camera") {
      router.push({
        path: `/imageProcessing/${option}`
      })
  } else { 
    console.log(status.value)
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
  store.dispatch('systemInit') 
  store.dispatch('set_currentOption', 'none')
  console.log('welcome', curOpt.value)
  // console.log(dark.value) 
})

onActivated( () => {
    console.log('onActivated') 
    // console.log(dark.value)
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
        <h1>Learn ImageProcessing</h1>
      </div>
      <div class="topbarIcons">  
            <el-link :underline="false" @click="openDialog('OpenCV')">OpenCV</el-link>  
            <el-link :underline="false" @click="openDialog('Vue')">Vue</el-link>  
            <el-link :underline="false" @click="openDialog('Element +')">Element+</el-link> 
            <el-switch v-model="theme" :active-action-icon="Moon" :inactive-action-icon="Sunny" /> 
            
      </div>
      <!-- <var-divider /> -->
    </div>
    
    <div class="main">
       
        <div class="centerItem" @click="navigateTo('image')">
          <div class="centerIcon">
            <PictureFilled />
          </div>
          <div class="text">
            <div>Image</div> 
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('video')">
          <div class="centerIcon">
            <VideoPlay />
          </div>
          <div class="text">
            <div>Video</div> 
          </div>
        </div>
        <div class="centerItem" @click="navigateTo('camera')">
          <div class="centerIcon">
            <CameraFilled/>
          </div>
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
h1 {
  word-break: break-all;
  font-size: 60px;
  @media(max-width: 800px) {
    font-size: 30px;
  }
  @media(max-width: 400px) {
    font-size: 25px;
  }
}
.appContainer{
  display: flex;
  flex-direction: column;
  width: 100dvw;
  height: 100dvh;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .popup-example-block {
    padding: 20px 24px;
    width: 250px;
    height: 100dvh;
  }
  .topBar{
    width: 95%; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media(orientation: portrait) {
      flex-direction: column;
      max-height: 15%;
    }
    .title{ 
      min-height: 8dvh;
      font-size: 50px;
      padding-right: 1%;
      font-style: italic;
      letter-spacing: 3px;
      color: var(--el-text-color-primary);
      
      @include center();
      align-items: flex-start;
        padding-left: 2%;
        justify-content: flex-start;
        font-weight: 900;
        font-family: math;
      
      @media(orientation: portrait) {
        font-size: 20px;
        width: 95dvw; 
      }  
      
    }
    .topbarIcons{ 
       display: grid;
       grid-gap: 5%;
       grid-template-columns: 2fr 2fr 3fr 1fr;
       grid-template-rows: 100%; 
       padding-right: 2%;
        a {
          font-size: 20px;
          // font-family: monospace;
          font-weight: 600;
        } 
      @media(orientation: portrait) {
        font-size: 20px;
        width: 80%;
        align-self: flex-end;
        flex-direction: column;
      }
    } 
  }
  .main{
    display: flex;
    // background-color: blue;
    width: 100dvw;
    flex-grow: 1; 
    justify-content: center;
    padding-top: 5%;
    overflow: auto;
    align-items: flex-start;
    @media(orientation: portrait) {
      flex-direction: column;  
      justify-content: space-around;
      align-items: center; 
      padding: 2% 0;
    }
    @media(max-width: 1000px) and (orientation: landscape) {
      padding-top: 12%;
    }
    .centerItem {
      @include center();
      width: 33%;  
      font-size: 20px;
      flex-direction: column;
      justify-content: center; 
      flex-grow: 1;
      transition: all 0.5s ease;
      color: var(--el-text-color-primary);
      @media(orientation: portrait) {
        width: 60dvw;
        max-height: 30%;
      }
      .centerIcon { 
        width: 14dvw;
        aspect-ratio: 1/1; 
        @media(orientation: portrait) {  
          width: 23dvw;
          // max-width: 30dvw;  
        }
      }
      .text{
        @include center();
        width: 100%;
        height: 50px;
        font-size: 35px;
        @media(orientation: portrait) {
            font-size: 20px;
            align-items: center;
            word-spacing: 5px;
        }
        @media(max-width: 1000px) {
          font-size: 25px;
        }
      }
    }
      
      
    
  }

}
</style>
