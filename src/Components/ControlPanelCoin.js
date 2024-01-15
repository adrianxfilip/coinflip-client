import React, { useRef, Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import coinModel from "../Assets/goldencoininset.glb";

const GltfModel = ({ position = [0, 0, 0] }) => {
  const ref = useRef();
  const gltf = useLoader(GLTFLoader, coinModel);

  return (
    <>
      <primitive
        ref={ref}
        object={gltf.scene.clone()}
        position={position}
        scale={1.5}
      />
    </>
  );
};

const ModelViewer = ({ position = [0, 0, 0], side }) => {
  return (
    <Canvas gl={{ preserveDrawingBuffer: true, alpha: true }} shadows>
      <Suspense fallback={null}>
      <directionalLight castShadow intensity={1} position={[0, 50, 10]} />
      <directionalLight intensity={1} position={[0, 0, 50]} />
      <directionalLight intensity={1} position={[0, -50, 50]} />
      <directionalLight castShadow intensity={1} position={[-50, 50, 10]} />
      <directionalLight intensity={1} position={[-50, 0, 50]} />
      <directionalLight intensity={1} position={[-50, -50, 50]} />
      <directionalLight castShadow intensity={1} position={[50, 50, 10]} />
      <directionalLight intensity={1} position={[50, 0, 50]} />
      <directionalLight intensity={1} position={[50, -50, 50]} />
        <motion.group
          initial={{ scale: 1.7 }}
          animate={{
            y: [0, 0.4, 0],
            rotateY: side === "heads" ? 0 : side === "tails" ? 3.14 : 0,
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            },
          }}
          key={"controlPanelCoin"}
        >
          <GltfModel castShadow position={position} />
        </motion.group>
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
