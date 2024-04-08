import { ElMessage } from "element-plus"
import { changeTheme } from '@/utils/theme.js'

const system = {
    state: {
      currentOption: '',
      cameraNum: 0,
      deviceStatus: 'Normal',
      worker: null,
      theme: false, //false light true dark
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
        },
        SET_WEBWORKER: (state) => {
          console.log('new Worker')
          state.worker = new Worker('/opencv/worker.js')
          // let test = new Worker('/src/opencv/testWorker.js')
        },
        CHANGE_THEME: (state, param) => {
          console.log('param', param)
          state.theme = param
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
        },
        systemInit({ commit }) {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                // 获取设备信息
                navigator.mediaDevices.enumerateDevices()
                  .then(devices => {
                    // 计数摄像头设备数量
                    let cameraCount = 0;
                    devices.forEach(device => {
                      if (device.kind === 'videoinput') {
                        cameraCount++;
                      }
                    });
                    if(cameraCount == 0) {
                      commit('UPDATE_DEVICESTATUS', 'No Camera Avaliable')
                      ElMessage.error('No Camera Avaliable')
                      console.error('No Camera Avaliable')
                    }
                    console.log(`设备上的摄像头数量：${cameraCount}`);
                    commit('UPDATE_DEVICECAMERA', cameraCount) 
                  })
                  .catch(error => {
                    console.error('获取设备信息失败：', error);
                    // ElMessage({
                    //     message: error,
                    //     grouping: true,
                    //     type: 'error',
                    // })
                    commit('UPDATE_DEVICESTATUS', 'Failed to access device information')
                    console.error('Failed to access device information')
                    // ElMessage.error('Failed to access device information')
                  });
              } else {
                console.error('浏览器不支持mediaDevices API');
                commit('UPDATE_DEVICESTATUS', 'Browser does not support mediaDevices API')
                // ElMessage.error('Browser does not support mediaDevices API')
              }
        },
        initWorker({ commit }) {
          commit('SET_WEBWORKER')
        },
        change_Theme({ commit }, param) {
          commit('CHANGE_THEME', param)
          changeTheme(param)
        }

    }
}
export default system