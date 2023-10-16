import cv from 'opencv.js';


let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);

function switchToRGBA(src) { 
  
  switch (src.type()) {
    case cv.CV_8UC1: 
    case cv.CV_32F:
    case 5:
    case 0:
        cv.cvtColor(src, src, cv.COLOR_GRAY2RGBA)
        break
      case cv.CV_8UC3:
        cv.cvtColor(src, src, cv.COLOR_RGB2RGBA)
        break
      case cv.CV_8UC4:
        break
    default:
      console.log(src.type())
      throw new Error(
        'srcMat Cannot convert to RGBA'
      )
  }
}

const configs =  [
{
  title: 'cvtColorSpace', 
  f: (src, dst, params) => {
    try {
      
      let [code, dstCn] = [...params] 
      cv.cvtColor(src, dst, code, dstCn);
      return true
    } catch(error) {  
      
    }
    return false
  } 
},
{
  title: 'Erosion', 
  f: (src, dst, params) => {
    try {
      let [kernelSize, iterations, borderType] = [...params]
      let M = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      cv.erode(src, dst, M, anchor, iterations, borderType, cv.morphologyDefaultBorderValue());
      return true
    } catch(error) {  
      
    }
    return false
  } 
},
{
  title: 'Dilate', 
  f: (src, dst, params) => {
    try {
      let [kernelSize, iterations, borderType] = [...params]
      let M = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      cv.dilate(src, dst, M, anchor, iterations, borderType, cv.morphologyDefaultBorderValue());
      return true
    } catch(error) { 
      
    }
    return false
  } 
},
{
  title: "2D Convolution ( Image Filtering )", 
  f: (src, dst, params) => {
    try {
      // 
      let [depth, kernel, delta, borderType] = [...params]
      let M = cv.Mat.eye(kernel, kernel, cv.CV_32FC1)
      let anchor = new cv.Point(-1, -1)
      cv.filter2D(src, dst, depth, M, anchor, delta, borderType);
      return true
    } catch(error) { 
      
    }
    return false
  }
}, 
{
  title: "Hough Transform", 
  f: (src, dst, params) => {
    try {
      // 
      let [rho, theta, threshold] = [...params]
      let lines = new cv.Mat();
      switchToRGBA(src)
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.Canny(src, src, 50, 200, 3);
      // You can try more different parameters
      cv.HoughLines(src, lines, 1, Math.PI / 180,
              30, 0, 0, 0, Math.PI);
      // draw lines
      for (let i = 0; i < lines.rows; ++i) {
          let rho = lines.data32F[i * 2];
          let theta = lines.data32F[i * 2 + 1];
          let a = Math.cos(theta);
          let b = Math.sin(theta);
          let x0 = a * rho;
          let y0 = b * rho;
          let startPoint = {x: x0 - 1000 * b, y: y0 + 1000 * a};
          let endPoint = {x: x0 + 1000 * b, y: y0 - 1000 * a};
          cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
      }
      lines.delete()
      return true
    } catch(error) { 
      
    }
    return false
  }
}, 
{
  title: "Fixed Threshold", 
  f: (src, dst, params) => {
    let [ thresh, maxval, type] = [...params] 
      if(maxval < thresh) { 
        return false
      }
      try {
        // 
        cv.threshold(src, dst, thresh, maxval, type)
        return true
      } catch(error) { 
        
      }
      return false
  }
}, 
{
  title: "Adaptive Thresholding",
  f: (src, dst, params) => { 
    //  
    try {
      switchToRGBA(src)
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      cv.adaptiveThreshold(dst, dst, ...params);
      return true
    } catch(error) { 
      
    }
    return false
  }
}, 
{
  title: "Canny Edge Detection",
  f: (src, dst, params) => {
    try { 
      switchToRGBA(src)
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      cv.Canny(dst, dst, ...params); 
      return true
    } catch(error) { 
      
    } 
    return false
  }
}, 
{
  title: 'Rotation Transform', 
  f: (src, dst, params) => {
    try {
      // 
      let [centerx, centery, angle, scale] = [...params]
      let dsize = new cv.Size(src.rows, src.cols)
      let center = new cv.Point(src.cols * centerx / 100, src.rows * centery / 100);
      let M = cv.getRotationMatrix2D(center, angle, scale);
      cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
      return true
    } catch(error) { 
      
    }
    return false
  }
}, 
{
  title: 'Fourier Transform', 
  f: (src, dst, params) => {
    try {
      switchToRGBA(src)
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
      padded.delete(); planes.delete(); complexI.delete(); m1.delete(); tmp.delete(); 
      return true
    } catch(error) { 
      
    }
    return false
  }
}, 
{
  title: 'Sobel Derivatives', 
  f: (src, dst, params) => {
    try {
      let [dx, ksize, delta] = [...params]
      switchToRGBA(src)
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      if(dx) {
        cv.Sobel(src, dst, cv.CV_8U, 1, 0, ksize, 1,delta , cv.BORDER_DEFAULT);
      } else {
        cv.Sobel(src, dst, cv.CV_8U, 0, 1, ksize, 1,delta , cv.BORDER_DEFAULT);
      }
      return true
    } catch(error) { 
      
    }
    return false
  } 

},
{
  title: 'Laplacian Derivatives', 
  f: (src, dst, params) => {
    try {
      let [ksize, delta] = [...params]
      switchToRGBA(src)
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0); 
      cv.Laplacian(src, dst, cv.CV_8U, ksize, 1, delta, cv.BORDER_DEFAULT); 
      return true
    } catch(error) { 
      
    }
    return false
  } 

},
{
  title: 'Foreground Extraction', 
  f: (src, dst, params) => {
    let [startX, startY, endX, endY, iterCount, mode] = [...params]
    try {
      src.copyTo(dst)
      switchToRGBA(src)
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
      let mask = new cv.Mat();
      let bgdModel = new cv.Mat();
      let fgdModel = new cv.Mat();
      let rect = new cv.Rect(startX / 100 * src.rows, startY  / 100 * src.cols, endX  / 100 * src.rows, endY  / 100 * src.cols);
      cv.grabCut(src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
      // draw foreground
      for (let i = 0; i < src.rows; i++) {
          for (let j = 0; j < src.cols; j++) {
              if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                  dst.ucharPtr(i, j)[0] = 0;
                  dst.ucharPtr(i, j)[1] = 0;
                  dst.ucharPtr(i, j)[2] = 0;
              }
          }
      }
      // draw grab rect
      let color = new cv.Scalar(255, 0, 0);
      let point1 = new cv.Point(rect.x, rect.y);
      let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
      cv.rectangle(dst, point1, point2, color);
      mask.delete()
      bgdModel.delete()
      fgdModel.delete()
      return true
    } catch(error) {  
      
    }
    return false
  } 
},
{
  title: 'Background Subtraction', 
  f: (src, dst, params) => { 
    try {
      src.copyTo(dst)
      return true
    } catch(error) {  
      
    }
    return false
  } 
},

]
 
