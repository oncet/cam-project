import * as THREE from 'three';
import * as faceapi from 'face-api.js';
import helpers from '../helpers';

const createAssets = () => {
  const scene = new THREE.Scene();

  const cubeGeometry = new THREE.BoxGeometry(150, 150, 150);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cube.position.z = -2050;

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
      const faceCenter = helpers.getFaceCenter(detections, background);
      cube.position.x = faceCenter.x;
      cube.position.y = faceCenter.y;
    }
  });

  renderer.render(scene, camera);
};

export default {
  createAssets,
  render,
  models: ['tinyFaceDetector'],
};
