"use client"; // This is a client component

import React, { useRef } from 'react'
import { Canvas } from "@react-three/fiber";
import Background from '../app/background';
import RestaurantFinder from '../components/RestaurantFinder';
import { Container, SiteContainer, RestaurantContainer } from '../components/styles'
import { GlobalStyle } from '../components/styles'

export default function App() {
  return (
    <>
    <SiteContainer>
      <GlobalStyle/>
      <RestaurantContainer>
        <Canvas style={{ position: 'absolute', top: 0, left: 0, height: "100vh", width: "100vw", pointerEvents: 'none' }} 
            // @ts-ignore
            camera={{ position: [0, -1.7, 3], rotation: [Math.PI/4,0,0] }}>
        <Background/>
        </Canvas>
        <RestaurantFinder/>
      </RestaurantContainer>
      </SiteContainer>
    </>
  );
}