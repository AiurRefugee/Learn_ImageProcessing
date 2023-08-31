const options = {
    state: {
        drawerSwitch: false,
        filteredProcesses: []
       
    },
    mutations: {
        TOGGLE_DRAWSWITCH: (state) => {
            state.drawerSwitch = !state.drawerSwitch
        },
        UPDATE_FILTEREDPROCESSES: (state, param) => {
            state.filteredProcesses = [...param]
        }
        // UPDATE_DEVICESTATUS: (state, param) => {
        //     state.deviceStatus = param
        // }
    },
    actions: {
        toggle_currentOption({ commit }) {
            commit("TOGGLE_DRAWSWITCH")
        },
        set_filteredProcesses({ commit }, param) {
            commit('UPDATE_FILTEREDPROCESSES', param)
        }
        // set_deviceStatus({ commit }, param) {
        //     commit('UPDATE_DEVICESTATUS', param)
        // }

    }
}
export default options