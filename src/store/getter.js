const getters = {
    currentOption: state => state.system.currentOption,
    cameraNum: state => state.system.cameraNum,
    cameraStatus: state => state.system.deviceStatus,
    drawerSwitch: state => state.options.drawerSwitch,
    filteredProcesses: state => state.options.filteredProcesses,
    worker: state => state.system.worker
}
export default getters