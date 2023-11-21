import React, { useRef, Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { backOut, useAnimation } from "framer-motion";
import { useEffect } from "react";
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

const ModelViewer = ({ position = [0, 0, 0], winningSide, roomID }) => {
  const variants = {
    initial: {
      rotateY: 0,
      scale: .5,
      zIndex: 3
    },
    heads: {
      zIndex: 3,
      rotateY: 31.4,
      scale: [1, 2, 2, 1.3],
      transition: {
        rotateY: {
          duration: 2,
          ease: "linear",
        },
        scale: {
          duration: 2,
          times: [0, 0.4, 0.6, 1],
        },
      },
    },
    tails: {
      zIndex: 3,
      rotateY: 34.54,
      scale: [1, 2, 2, 1.3],
      transition: {
        rotateY: {
          duration: 2,
          ease: "linear",
        },
        scale: {
          duration: 2,
          times: [0, 0.4, 0.6, 1],
        },
      },
    },
  };

  const coinControls = useAnimation();

  useEffect(() => {
    if (winningSide === "tails") {
      coinControls.start("tails");
    } else {
      coinControls.start("heads");
    }
  }, [winningSide, coinControls]);

  return (
    <Canvas>
      <ambientLight intensity={2} />
      <directionalLight intensity={1} position={[0, 50, 10]} />
      <directionalLight intensity={1} position={[0, 0, 50]} />
      <directionalLight intensity={1} position={[0, -50, 50]} />
      <directionalLight intensity={1} position={[-50, 50, 10]} />
      <directionalLight intensity={1} position={[-50, 0, 50]} />
      <directionalLight intensity={1} position={[-50, -50, 50]} />
      <directionalLight intensity={1} position={[50, 50, 10]} />
      <directionalLight intensity={1} position={[50, 0, 50]} />
      <directionalLight intensity={1} position={[50, -50, 50]} />
      <Suspense fallback={null}>
        <motion.group
          variants={variants}
          animate={winningSide === "tails" ? "tails" : "heads"}
          key={roomID}
        >
          <GltfModel position={position} />
        </motion.group>
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
