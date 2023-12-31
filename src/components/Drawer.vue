<script setup>
import {
  onMounted,
  ref,
  computed,
  onActivated,
  onUnmounted,
  nextTick,
  watch,
  inject,
} from "vue";
import { useStore } from "vuex";
import { vDraggable} from 'vue-draggable-plus'
import { classification } from "@/opencv/configs.js";
import InfoDialog from "@/components/InfoDialog.vue";
import Sortable from "sortablejs";

const store = useStore();

const sortable = ref(null);

//inject
const $bus = inject("$bus");

//ref
const infoList = ref([]);
const infoVisible = ref(false);
const labelWidth = ref(5);
const filterBarLabel = ref(4);
const dragIndex = ref(-1);

const contentWidth = ref(24 - labelWidth.value);
const selectedProcessions = ref([]);

const maxCollapseNum = ref(2);
const classNames = ref(classification);
const drawerSwitch = computed(() => store.getters.drawerSwitch);
const curOpt = computed(() => store.getters.currentOption);

const processConfigs = computed(() => store.getters.processConfigs);

function openDialog(list) {
  infoList.value = list;
  infoVisible.value = true;
}

function output() {
  if (curOpt.value == "image") {
    $bus.emit("outputImage");
  }
}

function close() {
  console.log("close");
  infoVisible.value = false;
}

function toggle() {
  store.dispatch("toggle_currentOption");
}

function calVis(process) { 
  if(curOpt.value == 'image') {
    return process.imageAvailable != false
  } else {
    return process.videoAvailable != false
  }
}

async function reSize() {
  console.log("resize");
  maxCollapseNum.value = window.innerWidth >= 600 ? 3 : 2;
  // if(curOpt.value == 'video') {
  //     playing.value = false
  //    await init()

  // }
} 
onMounted(async () => {
  // store.dispatch("resort_Config", [0, 1]);
  console.log("onMounted");
});

onUnmounted(() => {
  clearInterval();
  // src.delete()
  // dst.delete()
});
</script>
<template>
  <InfoDialog
    :infoVisible="infoVisible"
    :infoList="infoList"
    @close="close"
    v-if="infoVisible"
  ></InfoDialog>
  <transition name="drawer">
    <div class="drawer" v-show="drawerSwitch" ref="el">
      <div class="filterBar">
        <el-row justify="space-between" align="middle">
          <el-col :span="filterBarLabel">
            <h4>筛选：</h4>
          </el-col>
          <el-col :span="24 - filterBarLabel" s>
            <el-select
              v-model="selectedProcessions"
              filterable
              placeholder="请选择条件"
              multiple
              collapse-tags
              :max-collapse-tags="maxCollapseNum"
            >
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
        <el-collapse>
          <div id="col" v-draggable="[
            processConfigs, {
              animation: 150,
              onEnd: output,
              delay: 200,
              direction: 'vertical'
            }
          ]">
             
              <div
                draggable="true"
                v-for="(process, processIndex) in processConfigs"
                :key="processIndex"
                :id="`colItem${processIndex}`"
              > 
                <div
                  style="padding: 5px 0"
                  v-if="
                    (selectedProcessions.length == 0 ||
                      selectedProcessions.indexOf(process.secondrayClass) !=
                        -1) && calVis(process)
                  "
                >
                  <el-collapse-item
                    :name="process.title"
                    :title="process.title"
                  >
                    <el-space :size="10" direction="vertical" fill>
                      <el-row align="middle" justify="start">
                        <el-col :span="5">
                          <text style="width: 50px">{{
                            process.selected ? "On" : "Off"
                          }}</text>
                          <el-switch
                            v-model="process.selected"
                            @change="output(true, process.selected)"
                          ></el-switch>
                        </el-col>

                        <el-col
                          :span="19"
                          style="display: flex; justify-content: flex-end"
                        >
                          <el-link
                            :underline="false"
                            @click="openDialog(process)"
                          >
                            <el-icon><View /></el-icon>Learn More
                          </el-link>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <div class="switchGrid">
                            <div
                              class="switchItem"
                              v-for="(Switch, index) in process.params.filter(
                                (element) => element.widget.type == 'switch'
                              )"
                              :key="index"
                            >
                              {{ Switch.paramName }}
                              <el-switch
                                v-model="Switch.paramValue"
                                @change="output(false, process.selected)"
                              ></el-switch>
                            </div>
                            <!-- <el-row v-for="(Switch, index) in process.params.filter( element => element.widget.type == 'switch')"
                                  justify="start" align="middle" :key="index">
                                  <el-col :span="8">{{ Switch.paramName }}</el-col>
                                  <el-col :span="8">
                                    <el-switch v-model="Switch.paramValue" @change="output(false, processIndex)"></el-switch>
                                  </el-col> 
                                </el-row>-->
                          </div>
                        </el-col>
                      </el-row>
                      <el-row
                        v-for="(slider, index) in process.params.filter(
                          (element) => element.widget.type == 'slider'
                        )"
                        justify="center"
                        :key="index"
                      >
                        <el-col :span="labelWidth">
                          {{ slider.paramName }}</el-col
                        >
                        <el-col :span="contentWidth">
                          <el-slider
                            v-model="slider.paramValue"
                            show-input
                            show-stop="true"
                            input-size="small"
                            :step="slider.widget.step"
                            :min="slider.widget.min"
                            :max="slider.widget.max"
                            @change="output(false, process.selected)"
                          >
                          </el-slider>
                        </el-col>
                      </el-row>
                      <el-row
                        v-for="(selecter, index) in process.params.filter(
                          (element) => element.widget.type == 'selecter'
                        )"
                        justify="center"
                        :key="index"
                      >
                        <el-col :span="labelWidth">
                          {{ selecter.paramName }}</el-col
                        >
                        <el-col :span="contentWidth">
                          <el-select
                            v-model="selecter.paramValue"
                            placeholder=""
                            size="small"
                            @change="output(false, process.selected)"
                          >
                            <el-option
                              :label="option"
                              :value="option"
                              v-for="(option, index) in selecter.widget
                                .selectList"
                              :key="index"
                            ></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-space>
                  </el-collapse-item>
                </div> 
              </div> 
          </div>
        </el-collapse>
      </div>
      <div class="space" @click="toggle"></div>
    </div>
  </transition>
  <div class="mask" v-if="drawerSwitch" @click="toggle"></div>
