const getters = {
    currentOption: state => state.system.currentOption,
    cameraNum: state => state.system.cameraNum,
    cameraStatus: state => state.system.deviceStatus,
    drawerSwitch: state => state.options.drawerSwitch,
    processConfigs: state => state.options.processConfigs,
    worker: state => state.system.worker,
    theme: state => state.system.theme
}
export default getters