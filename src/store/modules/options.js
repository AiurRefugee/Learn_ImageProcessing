const options = {
    state: {
        drawerSwitch: false
       
    },
    mutations: {
        TOGGLE_DRAWSWITCH: (state) => {
            state.drawerSwitch = !state.drawerSwitch
        },
        // UPDATE_DEVICECAMERA: (state, param) => {
        //     state.cameraNum = param
        // },
        // UPDATE_DEVICESTATUS: (state, param) => {
        //     state.deviceStatus = param
        // }
    },
    actions: {
        toggle_currentOption({ commit }) {
            commit("TOGGLE_DRAWSWITCH")
        },
        // set_cameraNum({ commit }, param) {
        //     commit('UPDATE_DEVICECAMERA', param)
        // },
        // set_deviceStatus({ commit }, param) {
        //     commit('UPDATE_DEVICESTATUS', param)
        // }

    }
}
export default options