</template>
<style lang="scss" scoped>
$button_Color: #ffb444;
/* 隐藏滚动条及滚动轨道 */
div::-webkit-scrollbar {
  width: 0; /* 隐藏垂直滚动条 */
  height: 0; /* 隐藏水平滚动条 */
}

/* 隐藏滚动条的滑块 */
div::-webkit-scrollbar-thumb {
  width: 0;
  height: 0;
}

/* 隐藏滚动条的滑轨 */
div::-webkit-scrollbar-track {
  width: 0;
  height: 0;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.5s ease;
}
.el-slider {
  width: calc(100% - 20px);
  padding-left: 10px;
}
.el-select-dropdown__item {
  width: 100%;
  max-width: 100%;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 1;
  transform: translateY(0);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  @media (orientation: portrait) {
    transform: translateY(-100%);
  }
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateX(-100%);
  backdrop-filter: blur(2px);
  @media (orientation: portrait) {
    transform: translateY(-100%);
  }
}
.primaryClass {
  max-height: 200px;
}
.el-select {
  width: 100%;
}
.el-collapse-item__header {
  color: white;
}

$controlZ: 50;
.mask {
  width: 90vw;
  height: 100vh;
  position: absolute;
  background-color: transparent;
  left: 0;
  top: 0;
  z-index: $controlZ - 2;
  @media (max-width) {
    width: 100vw;
    height: 100vh;
  }
}
.el-col {
  display: flex;
  justify-content: flex-start;
  @media (orientation: portrait) {
    overflow: hidden;
  }
}
.drawer {
  $outSize: 10px;
  // width: calc(40vw - 2*$outSize);
  // height: calc(95vh - 2*$outSize);
  // outline: $outSize solid color-mix(in srgb, var(--el-bg-color) 30%, rgba(128, 128, 128, 0.434) 70%);
  width: 40dvw;
  height: 95dvh;
  border-radius: 15px;
  // box-shadow: -2px 2px 5px 2px color-mix(in srgb, var(--el-bg-color) 50%, rgba(153, 153, 153, 0.545));
  // border: 1px solid white;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  position: absolute;
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease-out;
  justify-content: flex-start;
  align-items: center;
  left: 0;
  z-index: $controlZ - 1;
  // background: radial-gradient(
  //   ellipse farthest-corner at 50% 50%,
  //   color-mix(in srgb, var(--el-bg-color) 10%, rgba(128, 128, 128, 0.131) 90%) 20%,
  //   color-mix(in srgb, var(--el-bg-color) 50%, rgba(128, 128, 128, 0.237) 90%) 50%,
  //   // red 40%,
  //   var(--el-bg-color) 90%);
  background-image: linear-gradient(
    to right,
    color-mix(in srgb, var(--el-bg-color) 90%, rgba(125, 125, 125, 0.675)) 10%,
    color-mix(in srgb, var(--el-bg-color) 10%, rgba(131, 131, 131, 0.205)) 90%
  );

  // background-color: color-mix(in srgb, var(--el-bg-color) 60%, rgba(128, 128, 128, 0.255) 20%);
  margin-left: 4dvw;
  // padding-left: 1%;
  // padding-right: 1%;

  @media (orientation: portrait) {
    width: 100%;
    border-radius: 0;
    margin-left: 0;
    height: 100dvh;
  }
  @media (max-width: 1000px) and (orientation: landscape) {
    width: 50dvw;
  }
  .filterBar {
    width: 90%;
    height: 60px;
    // filter: contrast(1.2);
    color: var(--el-text-color-primary);
  }
  .scrollerWrapper {
    width: 90%;
    max-height: calc(100% - 70px);
    z-index: 95;
    // background: lightblue;
    overflow: scroll;

    @media (orientation: portrait) {
      max-height: calc(100% - 10vh - 60px);
    }
  }
  .scrollerWrapper::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
  }
  .space {
    // background-color: #ffb444;
    width: 100%;
    display: flex;
    flex-grow: 1;
  }
  .switchGrid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    // padding: 0 2%;
    grid-column-gap: 20px;
    align-items: center;
    overflow: auto;
    .switchItem {
      display: flex;
      widows: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>