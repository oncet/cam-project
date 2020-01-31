import React, { useRef, useEffect } from 'react';

import * as THREE from 'three';

const stream = async (videoRef, canvasContainerRef) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    'video': true
  });

  videoRef.current.srcObject = stream;

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

    var animate = function () {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();
  };
};

const App = () => {
  const canvasContainerRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    stream(videoRef, canvasContainerRef);
  }, []);

  return (
    <div>
      <div className="canvasContainer" ref={canvasContainerRef} />
      <video autoPlay ref={videoRef} />
    </div>
  );
};

export default App;
