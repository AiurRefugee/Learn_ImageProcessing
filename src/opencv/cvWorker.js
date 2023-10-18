
importScripts('opencv.js')
// console.log('cv', cv)

let fgbg = null
let fgbgParams = []

function fgbgUpdate(params) {
  if(params.length != fgbgParams.length) {
    console.log('update')
    return true
  }
  fgbgParams.map( (item, index) => {
    if(item !== params[index]) {
      // console.log('update')
      return true
    }
  })

  return false
}

function switchToRGBA(src) { 
  
  switch (src.type()) {
    case CV.CV_8UC1: 
    case CV.CV_32F:
    case 5:
    case 0:
        CV.cvtColor(src, src, CV.COLOR_GRAY2RGBA)
        break
      case CV.CV_8UC3:
        CV.cvtColor(src, src, CV.COLOR_RGB2RGBA)
        break
      case CV.CV_8UC4:
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
      CV.cvtColor(src, dst, code, dstCn);
      return true
    } catch(error) {  
      console.log(error)
    }
    return false
  } 
},
{
  title: 'Erosion', 
  f: (src, dst, params) => {
    try {
      let [kernelSize, iterations, borderType] = [...params]
      let M = CV.Mat.ones(kernelSize, kernelSize, CV.CV_8U);
      let anchor = new CV.Point(-1, -1);
      CV.erode(src, dst, M, anchor, iterations, borderType, CV.morphologyDefaultBorderValue());
      return true
    } catch(error) {  
      console.log(error)
    }
    return false
  } 
},
{
  title: 'Dilate', 
  f: (src, dst, params) => {
    try {
      let [kernelSize, iterations, borderType] = [...params]
      let M = CV.Mat.ones(kernelSize, kernelSize, CV.CV_8U);
      let anchor = new CV.Point(-1, -1);
      CV.dilate(src, dst, M, anchor, iterations, borderType, CV.morphologyDefaultBorderValue());
      return true
    } catch(error) { 
      console.log(error)
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
      let M = CV.Mat.eye(kernel, kernel, CV.CV_32FC1)
      let anchor = new CV.Point(-1, -1)
      CV.filter2D(src, dst, depth, M, anchor, delta, borderType);
      return true
    } catch(error) { 
      console.log(error)
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
      let lines = new CV.Mat();
      switchToRGBA(src)
      CV.cvtColor(src, src, CV.COLOR_RGBA2GRAY, 0);
      CV.Canny(src, src, 50, 200, 3);
      // You can try more different parameters
      CV.HoughLines(src, lines, 1, Math.PI / 180,
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
          CV.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
      }
      lines.delete()
      return true
    } catch(error) { 
      console.log(error)
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
        CV.threshold(src, dst, thresh, maxval, type)
        return true
      } catch(error) { 
        console.log(error)
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
      CV.cvtColor(src, dst, CV.COLOR_RGBA2GRAY, 0);
      CV.adaptiveThreshold(dst, dst, ...params);
      return true
    } catch(error) { 
      console.log(error)
    }
    return false
  }
}, 
{
  title: "Canny Edge Detection",
  f: (src, dst, params) => {
    try { 
      switchToRGBA(src)
      CV.cvtColor(src, dst, CV.COLOR_RGBA2GRAY, 0);
      CV.Canny(dst, dst, ...params); 
      return true
    } catch(error) { 
      console.log(error)
      
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
      let dsize = new CV.Size(src.rows, src.cols)
      let center = new CV.Point(src.cols * centerx / 100, src.rows * centery / 100);
      let M = CV.getRotationMatrix2D(center, angle, scale);
      CV.warpAffine(src, dst, M, dsize, CV.INTER_LINEAR, CV.BORDER_CONSTANT, new CV.Scalar());
      return true
    } catch(error) { 
      console.log(error)
    }
    return false
  }
}, 
{
  title: 'Fourier Transform', 
  f: (src, dst, params) => {
    try {
      switchToRGBA(src)
      CV.cvtColor(src, dst, CV.COLOR_RGBA2GRAY, 0);

      // get optimal size of DFT
      let optimalRows = CV.getOptimalDFTSize(src.rows);
      let optimalCols = CV.getOptimalDFTSize(src.cols);
      let s0 = CV.Scalar.all(0);
      let padded = new CV.Mat();
      CV.copyMakeBorder(dst, padded, 0, optimalRows - dst.rows, 0,
                        optimalCols - dst.cols, CV.BORDER_CONSTANT, s0);

      // use CV.MatVector to distribute space for real part and imaginary part
      let plane0 = new CV.Mat();
      padded.convertTo(plane0, CV.CV_32F);
      let planes = new CV.MatVector();
      let complexI = new CV.Mat();
      let plane1 = new CV.Mat.zeros(padded.rows, padded.cols, CV.CV_32F);
      planes.push_back(plane0);
      planes.push_back(plane1);
      CV.merge(planes, complexI);

      // in-place dft transform
      CV.dft(complexI, complexI);

      // compute log(1 + sqrt(Re(DFT(img))**2 + Im(DFT(img))**2))
      CV.split(complexI, planes);
      CV.magnitude(planes.get(0), planes.get(1), planes.get(0));
      let mag = planes.get(0);
      let m1 = new CV.Mat.ones(mag.rows, mag.cols, mag.type());
      CV.add(mag, m1, mag);
      CV.log(mag, mag);

      // crop the spectrum, if it has an odd number of rows or columns
      let rect = new CV.Rect(0, 0, mag.cols & -2, mag.rows & -2);
      mag = mag.roi(rect);

      // rearrange the quadrants of Fourier image
      // so that the origin is at the image center
      let cx = mag.cols / 2;
      let cy = mag.rows / 2;
      let tmp = new CV.Mat();

      let rect0 = new CV.Rect(0, 0, cx, cy);
      let rect1 = new CV.Rect(cx, 0, cx, cy);
      let rect2 = new CV.Rect(0, cy, cx, cy);
      let rect3 = new CV.Rect(cx, cy, cx, cy);

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

      // The pixel value of CV.CV_32S type image ranges from 0 to 1.
      CV.normalize(mag, mag, 0, 1, CV.NORM_MINMAX);
      mag.copyTo(dst)
      padded.delete(); planes.delete(); complexI.delete(); m1.delete(); tmp.delete(); 
      return true
    } catch(error) { 
      console.log(error)
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
      CV.cvtColor(src, src, CV.COLOR_RGBA2GRAY, 0);
      if(dx) {
        CV.Sobel(src, dst, CV.CV_8U, 1, 0, ksize, 1,delta , CV.BORDER_DEFAULT);
      } else {
        CV.Sobel(src, dst, CV.CV_8U, 0, 1, ksize, 1,delta , CV.BORDER_DEFAULT);
      }
      return true
    } catch(error) { 
      console.log(error)
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
      CV.cvtColor(src, src, CV.COLOR_RGBA2GRAY, 0); 
        CV.Laplacian(src, dst, CV.CV_8U, ksize, 1, delta, CV.BORDER_DEFAULT); 
      return true
    } catch(error) { 
      console.log(error)
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
      CV.cvtColor(src, src, CV.COLOR_RGBA2RGB, 0);
      let mask = new CV.Mat();
      let bgdModel = new CV.Mat();
      let fgdModel = new CV.Mat();
      let rect = new CV.Rect(startX / 100 * src.rows, startY  / 100 * src.cols, endX  / 100 * src.rows, endY  / 100 * src.cols);
      CV.grabCut(src, mask, rect, bgdModel, fgdModel, 1, CV.GC_INIT_WITH_RECT);
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
      let color = new CV.Scalar(255, 0, 0);
      let point1 = new CV.Point(rect.x, rect.y);
      let point2 = new CV.Point(rect.x + rect.width, rect.y + rect.height);
      CV.rectangle(dst, point1, point2, color);
      mask.delete()
      bgdModel.delete()
      fgdModel.delete()
      return true
    } catch(error) {  
      console.log(error)
    }
    return false
  } 
},
{
  title: 'Background Subtraction', 
  f: (src, dst, params) => {  
    const [ history, varThreshold, detectShadows ] = [...params]
    // console.log(history)
    try {
      if(!fgbg || fgbgUpdate([...params])) {
        fgbg = new CV.BackgroundSubtractorMOG2(history, varThreshold, detectShadows); 
        
      }
      fgbgParams = [...params]
      // let fgbg = new CV.BackgroundSubtractorMOG2(500, 16, true); 
      fgbg.apply(src, dst) 
      return true 
    } catch {
      console.log(error)
    }
    return false
  } 
}
]
 
