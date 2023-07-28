const system = {
    state: {
        currentOption: 'camera',
        cameraNum: 0,
        deviceStatus: 'Normal'
       
    },
    mutations: {
        UPDATE_CURRENTOPTION: (state, param) => {
            state.currentOption = param
        },
        UPDATE_DEVICECAMERA: (state, param) => {
            state.cameraNum = param
        },
        UPDATE_DEVICESTATUS: (state, param) => {
            state.deviceStatus = param
        }
    },
    actions: {
        set_currentOption({ commit }, param) {
            commit("UPDATE_CURRENTOPTION", param)
        },
        set_cameraNum({ commit }, param) {
            commit('UPDATE_DEVICECAMERA', param)
        },
        set_deviceStatus({ commit }, param) {
            commit('UPDATE_DEVICESTATUS', param)
        }

    }
}
export default system