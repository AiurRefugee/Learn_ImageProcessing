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

/*  
  title
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
  title: "2D Convolution ( Image Filtering )",
  primaryClass: '图像增强',
  secondrayClass: '降噪',
  selected: false,
  imageAvaliable: true,
  params: [{
    paramName: "ddepth",
    paramDesc: "desired depth of the destination image.",
    paramValue: cv.CV_8U ,
    widget: {
      type: "selecter", 
      selectLabels: [
        'cv.CV_8U'
      ],
      selectValues: [
        cv.CV_8U
      ]
    },
    
  },{
    paramName: "kernel",
    paramDesc: "convolution kernel (or rather a correlation kernel), a single-channel floating point matrix; if you want to apply different kernels to different channels, split the image into separate color planes using split and process them individually.",
    paramValue: 3,
    widget: {
      type: "slider", 
      min: 3,
      max: 15,
      step: 2
    }
  },{
    paramName: "borderType",
    paramDesc: "pixel extrapolation method.",
    paramValue: 0, 
    widget: {
      type: "slider", 
      min: -126,
      max: 125
    }
  }, {
    paramName: "delta",
    paramDesc: "optional value added to the filtered pixels before storing them in dst.",
    paramValue: cv.BORDER_DEFAULT, 
    widget: {
      type: "selecter", 
      selectLabels: [
        'cv.BORDER_CONSTANT ', 'cv.BORDER_REPLICATE', 'cv.BORDER_REFLECT', 'cv.BORDER_WRAP', 'cv.BORDER_REFLECT_101',
        'cv.BORDER_TRANSPARENT', 'cv.BORDER_REFLECT101', 'cv.BORDER_DEFAULT', 'cv.BORDER_ISOLATED'
      ],
      selectValues: [
        cv.BORDER_CONSTANT , cv.BORDER_REPLICATE, cv.BORDER_REFLECT, cv.BORDER_WRAP, cv.BORDER_REFLECT_101,
        cv.BORDER_TRANSPARENT, cv.BORDER_REFLECT101, cv.BORDER_DEFAULT, cv.BORDER_ISOLATED
      ]
    }
  }],
  f: (title, src, dst, params) => {
    try {
      // console.log(`${title} params:`,src, dst, ...params)
      let [depth, kernel, delta, borderType] = [...params]
      let M = cv.Mat.eye(kernel, kernel, cv.CV_32FC1)
      let anchor = new cv.Point(-1, -1)
      cv.filter2D(src, dst, depth, M, anchor, delta, borderType);
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      // console.log(`${title}: `+ error)
    }
  }
},
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
  f: (title, src, dst, params) => {
    let [ thresh, maxval, type] = [...params] 
      if(maxval < thresh) {
        ElMessage.error('maxval can not be less than thresh.')
      }
      try {
        // console.log(`${title} params:`,src, dst, ...params)
        cv.threshold(src, dst, thresh, maxval, type)
      } catch(error) {
        ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
        // console.log(`${title}: `+ error)
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
  f: (title, src, dst, params) => { 
    // console.log(`${title} params:`,src, dst, ...params) 
    try {
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      cv.adaptiveThreshold(dst, dst, ...params);
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
     //  console.log(`${title}: `+ error)
    }
  }
}, 
{
  title: "Canny Edge Detection",
  primaryClass: "图像分割",
  secondrayClass: "边界分割",
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 'threshold1',
      paramDesc: 'first threshold for the hysteresis procedure.',
      paramValue: 50,
      widget: {
        type: 'slider',
        min: 0,
        max: 255
      }
    }, {
      paramName: 'threshold2',
      paramDesc: 'second threshold for the hysteresis procedure...',
      paramValue: 100,
      widget: {
        type: 'slider',
        min: 0,
        max: 255
      }
    }, {
      paramName: 'apertureSize',
      paramDesc: 'aperture size for the Sobel operator.',
      paramValue: 3,
      widget: {
        type: 'slider',
        min: 3,
        max: 7,
        step: 2
      }
    }, {
      paramName: 'L2gradient',
      paramDesc: 'specifies the equation for finding gradient magnitude. If it is True, it uses the equation mentioned above which is more accurate, otherwise it uses this function: Edge_Gradient(G)=|Gx|+|Gy|.',
      paramValue: false,
      widget: {
        type: 'switch'
      }
    } 
  ],
  f: (title, src, dst, params) => {
    try {
      // console.log(`${title} params:`,src, dst, ...params)
      // cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
      cv.Canny(src, dst, ...params); 
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      // console.log(`${title}: ` + error)
    } 
  }
}]

