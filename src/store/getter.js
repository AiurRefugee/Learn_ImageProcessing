const getters = {
    currentOption: state => state.system.currentOption,
    cameraNum: state => state.system.cameraNum,
    cameraStatus: state => state.system.deviceStatus,
    drawerSwitch: state => state.options.drawerSwitch
}
export default getters