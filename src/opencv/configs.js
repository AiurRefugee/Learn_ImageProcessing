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

/*  title
  primaryClass
  secondrayClass
  selected
  imageAvaliable
  params
  -- paramName
  -- paramDesc
  -- paramValue
  -- widget
      -- type "slider" min 0 max 255 step 1
      -- type "selecter" selectLabels [...] selectValues [...]
      -- type "input" ''
      -- type "switch" ''
  f 
*/
export  const configs =  [
{
  title: "Fixed Threshold",
  primaryClass: '图像分割',
  secondrayClass: '阈值分割',
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
      selectLabels: [
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
        console.log('Fixed Threshold params', thresh, maxval, type)
        cv.threshold(src, dst, thresh, maxval, type)
      } catch(error) {
        ElMessage.error(`${error}.`)
        console.log(error)
      }
  }
}, 
{
  title: "Adaptive Thresholding",
  primaryClass: "图像分割",
  secondrayClass: "阈值分割",
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 'maxValue',
      paramDesc: 'non-zero value assigned to the pixels for which the condition is satisfied',
      paramValue: 200,
      widget: {
        type: 'slider',
        min: 0,
        max: 255
      }
    }, {
      paramName: 'adaptiveMethod',
      paramDesc: 'adaptive thresholding algorithm to use.',
      paramValue: cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      widget: {
        type: 'selecter',
        selectLabels: [
          'cv.ADAPTIVE_THRESH_MEAN_C',
          'cv.ADAPTIVE_THRESH_GAUSSIAN_C'
        ],
        selectValues: [
          cv.ADAPTIVE_THRESH_MEAN_C,
          cv.ADAPTIVE_THRESH_GAUSSIAN_C
        ]
      }
      
    }, {
      paramName: 'thresholdType',
      paramDesc: 'thresholding type that must be either cv.THRESH_BINARY or cv.THRESH_BINARY_INV.',
      paramValue: cv.THRESH_BINARY,
      widget: {
        type: 'selecter',
        selectLabels: [
          'cv.THRESH_BINARY',
          'cv.THRESH_BINARY_INV'
        ],
        selectValues: [
          cv.THRESH_BINARY,
          cv.THRESH_BINARY_INV
        ]
      }
    }, {
      paramName: 'blockSize',
      paramDesc: 'size of a pixel neighborhood that is used to calculate a threshold value for the pixel: 3, 5, 7, and so on.',
      paramValue: 3,
      widget: {
        type: 'slider',
        min: 3,
        max: 15,
        step: 2
      }
    }, {
      paramName: 'C',
      paramDesc: '	constant subtracted from the mean or weighted mean (see the details below). Normally, it is positive but may be zero or negative as well.',
      paramValue: 2,
      widget: {
        type: 'slider',
        min: -10,
        max: 10, 
      }
    }
  ],
  f: (src, dst, params) => { 
    console.log(`Adaptive Thresholding params:`,src, dst, ...params)
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.adaptiveThreshold(src, dst, ...params);
    try {
      
    } catch(error) {
      ElMessage.error(`${error}`)
      console.log(error)
    }
  }
}]

