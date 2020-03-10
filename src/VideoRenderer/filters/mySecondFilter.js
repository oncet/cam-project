import * as THREE from 'three';
import * as faceapi from 'face-api.js';

const createAssets = () => {
  const scene = new THREE.Scene();

  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x713dc3 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cube.position.z = 5;

  scene.add(cube);

  const detectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

  return {
    detectorOptions,
    scene,
    cube,
  };
};

const render = (assets, background, camera, renderer, video) => {
  const {
    detectorOptions,
    scene,
    cube,
  } = assets;

  faceapi.detectSingleFace(video, detectorOptions).then((detections) => {
    if (detections) {
      cube.position.x = -((1080 / 2) - detections.box.x) * 0.0018;
      cube.position.y = ((1920 / 2) - detections.box.y) * 0.0018;
    }
  });

  renderer.render(scene, camera);
};

export default {
  createAssets,
  render,
  models: [
    'tinyFaceDetector',
    'faceLandmark68TinyNet',
  ],
};
