export function sleep(time) {
    return new Promise( (res, rej) => {
        console.log('sleeping')
        setTimeout( () => {
            res()
        }, time)
    })
}