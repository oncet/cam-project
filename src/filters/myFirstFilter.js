import * as THREE from 'three';
import * as faceapi from 'face-api.js';

const createAssets = () => {
  const scene = new THREE.Scene();

  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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

const render = (assets, camera, renderer, video) => {
  const {
    detectorOptions,
    scene,
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
  createAssets,
  render,
  models: ['tinyFaceDetector'],
};
