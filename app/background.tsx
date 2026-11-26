"use client"; // This is a client component

import type {} from '@react-three/fiber'
import React from 'react'
export default function Background() {
  return (
    <>
        <ambientLight intensity={0.9} />
        <pointLight intensity={0.9} position={[0,0, 0]} castShadow />
    </>
  );
}