const CV = new cv() 
 

let errorIndexs = []
let type = ''
var imageData 

self.addEventListener('message', function(e) {  

  type = 'done'
  if(e.data.type == 'update') {
    // fgbg = new CV.BackgroundSubtractorMOG2(history, varThreshold, detectShadows); 
    // return;
  }
  try {  
     
    errorIndexs.length = 0

    imageData = e.data.image; 
    // 创建 OpenCV 的 Mat 对象
    const src = new CV.Mat(imageData.height, imageData.width, CV.CV_8UC4); 
    const dst = new CV.Mat(imageData.height, imageData.width, CV.CV_8UC1);

    // 将图像数据复制到 src Mat 对象
    src.data.set(imageData.data); 
    src.copyTo(dst)

    if(e.data.type == 'image') {
      //图片图像处理
      e.data.paramsList.map( (item, index) => {   
        if(item.selected) { 
          let res = configs[index].f(dst, dst, item.params)   
          if(!res) {  
            type = 'processError'
            errorIndexs.push(item.processIndex)
          } else {
            // Mat转ImageData
            try {
              switchToRGBA(dst)
              imageData =  new ImageData(
                new Uint8ClampedArray(dst.data),
                dst.cols,
                dst.rows
              ) 
            } catch(error) {
              console.log('error')
              errorIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
              imageData = e.data.image
              type = 'error'
            }
            self.postMessage({
              type: type,
              indexs: errorIndexs,
              image: imageData, 
            }) 
          } 
        } 
      })

    } else {
      //视频图像处理
        e.data.paramsList.map( (item, index) => {  
          if(item.selected) {
            let res = configs[index].f(dst, dst, item.params)  
            if(!res) {  
              type = 'processError' 
              errorIndexs.push(item.processIndex)
            }  
            
          } 

      }) 

      // Mat转ImageData
      try {
        switchToRGBA(dst)
        imageData =  new ImageData(
          new Uint8ClampedArray(dst.data),
          dst.cols,
          dst.rows
        ) 
      } catch(error) {
        console.log(error)
        
        errorIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        imageData = e.data.image
        type = 'error'
        
      } 
      self.postMessage({ 
        type: type,
        indexs: errorIndexs,
        image: imageData
      }) 
    } 
    src.delete()
    dst.delete()
  } catch(error) {
    console.log(error) 
    
  }
  
});


