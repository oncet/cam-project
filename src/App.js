import React, { useRef, useEffect } from 'react';
import './App.css';

import * as faceapi from 'face-api.js';

const App = () => {
  const canvasRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    };
    loadModels();
  }, []);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    const detectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 128 });
    const stream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        'video': true
      });

      videoRef.current.srcObject = stream;

      videoRef.current.addEventListener('play', () => {
        (async function loop() {
          const faces = await faceapi.detectSingleFace(videoRef.current, detectorOptions);
          context.drawImage(videoRef.current, 0, 0);
          faces && faceapi.draw.drawDetections(canvasRef.current, faces);
          setTimeout(loop, 1000 / 300 ); // Drawing at 30 FPS
        })();
      }, 0);
    };

    // TODO: Prevent starting stream before models are loaded
    window.setTimeout(stream, 5000);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="800"></canvas>
      <video autoPlay ref={videoRef}></video>
    </div>
  );
};

export default App;
