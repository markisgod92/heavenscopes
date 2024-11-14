import React, { useEffect, useRef, useState } from "react"
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { OrbitControls, useTexture, Sphere, Html } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"

export const ModelConstructor = ({ model3D }) => {
    const [loading, setLoading] = useState(true)
    const { isCustomModel, modelUrl, textureUrl } = model3D
    const texture = useTexture(textureUrl)
    const gltf = isCustomModel ? useLoader(GLTFLoader, modelUrl) : null
    const ref = useRef()

    useEffect(() => {
        setLoading(true);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.flipY = false
        setLoading(false)
    }, [texture, modelUrl, isCustomModel])

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.001
        }
    })

    return (
        <>
            {loading && <Html><p>Loading...</p></Html>}
            {isCustomModel && gltf ? (
                <primitive object={gltf.scene} ref={ref} />
            ) : (
                <Sphere ref={ref} args={[1, 64, 64]}>
                    <meshStandardMaterial map={texture} />
                </Sphere>
            )}
        </>
    )
}

export const ModelViewer = ({ model3D }) => {
    const { isCustomModel, modelUrl, textureUrl } = model3D

    useEffect(() => {
        return () => {}
    }, [])

    return (
        <Canvas style={{ background: "none", width: '100%', height: '100%', minHeight: '400px' }} camera={{ position: [0, 0, 3], fov: 50 }}>
            <ambientLight intensity={2} />
            <pointLight position={[10, 10, 10]} />
            <ModelConstructor
                model3D={model3D}
                isCustomModel={isCustomModel}
                modelUrl={modelUrl}
                textureUrl={textureUrl}
            />
            <OrbitControls enableZoom={false} />
        </Canvas>
    )
}
