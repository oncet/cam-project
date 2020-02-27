import * as THREE from 'three';
import * as faceapi from 'face-api.js';

const getDetectorOptions = () => new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

const createAssets = (video) => {
  const scene = new THREE.Scene();

  const backgroundGeometry = new THREE.BoxGeometry(
    video.videoWidth,
    video.videoHeight,
  );
  const backgroundTexture = new THREE.VideoTexture(video);
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
    video.videoWidth / video.videoHeight,
    0.1,
    1000,
  );

  camera.position.z = 10;

  return {
    scene,
    camera,
    cube,
  };
};

const render = (assets, detectorOptions, renderer, video) => {
  const {
    scene,
    camera,
    cube,
  } = assets;

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  faceapi.detectSingleFace(video, detectorOptions).then((detections) => {
    // Detections availabe!
    // console.log('detections', detections);
  });

  renderer.render(scene, camera);
};

export default {
  getDetectorOptions,
  createAssets,
  render,
  model: 'tinyFaceDetector',
};
