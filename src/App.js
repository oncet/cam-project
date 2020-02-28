import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import * as faceapi from 'face-api.js';
import './App.css';

const loadedModels = [];

const App = () => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();
  const rendererRef = useRef();
  const animationRequestIdRef = useRef();
  const [filter, setFilter] = useState('myFirstFilter');

  useEffect(() => {
    const loadFilter = async () => {
      const { default: videoFilter } = await import(`./filters/${filter}`); 

      if (loadedModels.indexOf(videoFilter.model) < 0) {
        await faceapi.nets[videoFilter.model].loadFromUri('/models');
        loadedModels.push(videoFilter.model);
      }

      if (!rendererRef.current) {
        rendererRef.current = new THREE.WebGLRenderer();
        videoRef.current = document.createElement('video');
        videoRef.current.src = 'video.mp4';
        videoRef.current.loop = true;
        videoRef.current.onloadedmetadata  = () => {
          rendererRef.current.setSize(videoRef.current.videoWidth, videoRef.current.videoHeight);
          canvasContainerRef.current.appendChild(rendererRef.current.domElement);
        }
        videoRef.current.load();
        await videoRef.current.play();
      }

      const detectorOptions = videoFilter.getDetectorOptions();
      const assets = videoFilter.createAssets(videoRef.current);

      cancelAnimationFrame(animationRequestIdRef.current);

      const animate = () => {
        videoFilter.render(assets, detectorOptions, rendererRef.current, videoRef.current);
        animationRequestIdRef.current = requestAnimationFrame(animate);
      };
      animate();
    };
    loadFilter();
  }, [filter]);

  return (
    <div>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="myFirstFilter">My First Filter</option>
        <option value="mySecondFilter">My Second Filter</option>
      </select>
      <div className="canvasContainer" ref={canvasContainerRef} />
    </div>
  );
};

export default App;
