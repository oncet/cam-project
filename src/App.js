import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as faceapi from 'face-api.js';

const App = () => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();

  useEffect(() => {

    videoRef.current.onloadedmetadata = () => {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 50, videoRef.current.videoWidth/videoRef.current.videoHeight, 0.1, 1000 );
  
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( videoRef.current.videoWidth, videoRef.current.videoHeight );
      canvasContainerRef.current.appendChild( renderer.domElement );
  
      var backgroundTexture = new THREE.VideoTexture( videoRef.current );
      var backgroundMaterial = new THREE.MeshBasicMaterial( { map: backgroundTexture } );
      var backgroundGeometry = new THREE.BoxGeometry(videoRef.current.videoWidth, videoRef.current.videoHeight);
      var background = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
  
      background.position.z = -500; 
  
      scene.add( background );
  
      var geometry = new THREE.BoxGeometry();
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      cube.position.z = 5;
  
      scene.add( cube );
  
      camera.position.z = 10;

      const getDetectorOptions = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        return new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });
      };

      const detect = async (detectorOptions) => await faceapi.detectSingleFace(videoRef.current, detectorOptions);

      getDetectorOptions().then((detectorOptions) => {
        var animate = function () {
          requestAnimationFrame( animate );
    
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
    
          detect(detectorOptions).then((detections) => console.log('detections', detections));

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
