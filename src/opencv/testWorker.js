var Module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
      console.log('opencv is ready')
    }
  };
import cv from 'opencv.js'