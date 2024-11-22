import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ModelConstructor = ({ model3D }) => {
  const mountRef = useRef(null);
  const { isCustomModel, modelUrl, textureUrl } = model3D;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    let model;
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    let animationFrameId;

    if (isCustomModel) {
      loader.load(
        modelUrl,
        (gltf) => {
          model = gltf.scene;
          scene.add(model);
        },
        undefined,
        (error) => console.error("Error loading GLTF model:", error)
      );
    } else {
      const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
      const texture = textureLoader.load(textureUrl, (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.flipY = true;
      });
      texture.colorSpace = THREE.SRGBColorSpace
      const sphereMaterial = new THREE.MeshStandardMaterial({ map: texture });
      model = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(model);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (model) {
        model.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      scene.clear();
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, [isCustomModel, modelUrl, textureUrl]);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: "400px" }} />
  )
};

export const ModelViewer = ({ model3D }) => {
  return <ModelConstructor model3D={model3D} />;
};