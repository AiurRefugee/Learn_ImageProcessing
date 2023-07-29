import cv from 'opencv.js'
 

export function ROI(src, x, y, width, height) {
    let rect = new cv.Rect(x, y, width, height);
    let dist = src.roi(rect);
    return dist
}