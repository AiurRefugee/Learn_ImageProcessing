import cv from 'opencv.js'
import { ElMessage } from 'element-plus'  
export const classification = [
{
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
    '物体检测', '背景建模'
  ]
}] 

/*  
  title: 'example',
  primaryClass: 'example',
  secondrayClass: 'example',
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 
      paramDesc:
      paramValue:
      widget:{
        type "slider" min 0 max 255 step 1
        type "selecter" selectLabels [...] selectValues [...]
        type "input" ''
        type "switch" ''
      }
      
    }
  ],
  f: (title, src, dst, params) => {
    try {
       
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      console.log(`${title}: `+ error)
      return false
    }
    return false
  } 

  } 
*/
export  const configs =  [
{
  title: 'cvtColorSpace',
  primaryClass: '图像变换',
  secondrayClass: '颜色空间变换',
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 'code',
      paramDesc: 'color space conversion code',
      paramValue: cv.COLOR_RGBA2GRAY,
      widget:{ 
        type: "selecter",
         selectLabels: [
          'cv.COLOR_RGBA2GRAY',
          'cv.COLOR_RGB2RGBA',
          'cv.COLOR_BGRA2BGR',
          'cv.COLOR_RGBA2RGB',
          'cv.COLOR_BGR2RGBA',
         ],
         selectValues: [
          cv.COLOR_RGBA2GRAY,
          cv.COLOR_RGB2RGBA,
          cv.COLOR_BGRA2BGR,
          cv.COLOR_RGBA2RGB,
          cv.COLOR_BGR2RGBA,
         ] 
      }
      
    },
    {
      paramName: 'dstCn',
      paramDesc: 'number of channels in the destination image; if the parameter is 0, the number of the channels is derived automatically from src and code',
      paramValue: 0,
      widget:{
        type: "slider",
        min: 0,
        max: 4,
        step: 1
        
      }
      
    }
  ],
  f: (title, src, dst, params) => {
    try {
      console.log(`${title} params:`,src, dst, ...params)
      let [code, dstCn] = [...params] 
      cv.cvtColor(src, dst, code, dstCn);
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      console.log(`${title}: `+ error)
    }
    return false
  } 
},
{
  title: 'Erosion',
  primaryClass: '图像变换',
  secondrayClass: '形态学变换',
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 'kernelSize',
      paramDesc: 'structuring element used for erosion.',
      paramValue: 5,
      widget:{
        type: "slider",
        min: 3, 
        max: 9,
        step: 1 
      } 
    },
    {
      paramName: 'iterations',
      paramDesc: 'number of times erosion is applied.',
      paramValue: 1,
      widget:{
        type: "slider",
        min: 1, 
        max: 5,
        step: 1 
      } 
    },
    {
      paramName: 'borderType',
      paramDesc: 'pixel extrapolation method.',
      paramValue: 1,
      widget:{
        type: "selecter",
        selectLabels: [
          'cv.BORDER_CONSTANT',
          'cv.BORDER_REPLICATE',
          'cv.BORDER_REFLECT',
          'cv.BORDER_WRAP',
          'cv.BORDER_REFLECT_101'
        ],
        selectValues: [
          cv.BORDER_CONSTANT,
          cv.BORDER_REPLICATE,
          cv.BORDER_REFLECT,
          cv.BORDER_WRAP,
          cv.BORDER_REFLECT_101
        ]
      } 
    }
  ],
  f: (title, src, dst, params) => {
    try {
      let [kernelSize, iterations, borderType] = [...params]
      let M = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      cv.erode(src, dst, M, anchor, iterations, borderType, cv.morphologyDefaultBorderValue());
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      console.log(`${title}: `+ error)
      return false
    }
    return false
  } 
},
{
  title: 'Dilate',
  primaryClass: '图像变换',
  secondrayClass: '形态学变换',
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 'kernelSize',
      paramDesc: 'structuring element used for erosion.',
      paramValue: 5,
      widget:{
        type: "slider",
        min: 3, 
        max: 9,
        step: 1 
      } 
    },
    {
      paramName: 'iterations',
      paramDesc: 'number of times erosion is applied.',
      paramValue: 1,
      widget:{
        type: "slider",
        min: 1, 
        max: 5,
        step: 1 
      } 
    },
    {
      paramName: 'borderType',
      paramDesc: 'pixel extrapolation method.',
      paramValue: 1,
      widget:{
        type: "selecter",
        selectLabels: [
          'cv.BORDER_CONSTANT',
          'cv.BORDER_REPLICATE',
          'cv.BORDER_REFLECT',
          'cv.BORDER_WRAP',
          'cv.BORDER_REFLECT_101'
        ],
        selectValues: [
          cv.BORDER_CONSTANT,
          cv.BORDER_REPLICATE,
          cv.BORDER_REFLECT,
          cv.BORDER_WRAP,
          cv.BORDER_REFLECT_101
        ]
      } 
    }
  ],
  f: (title, src, dst, params) => {
    try {
      let [kernelSize, iterations, borderType] = [...params]
      let M = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      cv.dilate(src, dst, M, anchor, iterations, borderType, cv.morphologyDefaultBorderValue());
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      console.log(`${title}: `+ error)
      return false
    }
    return false
  } 
},
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
        'cv.BORDER_DEFAULT', 'cv.BORDER_CONSTANT ', 'cv.BORDER_REPLICATE', 'cv.BORDER_REFLECT', 'cv.BORDER_WRAP', 'cv.BORDER_REFLECT_101',
        'cv.BORDER_TRANSPARENT', 'cv.BORDER_REFLECT101', 'cv.BORDER_DEFAULT', 'cv.BORDER_ISOLATED'
      ],
      selectValues: [
        cv.BORDER_DEFAULT, cv.BORDER_CONSTANT , cv.BORDER_REPLICATE, cv.BORDER_REFLECT, cv.BORDER_WRAP, cv.BORDER_REFLECT_101,
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
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      // console.log(`${title}: `+ error)
    }
    return false
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
        return false
      }
      try {
        // console.log(`${title} params:`,src, dst, ...params)
        cv.threshold(src, dst, thresh, maxval, type)
        return true
      } catch(error) {
        ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
        // console.log(`${title}: `+ error)
      }
      return false
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
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
     //  console.log(`${title}: `+ error)
    }
    return false
  }
}, 
{
  title: "Canny Edge Detection",
  theory: 'Canny Edge Detection is a popular edge detection algorithm. It was developed by John F. Canny in 1986. It is a multi-stage algorithm and we will go through each stages.',
  steps: [
    {
      label: '1. Noise Reduction',
      desc: 
        `### Since edge detection is susceptible to noise in the image, first step is to remove the noise in the image with a 5x5 Gaussian filter. We have already seen this in previous chapters. `
      },
    {
      label: '2. Finding Intensity Gradient of the Image',
      desc: `Smoothened image is then filtered with a Sobel kernel in both horizontal and vertical direction to get first derivative in horizontal direction ( Gx) and vertical direction ( Gy). From these two images, we can find edge gradient and direction for each pixel as follows:
      \nEdge_Gradient(G)= $\sqrt{G2x+G2y }$
      \nAngle(θ)=tan−1(GyGx)
      \nGradient direction is always perpendicular to edges. It is rounded to one of four angles representing vertical, horizontal and two diagonal directions.`
    },
    {
      label: '3. Non-maximum Suppression',
      desc: `### After getting gradient magnitude and direction, a full scan of image is done to remove any unwanted pixels which may not constitute the edge. For this, at every pixel, pixel is checked if it is a local maximum in its neighborhood in the direction of gradient. Check the image below: 
      \n![这是图片](https://docs.opencv.org/4.8.0/nms.jpg)
      \n### Point A is on the edge ( in vertical direction). Gradient direction is normal to the edge. Point B and C are in gradient directions. So point A is checked with point B and C to see if it forms a local maximum. If so, it is considered for next stage, otherwise, it is suppressed ( put to zero).
      \n### In short, the result you get is a binary image with "thin edges".`
    }
  ],
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
      cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
      cv.Canny(dst, dst, ...params); 
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      // console.log(`${title}: ` + error)
    } 
    return false
  }
}, 
{
  title: 'Rotation Transform',
  primaryClass: '图像变换',
  secondrayClass: '几何变换',
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 'center x',
      paramDesc: 'center x of the rotation in the source image.',
      paramValue: 50,
      widget: {
         type: 'slider',
         min: 0,
         max: 100
      }
      
    }, {
      paramName: 'center y',
      paramDesc: 'center y of the rotation in the source image.',
      paramValue: 50,
      widget: {
        type: 'slider',
        min: 0,
        max: 100
      }
      
    }, {
      paramName: 'angle',
      paramDesc: '',
      paramValue: 45,
      widget: {
        type: 'slider',
        min: 0,
        max: 180
      }
    }, {
      paramName: 'scale',
      paramDesc: 'isotropic scale factor',
      paramValue: 1,
      widget: {
        type: 'slider',
        min: 0.1,
        max: 10
      } 
    }
  ],
  f: (title, src, dst, params) => {
    try {
      // console.log(`${title} params:`,src, dst, ...params)
      let [centerx, centery, angle, scale] = [...params]
      let dsize = new cv.Size(src.rows, src.cols)
      let center = new cv.Point(src.cols * centerx / 100, src.rows * centery / 100);
      let M = cv.getRotationMatrix2D(center, angle, scale);
      cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      // console.log(`${title}: ` + error)
    }
    return false
  }
}, 
{
  title: 'Fourier Transform',
  primaryClass: '图像变换',
  secondrayClass: '频域变换',
  selected: false,
  imageAvaliable: true,
  params: [
  //   {
  //     paramName: 'flags',
  //     paramDesc: 'transformation flags, representing a combination of the cv.DftFlags.',
  //     paramValue: 50,
  //     widget: {
  //        type: 'slider',
  //        min: 0,
  //        max: 100
  //     }
      
  //   }, {
  //     paramName: 'nonzeroRows',
  //     paramDesc: 'when the parameter is not zero, the function assumes that only the first nonzeroRows rows of the input array (DFT_INVERSE is not set) or only the first nonzeroRows of the output array (DFT_INVERSE is set) contain non-zeros, thus, the function can handle the rest of the rows more efficiently and save some time; this technique is very useful for calculating array cross-correlation or convolution using DFT.',
  //     paramValue: 50,
  //     widget: {
  //       type: 'slider',
  //       min: 0,
  //       max: 100
  //     }
      
  //   }, {
  //     paramName: 'angle',
  //     paramDesc: '',
  //     paramValue: 45,
  //     widget: {
  //       type: 'slider',
  //       min: 0,
  //       max: 180
  //     }
  //   }, {
  //     paramName: 'scale',
  //     paramDesc: 'isotropic scale factor',
  //     paramValue: 1,
  //     widget: {
  //       type: 'slider',
  //       min: 0.1,
  //       max: 10
  //     } 
  //   }
  ],
  f: (title, src, dst, params) => {
    try {
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

      // get optimal size of DFT
      let optimalRows = cv.getOptimalDFTSize(src.rows);
      let optimalCols = cv.getOptimalDFTSize(src.cols);
      let s0 = cv.Scalar.all(0);
      let padded = new cv.Mat();
      cv.copyMakeBorder(dst, padded, 0, optimalRows - dst.rows, 0,
                        optimalCols - dst.cols, cv.BORDER_CONSTANT, s0);

      // use cv.MatVector to distribute space for real part and imaginary part
      let plane0 = new cv.Mat();
      padded.convertTo(plane0, cv.CV_32F);
      let planes = new cv.MatVector();
      let complexI = new cv.Mat();
      let plane1 = new cv.Mat.zeros(padded.rows, padded.cols, cv.CV_32F);
      planes.push_back(plane0);
      planes.push_back(plane1);
      cv.merge(planes, complexI);

      // in-place dft transform
      cv.dft(complexI, complexI);

      // compute log(1 + sqrt(Re(DFT(img))**2 + Im(DFT(img))**2))
      cv.split(complexI, planes);
      cv.magnitude(planes.get(0), planes.get(1), planes.get(0));
      let mag = planes.get(0);
      let m1 = new cv.Mat.ones(mag.rows, mag.cols, mag.type());
      cv.add(mag, m1, mag);
      cv.log(mag, mag);

      // crop the spectrum, if it has an odd number of rows or columns
      let rect = new cv.Rect(0, 0, mag.cols & -2, mag.rows & -2);
      mag = mag.roi(rect);

      // rearrange the quadrants of Fourier image
      // so that the origin is at the image center
      let cx = mag.cols / 2;
      let cy = mag.rows / 2;
      let tmp = new cv.Mat();

      let rect0 = new cv.Rect(0, 0, cx, cy);
      let rect1 = new cv.Rect(cx, 0, cx, cy);
      let rect2 = new cv.Rect(0, cy, cx, cy);
      let rect3 = new cv.Rect(cx, cy, cx, cy);

      let q0 = mag.roi(rect0);
      let q1 = mag.roi(rect1);
      let q2 = mag.roi(rect2);
      let q3 = mag.roi(rect3);

      // exchange 1 and 4 quadrants
      q0.copyTo(tmp);
      q3.copyTo(q0);
      tmp.copyTo(q3);

      // exchange 2 and 3 quadrants
      q1.copyTo(tmp);
      q2.copyTo(q1);
      tmp.copyTo(q2);

      // The pixel value of cv.CV_32S type image ranges from 0 to 1.
      cv.normalize(mag, mag, 0, 1, cv.NORM_MINMAX);
      mag.copyTo(dst)
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      console.log(`${title}: ` + error)
    }
    return false
  }
}, 
{
  title: 'Sobel Derivatives',
  primaryClass: '图像增强',
  secondrayClass: '锐化',
  theory: 'OpenCV provides three types of gradient filters or High-pass filters, Sobel, Scharr and Laplacian. We will see each one of them.',
  selected: false,
  imageAvaliable: true,
  params: [
    {
      paramName: 'xyOrder',
      paramDesc: 'order of the derivative x,y.',
      paramValue: true,
      widget:{ 
        type: "switch"
      } 
    },
    {
      paramName: 'kernelSize',
      paramDesc: 'size of the extended Sobel kernel; it must be 1, 3, 5, or 7....',
      paramValue: 5,
      widget:{ 
        type: 'slider',
        min: 1,
        max: 13
      } 
    },
    {
      paramName: 'delta',
      paramDesc: 'optional delta value that is added to the results prior to storing them in dst.',
      paramValue: 0,
      widget:{ 
        type: 'slider',
        min: -122,
        max: 122
      } 
    },
  ],
  f: (title, src, dst, params) => {
    try {
      let [dx, ksize, delta] = [...params]
      cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
      if(dx) {
        cv.Sobel(src, dst, cv.CV_8U, 1, 0, ksize, 1,delta , cv.BORDER_DEFAULT);
      } else {
        cv.Sobel(src, dst, cv.CV_8U, 0, 1, ksize, 1,delta , cv.BORDER_DEFAULT);
      }
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      console.log(`${title}: `+ error)
      return false
    }
    return false
  } 

},
{
  title: 'Laplacian Derivatives',
  primaryClass: '图像增强',
  secondrayClass: '锐化',
  selected: false,
  imageAvaliable: true,
  params: [ 
    {
      paramName: 'kernelSize',
      paramDesc: 'size of the extended Sobel kernel; it must be 1, 3, 5, or 7....',
      paramValue: 5,
      widget:{ 
        type: 'slider',
        min: 1,
        max: 13
      } 
    },
    {
      paramName: 'delta',
      paramDesc: 'optional delta value that is added to the results prior to storing them in dst.',
      paramValue: 0,
      widget:{ 
        type: 'slider',
        min: -122,
        max: 122
      } 
    },
  ],
  f: (title, src, dst, params) => {
    try {
      let [ksize, delta] = [...params]
      cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0); 
        cv.Laplacian(src, dst, cv.CV_8U, ksize, 1, delta, cv.BORDER_DEFAULT); 
      return true
    } catch(error) {
      ElMessage.error(`${title}: 之前的操作换个参数试试。`+ error)
      console.log(`${title}: `+ error)
      return false
    }
    return false
  } 

}
// {
//   title: 'Face Detection',
//   primaryClass: '图像识别',
//   secondrayClass: '物体检测',
//   selected: false,
//   imageAvaliable: true,
//   params: [
//     {
//       paramName: 'faces',
//       paramValue: new cv.RectVector(),
//       paramDesc: '',
//       widget: {
//         type: null
//       }
//     }, {
//       paramName: 'classifier', 
//       paramValue: new cv.CascadeClassifier(),
//       paramDesc: '',
//       widget: {
//         type: null
//       }
//     }
//   ],
//   f: (title, src, dst, params) => {
//     console.log(params)
//     let [faces, classifier ] = [...params]
//     try {
//       classifier.load('haarcascade_frontalface_default.xml');
//       cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
//       // detect faces. 
//       classifier.detectMultiScale(dst, faces, 1.1, 3, 0);
//       // draw faces.
//       for (let i = 0; i < faces.size(); ++i) {
//           let face = faces.get(i);
//           let point1 = new cv.Point(face.x, face.y);
//           let point2 = new cv.Point(face.x + face.width, face.y + face.height);
//           cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
//       }
//     } catch(error) {
//       console.log(error)
//     }
//   } 
// }
]

