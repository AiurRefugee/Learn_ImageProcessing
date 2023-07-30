import cv from 'opencv.js'

const api = {
    fgbg: new cv.BackgroundSubtractorMOG2(500, 16, true),
    BackgroundSubtract: (src, dst) => {
        fgbg.apply(src, dst)
    },
    ROI: (src, dst, width, height) => {
        let rect = new cv.Rect(x, y, width, height);
        let dist = src.roi(rect);
        return dist
    }
}
 
// ROI
export function ROI(src, x, y, width, height) {
    let rect = new cv.Rect(x, y, width, height);
    let dist = src.roi(rect);
    return dist
}

// 加边框
export function MakeBorder(src, dst, top, bottom, left, right, color) { 
    cv.copyMakeBorder(src, dst, top, bottom, left, right, cv.BORDER_CONSTANT, color);
    // return dist
}

export function InRange(src, dst) { 
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
    // You can try more different parameters
    cv.inRange(src, low, high, dst);
}

// 背景去除
export function BackgroundSubtract(src, dst, fgbg) {
    fgbg.apply(src, dst)
}










