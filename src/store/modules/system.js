const system = {
    state: {
        currentOption: null
    },
    mutations: {
        UPDATE_CURRENTOPTION: (state, param) => {
            state.currentOption = param
        }
    },
    actions: {
        set_currentOption({ commit }, param) {
            commit("UPDATE_CURRENTOPTION", param)
        }
    }
}
export default system