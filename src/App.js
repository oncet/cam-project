import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as faceapi from 'face-api.js';

const App = () => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.onloadedmetadata = () => {
      const scene = new THREE.Scene();

      const renderer = new THREE.WebGLRenderer();

      renderer.setSize(videoRef.current.videoWidth, videoRef.current.videoHeight);
      canvasContainerRef.current.appendChild(renderer.domElement);

      const backgroundGeometry = new THREE.BoxGeometry(
        videoRef.current.videoWidth,
        videoRef.current.videoHeight,
      );
      const backgroundTexture = new THREE.VideoTexture(videoRef.current);
      const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
      const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

      background.position.z = -500;

      scene.add(background);

      const cubeGeometry = new THREE.BoxGeometry();
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      cube.position.z = 5;

      scene.add(cube);

      const camera = new THREE.PerspectiveCamera(
        50,
        videoRef.current.videoWidth / videoRef.current.videoHeight,
        0.1,
        1000,
      );

      camera.position.z = 10;

      const getDetectorOptions = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        return new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });
      };

      const detect = async (detectorOptions) => (
        faceapi.detectSingleFace(videoRef.current, detectorOptions)
      );

      getDetectorOptions().then((detectorOptions) => {
        detect(detectorOptions).then((detections) => console.log('detections', detections));

        const animate = () => {
          requestAnimationFrame(animate);

          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          detect(detectorOptions).then((detections) => {
            // Detections availabe!
            // console.log('detections', detections);
          });

          renderer.render(scene, camera);
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
