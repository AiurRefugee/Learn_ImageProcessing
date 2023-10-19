// eventBus.js
export default class EventBus{
    constructor(){
        this.events = {};
    }
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName](data)
        }
    }
    on(eventName, fn) {
        this.events[eventName] = fn;
    }

    off(eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    }
}
 