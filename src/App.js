import React, { useRef, useEffect } from 'react';
import './App.css';

import * as faceapi from 'face-api.js';

const App = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const loadImage = event => {
    const file = event.target.files[0];
    if (!file) return false;
    const image = new Image();
    image.onload = async () => {
      const faces = await faceapi.detectAllFaces(image);
      const canvas = canvasRef.current;
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      faceapi.draw.drawDetections(canvas, faces);
    }; 
    const reader = new FileReader();
    reader.onload = event => {
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <form>
        <input type="file" accept="image/*" onChange={loadImage} />
      </form>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default App;
