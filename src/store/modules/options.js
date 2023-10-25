import { configs  } from "@/opencv/configs.js"
const options = {
    state: {
        drawerSwitch: true,
        processConfigs: [...configs]
       
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
        }
        // set_deviceStatus({ commit }, param) {
        //     commit('UPDATE_DEVICESTATUS', param)
        // }

    }
}
export default options