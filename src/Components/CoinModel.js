import React, { useRef, Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import coinModel from "../Assets/goldencoininset.glb"

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
      scale: 1,
    },
    heads: {
      rotateY:51.9,
      scale: [1,2,1],
      transition: {
        rotateY: {
          duration: 2,
          ease: [.6,.7,.7,.6]
        },
        scale:{
            duration : 2,
            ease : "easeIn"
        }
      },
    },
    tails: {
        rotateY: 48.8,
        scale: [1,2,1],
        transition: {
            rotateY: {
                duration: 2,
                ease: [.6,.7,.7,.6]
              },
              scale:{
                  duration : 2,
                  ease : "easeIn"
              }
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
  }, [winningSide]);

  return (
    <Canvas>
      <ambientLight intensity={2} />
      <directionalLight intensity={1} position={[0,50,10]}/>
      <directionalLight intensity={1} position={[0,0,50]}/>
      <directionalLight intensity={1} position={[0,-50,50]}/>
      <directionalLight intensity={1} position={[-50,50,10]}/>
      <directionalLight intensity={1} position={[-50,0,50]}/>
      <directionalLight intensity={1} position={[-50,-50,50]}/>
      <directionalLight intensity={1} position={[50,50,10]}/>
      <directionalLight intensity={1} position={[50,0,50]}/>
      <directionalLight intensity={1} position={[50,-50,50]}/>
      <Suspense fallback={null}>
        <motion.group variants={variants} animate={winningSide === "tails" ? "tails" : "heads"} key={roomID}>
          <GltfModel position={position} />
        </motion.group>
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
