import Vuex from 'vuex';
import system from './modules/system';
import getters from './getter';
const store = new Vuex.Store({
    modules: {
        system
    },
    getters
})
export default store