/* eslint-disable no-undef */

import React, { useState, useRef, useEffect } from 'react';

const Products = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [roi, setRoi] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(URL.createObjectURL(e.target.files[0]));
  };

  const processImage = () => {
    if (!selectedFile || !canvasRef.current || !window.cv) return;

    const imgElement = new Image();
    imgElement.src = selectedFile;
    imgElement.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

      let src = cv.imread(canvas);
      let gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

      let binary = new cv.Mat();
      cv.threshold(gray, binary, 116, 255, cv.THRESH_BINARY);

      let M = cv.Mat.ones(3, 3, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      cv.dilate(binary, binary, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

      // Finding contours
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(binary, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

      // Draw contours on the canvas
      for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(255, 0, 0);
        cv.drawContours(src, contours, i, color, 1, 8, hierarchy, 100);
      }

      // Show the result on canvas
      cv.imshow(canvas, src);

      // Clean up
      src.delete();
      gray.delete();
      binary.delete();
      M.delete();
      contours.delete();
      hierarchy.delete();
    };
  };

  useEffect(() => {
    if (window.cv) {
      processImage();
    }
  }, [selectedFile]);

  return (
    <div>
      <h1>Mosquito Egg Analyzer</h1>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <canvas ref={canvasRef} width="3462" height="788"></canvas>
    </div>
  );
};

export default Products;
