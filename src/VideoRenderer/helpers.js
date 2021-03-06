import * as THREE from 'three';

const createVideo = () => {
  const video = document.createElement('video');
  video.src = 'video.mp4';
  video.muted = true;
  video.loop = true;

  return video;
};

const createBackground = (video) => {
  const backgroundGeometry = new THREE.BoxGeometry(
    video.videoWidth,
    video.videoHeight,
  );

  const backgroundTexture = new THREE.VideoTexture(video);

  const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });

  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  background.position.z = -2050;

  return background;
};

const createCamera = (video) => {
  const camera = new THREE.PerspectiveCamera(
    50,
    video.videoWidth / video.videoHeight,
    0.1,
    5000,
  );

  camera.position.z = 10;

  return camera;
};

const getFaceCenter = (detections, background) => ({
  x: (detections.box.x + detections.box.width / 2) - background.geometry.parameters.width / 2,
  y: (
    (detections.box.y + detections.box.height / 2) - background.geometry.parameters.height / 2
  ) * -1,
});

export default {
  createVideo,
  createBackground,
  createCamera,
  getFaceCenter,
};