const cv= new cv()
console.log('cv', cv)

let errorIndexs = []

self.addEventListener('message', function(e) {  
  try {  
    let type = 'done'
    errorIndexs.length = 0

    const imageData = e.data.image; 
    // 创建 OpenCV 的 Mat 对象
    const src = new cv.Mat(imageData.height, imageData.width, cv.CV_8UC4); 
    const dst = new cv.Mat(imageData.height, imageData.width, cv.CV_8UC1);

    // 将图像数据复制到 src Mat 对象
    src.data.set(imageData.data); 
    src.copyTo(dst)

    if(e.data.type == 'image') {
      //图片图像处理
      e.data.paramsList.map( (item, index) => {   
        if(item.selected) { 
          let res
          if(item.imageAvailable != false) {
            res = configs[index].f(dst, dst, item.params)  
          }
          if(!res && item.videoAvailable == false) {  
            type = 'error'
            errorIndexs.push(item.processIndex)
          }  
          // Mat转ImageData
          try {
            switchToRGBA(dst)
            let imageProcessed =  new ImageData(
              new Uint8ClampedArray(dst.data),
              dst.cols,
              dst.rows
            )
            self.postMessage(
              {
                type: type,
                indexs: errorIndexs,
                image: imageProcessed,
                inputType: e.data.type
              }
            )
          } catch(error) {
            
            self.postMessage(
              {
                type: 'error',
                indexs: [e.data.paramsList.findLastIndex(item => item.selected)],
                image: imageData,
                inputType: e.data.type
              }
            )
          }
          
        } 
      })

    } else {
      //视频处理
        e.data.paramsList.map( (item, index) => {  
          if(item.selected) {
            let res
            if(item.videoAvailable != false) {
              res = configs[index].f(dst, dst, item.params)  
            }
            if(!res && item.videoAvailable == false) {  
              type = 'error'
              errorIndexs.push(item.processIndex)
            }  
            
          } 

      }) 

      // Mat转ImageData
      try {
        switchToRGBA(dst)
        let imageProcessed =  new ImageData(
          new Uint8ClampedArray(dst.data),
          dst.cols,
          dst.rows
        )
        self.postMessage(
          {
            type: type,
            indexs: errorIndexs,
            image: imageProcessed,
            inputType: e.data.type
          }
        )
      } catch(error) {
        
        self.postMessage(
          {
            type: 'error',
            indexs: [e.data.paramsList.findLastIndex(item => item.selected)],
            image: imageData,
            inputType: e.data.type
          }
        )
      }
    }
    

    
    src.delete()
    dst.delete()
  } catch(error) {
    self.postMessage({ msg: 'loading' + error, error: 'error'})
    return false
  }
});


