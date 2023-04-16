/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 ./public/objects/darkphotonio.gltf --output ./src/components/DarkPhotonObjects.js
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/darkphotonio.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.star.geometry} material={materials.StarPlasma} />
      <mesh geometry={nodes.Jovian.geometry} material={materials.Jovian} position={[3, 0, 0]} />
      <mesh geometry={nodes.Terrestrial.geometry} material={materials.Terrestrial} position={[0, 0, 2]} />
    </group>
  )
}

useGLTF.preload('/darkphotonio.gltf')