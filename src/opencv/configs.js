import cv from 'opencv.js'
import { ElMessage } from 'element-plus'
export const classification = [{
  primaryClass: '图像变换',
  secondrayClass: [
    '几何变换', '图像增广', '尺度变换', '频域变换', '颜色空间变换', '形态学变换'
  ]
}, {
  primaryClass: '图像增强',
  secondrayClass: [
    '灰度变换', '降噪', '锐化'
  ]
}, {
  primaryClass: '图像分割',
  secondrayClass: [
    '阈值分割', '边界分割', '区域分割'
  ]
}, {
  primaryClass: '图像识别',
  secondrayClass: [
    '运动物体检测', '背景建模'
  ]
}] 
export  const configs =  [{
    title: "Fixed Threshold",
    primaryClass: 'Image Segment',
    secondrayClass: 'Threshold Segment',
    selected: false,
    imageAvaliable: true,
    params: [{
      paramName: "thresh",
      paramDesc: "threshold value",
      paramValue: 170 ,
      widget: {
        type: "slider",
        min: 0,
        max: 255
      },
      
    },{
      paramName: "maxval",
      paramDesc: "maximum value to use with the cv.THRESH_BINARY and cv.THRESH_BINARY_INV thresholding types",
      paramValue: 200 ,
      widget: {
        type: "slider",
        min: 0,
        max: 255
      }
    },{
      paramName: "type",
      paramDesc: "thresholding type",
      paramValue: cv.THRESH_BINARY, 
      widget: {
        type: "selecter",
        selectLables: [
        'cv.THRESH_BINARY',
        'cv.THRESH_BINARY_INV',
        'cv.THRESH_TRUNC',
        'cv.THRESH_TOZERO',
        'cv.THRESH_OTSU',
        'cv.THRESH_TRIANGLE'
        ],
        selectValues: [
            cv.THRESH_BINARY,
            cv.THRESH_BINARY_INV,
            cv.THRESH_TRUNC,
            cv.THRESH_TOZERO,
            cv.THRESH_OTSU,
            cv.THRESH_TRIANGLE
        ]
      }
    }],
    f: (src, dst, params) => {
      let [ thresh, maxval, type] = [...params] 
        if(maxval < thresh) {
          ElMessage.error('maxval can not be less than thresh.')
        }
        try {
          cv.threshold(src, dst, thresh, maxval, type)
        } catch(error) {
          ElMessage.error(`${error}.`)
        }
    }
}]

