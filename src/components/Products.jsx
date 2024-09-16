import React, { useState, useRef } from 'react';
import LoadingDialog from './LoadingDialog'; // Import the LoadingDialog component

const EggAnalyzer = () => {
  const [srcImage, setSrcImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [eggCount, setEggCount] = useState(0);
  const canvasRef = useRef(null);
  const [roi, setRoi] = useState(null);
  const [dragStart, setDragStart] = useState(null);

  const [grayImage, setGrayImage] = useState(null);
  const [binaryImage, setBinaryImage] = useState(null);
  const [dilatedImage, setDilatedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSrcImage(event.target.result);
        setProcessed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!dragStart) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const img = new Image();
    img.src = srcImage;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(dragStart.x, dragStart.y, x - dragStart.x, y - dragStart.y);
    };
  };

  const handleMouseUp = (e) => {
    if (!dragStart) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRoi = {
      x: dragStart.x,
      y: dragStart.y,
      width: x - dragStart.x,
      height: y - dragStart.y,
    };

    setRoi(newRoi);
    setDragStart(null);
  };

  const processImage = () => {
    // Check if OpenCV.js is available
    if (!window.cv || !srcImage || !roi) {
      console.error('OpenCV.js is not loaded or image/ROI is not available');
      return;
    }
  
    setIsProcessing(true);  // Show loading dialog
  
    const imgElement = document.createElement('img');
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = window.cv.imread(imgElement);
      const dsize = new window.cv.Size(3462, 788);
      const dst = new window.cv.Mat();
      const gray = new window.cv.Mat();
      const binary = new window.cv.Mat();
      const dilated = new window.cv.Mat();
  
      const img_roi = src.roi(new window.cv.Rect(roi.x, roi.y, roi.width, roi.height));
  
      window.cv.resize(img_roi, dst, dsize, 0, 0, window.cv.INTER_LINEAR);
      window.cv.cvtColor(dst, gray, window.cv.COLOR_RGBA2GRAY, 0);
      window.cv.threshold(gray, binary, 116, 255, window.cv.THRESH_BINARY);
      const M = window.cv.Mat.ones(3, 3, window.cv.CV_8U);
      const anchor = new window.cv.Point(-1, -1);
      window.cv.dilate(binary, dilated, M, anchor, 1, window.cv.BORDER_CONSTANT);
  
      const grayBase64 = convertMatToBase64(gray);
      const binaryBase64 = convertMatToBase64(binary);
      const dilatedBase64 = convertMatToBase64(dilated);
  
      setGrayImage(grayBase64);
      setBinaryImage(binaryBase64);
      setDilatedImage(dilatedBase64);
  
      const contours = new window.cv.MatVector();
      const hierarchy = new window.cv.Mat();
      window.cv.findContours(dilated, contours, hierarchy, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);
  
      const detectedEggCount = contours.size();
      setEggCount(detectedEggCount);
  
      src.delete();
      dst.delete();
      gray.delete();
      binary.delete();
      dilated.delete();
      M.delete();
      contours.delete();
      hierarchy.delete();
  
      setIsProcessing(false);  // Hide loading dialog
      setProcessed(true);
    };
  };
  

  const convertMatToBase64 = (mat) => {
    const canvas = document.createElement('canvas');
    window.cv.imshow(canvas, mat);
    return canvas.toDataURL();
  };

  return (
    <div>
      <LoadingDialog />  {/* Add the loading dialog component */}

      <h1>Mosquito Egg Analyzer</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={processImage} disabled={isProcessing || !srcImage || !roi}>
        {isProcessing ? 'Processing...' : 'Process Image'}
      </button>

      {processed && (
        <div>
          <h3>Detected Mosquito Eggs: {eggCount}</h3>
          <div>
            <h4>Gray Image</h4>
            <img src={grayImage} alt="Gray" />
          </div>
          <div>
            <h4>Binary Image</h4>
            <img src={binaryImage} alt="Binary" />
          </div>
          <div>
            <h4>Dilated Image</h4>
            <img src={dilatedImage} alt="Dilated" />
          </div>
        </div>
      )}

      <div>
        <h3>Select ROI</h3>
        {srcImage && (
          <canvas
            ref={canvasRef}
            width={500}
            style={{ border: '1px solid black' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        )}
      </div>
    </div>
  );
};

export default EggAnalyzer;
