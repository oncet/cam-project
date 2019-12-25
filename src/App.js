import React, { useRef, useEffect } from 'react';
import './App.css';

import * as faceapi from 'face-api.js';

const App = () => {
  const canvasRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models');
    };
    loadModels();
  }, []);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');

    // Recommended setting for webcams
    const detectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 128 });

    videoRef.current.onloadedmetadata = () => {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
    };

    const stream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        'video': true
      });

      videoRef.current.srcObject = stream;

      videoRef.current.addEventListener('play', () => {
        (async function loop() {
          const detections = await faceapi.detectSingleFace(videoRef.current, detectorOptions).withFaceLandmarks(true);
          context.drawImage(videoRef.current, 0, 0);
          if (detections) {
            faceapi.draw.drawDetections(canvasRef.current, detections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
          }
          setTimeout(loop, 1000 / 300 ); // Drawing at 30 FPS
        })();
      }, 0);
    };

    // TODO: Prevent starting stream before models are loaded
    window.setTimeout(stream, 5000);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <video autoPlay ref={videoRef}></video>
    </div>
  );
};

export default App;
