import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as faceapi from 'face-api.js';

import helpers from './helpers.js';

const loadedModels = [];

const Filter = ({ filter }) => {
  const animationRequestIdRef = useRef();
  const backgroundRef = useRef();
  const cameraRef = useRef();
  const canvasContainerRef = useRef();
  const rendererRef = useRef();
  const videoRef = useRef(helpers.createVideo());
  console.log(videoRef.current);
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

        videoRef.current.onloadedmetadata = () => {
          rendererRef.current.setSize(videoRef.current.videoWidth, videoRef.current.videoHeight);
          canvasContainerRef.current.appendChild(rendererRef.current.domElement);
        }

        videoRef.current.load();

        await videoRef.current.play();

        backgroundRef.current = helpers.createBackground(videoRef.current);
        cameraRef.current = helpers.createCamera(videoRef.current);
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
      <div className="canvasContainer" ref={canvasContainerRef} />
    </div>
  );
};

export default Filter;
