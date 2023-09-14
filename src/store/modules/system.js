import { ElMessage } from "element-plus"

const system = {
    state: {
      currentOption: '',
      cameraNum: 0,
      deviceStatus: 'Normal',
      // worker: null
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
        // SET_WEBWORKER: (state, param) => {
        //   if(!state.worker) {
        //     state.worker = new Worker('/src/opencv/worker.js')
        //     // state.worker.onmessage = function(event) {
        //     //   console.log(event.data);
        //     // };
        //   }
        // }
    },
    actions: {
        set_currentOption({ commit }, param) {
          console.log(param)
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
                    }
                    console.log(`设备上的摄像头数量：${cameraCount}`);
                    commit('UPDATE_DEVICECAMERA', cameraCount) 
                  })
                  .catch(error => {
                    console.error('获取设备信息失败：', error);
                    ElMessage({
                        message: error,
                        grouping: true,
                        type: 'error',
                    })
                    commit('UPDATE_DEVICESTATUS', 'Failed to access device information')
                    ElMessage.error('Failed to access device information')
                  });
              } else {
                console.error('浏览器不支持mediaDevices API');
                commit('UPDATE_DEVICESTATUS', 'Browser does not support mediaDevices API')
                ElMessage.error('Browser does not support mediaDevices API')
              }
        },
        // initWorker({ commit }, param) {
        //   commit('SET_WEBWORKER', param)
        // }

    }
}
export default system