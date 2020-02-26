import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

let loadedModels = [];

const App = () => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();
  const [filter, setFilter] = useState('myFirstFilter');

  useEffect(() => {
    const loadFilter = async () => {
      const { default: videoFilter } = await import(`./filters/${filter}`); 

      if (loadedModels.indexOf(videoFilter.model) < 0) {
        await faceapi.nets[videoFilter.model].loadFromUri('/models');
        loadedModels.push(videoFilter.model);
      }

      const detectorOptions = videoFilter.getDetectorOptions();
      const assets = videoFilter.createAssets(videoRef);

      if (canvasContainerRef.current.firstChild) {
        canvasContainerRef.current.replaceChild(assets.renderer.domElement, canvasContainerRef.current.firstChild);
      } else {
        canvasContainerRef.current.appendChild(assets.renderer.domElement);
      }

      const animate = () => {
        videoFilter.render(assets, detectorOptions, videoRef);
        requestAnimationFrame(animate);
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
      <video muted autoPlay loop src="video.mp4" ref={videoRef} />
    </div>
  );
};

export default App;
