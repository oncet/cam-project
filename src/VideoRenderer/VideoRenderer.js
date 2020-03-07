import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import * as faceapi from 'face-api.js';

import helpers from './helpers';

const loadedModels = [];

const VideoRenderer = ({ filter }) => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();
  const rendererRef = useRef();
  const animationRequestIdRef = useRef();
  const backgroundRef = useRef();
  const cameraRef = useRef();

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

        videoRef.current = helpers.createVideo();

        videoRef.current.onloadedmetadata  = () => {
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
    <div ref={canvasContainerRef} />
  );
};

VideoRenderer.propTypes = {
  filter: PropTypes.string.isRequired
}

export default VideoRenderer;
