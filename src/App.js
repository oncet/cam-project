import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as faceapi from 'face-api.js';

const App = () => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();

  useEffect(() => {

    videoRef.current.onloadedmetadata = () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 50, videoRef.current.videoWidth/videoRef.current.videoHeight, 0.1, 1000 );
  
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize( videoRef.current.videoWidth, videoRef.current.videoHeight );
      canvasContainerRef.current.appendChild( renderer.domElement );
  
      const backgroundTexture = new THREE.VideoTexture( videoRef.current );
      const backgroundMaterial = new THREE.MeshBasicMaterial( { map: backgroundTexture } );
      const backgroundGeometry = new THREE.BoxGeometry(videoRef.current.videoWidth, videoRef.current.videoHeight);
      const background = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
  
      background.position.z = -500; 
  
      scene.add( background );
  
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const cube = new THREE.Mesh( geometry, material );
      cube.position.z = 5;
  
      scene.add( cube );
  
      camera.position.z = 10;

      const getDetectorOptions = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        return new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });
      };

      const detect = async (detectorOptions) => await faceapi.detectSingleFace(videoRef.current, detectorOptions);

      getDetectorOptions().then((detectorOptions) => {
        detect(detectorOptions).then((detections) => console.log('detections', detections));

        const animate = function () {
          requestAnimationFrame( animate );
    
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
    
          detect(detectorOptions).then((detections) => {
            // Detections availabe!
          });

          renderer.render( scene, camera );
        };
    
        animate();
      });
    };
  }, []);

  return (
    <div>
      <div className="canvasContainer" ref={canvasContainerRef} />
      <video autoPlay loop src="video.mp4" ref={videoRef} />
    </div>
  );
};

export default App;
