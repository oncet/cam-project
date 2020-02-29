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
  const backgroundRef = useRef();
  const cameraRef = useRef();
  const [filter, setFilter] = useState('myFirstFilter');

  useEffect(() => {
    const loadFilter = async () => {
      const { default: videoFilter } = await import(`./filters/${filter}`); 

      if (!videoFilter.models.every(model => loadedModels.includes(model))) {
        await Promise.all(videoFilter.models.map(async model => {
          if (!loadedModels.includes(model)) {
            await faceapi.nets[model].loadFromUri('/models');
            loadedModels.push(model);
          }
        }));
      }

      if (!rendererRef.current) {
        rendererRef.current = new THREE.WebGLRenderer();

        videoRef.current = document.createElement('video');
        videoRef.current.src = 'video.mp4';
        videoRef.current.muted = true;
        videoRef.current.loop = true;

        videoRef.current.onloadedmetadata  = () => {
          rendererRef.current.setSize(videoRef.current.videoWidth, videoRef.current.videoHeight);
          canvasContainerRef.current.appendChild(rendererRef.current.domElement);
        }

        videoRef.current.load();

        await videoRef.current.play();

        const backgroundGeometry = new THREE.BoxGeometry(
          videoRef.current.videoWidth,
          videoRef.current.videoHeight,
        );

        const backgroundTexture = new THREE.VideoTexture(videoRef.current);

        const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });

        backgroundRef.current = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        backgroundRef.current.position.z = -2050;

        cameraRef.current = new THREE.PerspectiveCamera(
          50,
          videoRef.current.videoWidth / videoRef.current.videoHeight,
          0.1,
          5000,
        );

        cameraRef.current.position.z = 10;
      }

      const assets = videoFilter.createAssets();

      assets.scene.add(backgroundRef.current);

      cancelAnimationFrame(animationRequestIdRef.current);

      const animate = () => {
        videoFilter.render(assets, cameraRef.current, rendererRef.current, videoRef.current);
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
