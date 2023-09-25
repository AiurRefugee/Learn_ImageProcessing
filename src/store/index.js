import Vuex from 'vuex';
import system from './modules/system';
import options from './modules/options';
import getters from './getter';
const store = new Vuex.Store({
    modules: {
        system,
        options
    },
    getters,
})
export default store