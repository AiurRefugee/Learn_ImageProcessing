<script setup>
import { onMounted, ref, computed, nextTick} from 'vue' 
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore()
const router = useRouter()
const refresh = ref(null) 
const direction = ref("ltr")

 const drawerSwitch = computed( () => store.getters.drawerSwitch )
 
 const value = ref(['1'])

function changeHandle(val) {
  console.log(val)
}
 onMounted( () => {
    console.log(drawerSwitch.value)
 })
</script>
<template> 
     <transition name="drawer">
        <div class="drawer" v-if="drawerSwitch" >
            <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Consistency" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Controllability" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceling, aborting or terminating current
          operation.
        </div>
      </el-collapse-item>
    </el-collapse>
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
.drawer {
    width: 30vw;
    height: 90vh;
    //display: flex;
    border-radius: 20px;
    box-shadow: inset 2px 2px 10px gray;
    //background-color: transparent;
    background-color: rgba($color: white, $alpha: 0.8);
    backdrop-filter: blur(10px);
    position: absolute;
    left: 0;
    z-index: 999;
    margin-left: 1%;
    padding: 1%
}
</style>