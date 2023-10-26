import { configs  } from "@/opencv/configs.js"
const options = {
    state: {
        drawerSwitch: true,
        processConfigs: configs.map((item, index) => ({
            ...item,
            index
        })), 
       
    },
    mutations: {
        TOGGLE_DRAWSWITCH: (state) => {
            state.drawerSwitch = !state.drawerSwitch
        },
        UPDATE_TOTALCONFIGS: (state, param) => {
            state.processConfigs = [...param]
        },
        UPDATE_CONFIG_PROCESS: (state, param) => {
            let [processIndex, key, value] = [...param]
            state.processConfigs[processIndex][key] = value
        },
        UPDATE_PROCESSPARAMS: (state, param) => {
            let [processIndex, paramIndex, value] = [...param] 
            state.processConfigs[processIndex].params[paramIndex] = value
        },
        RESORT_CONFIG: (state, param) => {
            let [oldIndex, newIndex] = [...param]
            let item = state.processConfigs.splice(oldIndex, 1)[0]  
            state.processConfigs.splice(newIndex, 0, item)
            console.log(state.processConfigs.map(item => item.title))
        }


        // UPDATE_DEVICESTATUS: (state, param) => {
        //     state.deviceStatus = param
        // }
    },
    actions: {
        toggle_currentOption({ commit }) {
            commit("TOGGLE_DRAWSWITCH")
        },
        set_totalConfigs({ commit }, param) {
            commit('processConfigs', param)
        },
        resort_Config({commit}, param) {
            commit('RESORT_CONFIG', param)
        }

    }
}
export default options