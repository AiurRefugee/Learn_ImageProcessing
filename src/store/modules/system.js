const system = {
    state: {
        currentOption: 'camera',
        facingMode: true // true "user"：指定使用前置摄像头，通常用于视频通话或自拍场景。 false  "environment"：指定使用后置摄像头，通常用于拍摄环境照片或视频。

       
    },
    mutations: {
        UPDATE_CURRENTOPTION: (state, param) => {
            state.currentOption = param
        },
        UPDATE_FACINGMODE: (state) => {
            state.facingMode = !state.facingMode
        }
    },
    actions: {
        set_currentOption({ commit }, param) {
            commit("UPDATE_CURRENTOPTION", param)
        },
        set_facingMode({ commit }) {
            commit('UPDATE_FACINGMODE')
        }
    }
}
export default system