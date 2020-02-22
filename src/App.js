import React, { useRef, useEffect } from 'react';

import videoFilter from './filters/myFirstFilter';

const App = () => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.onloadedmetadata = () => {
      const assets = videoFilter.createAssets(videoRef);

      canvasContainerRef.current.appendChild(assets.renderer.domElement);

      videoFilter.getDetectorOptions().then((detectorOptions) => {
        const animate = () => {
          videoFilter.render(assets, detectorOptions, videoRef);
          requestAnimationFrame(() => animate());
        };
        animate();
      });
    };
  }, []);

  return (
    <div>
      <div className="canvasContainer" ref={canvasContainerRef} />
      <video muted autoPlay loop src="video.mp4" ref={videoRef} />
    </div>
  );
};

export default App;
