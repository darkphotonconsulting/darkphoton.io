/* eslint-disable react/no-unknown-property */
import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'

import {
  extend,
  useFrame,
  useThree
} from '@react-three/fiber'

import {
  shaderMaterial
  // CubeCamera
} from '@react-three/drei'
import { exoPlanetShader } from './shaders/PlanetMaterials.js'
// import { BufferGeometryUtils } from 'three/'

function ExoPlanet ({
  // position = [0, 0, 0],
  name = 'Damascus A',
  setState = () => { return null },
  appState = {},
  rotation = [0, 0, 0],
  orbitalAnimation = true,
  orbitalRotation = true,
  orbitalDistance = 150,
  orbitalSpeedFactor = 125,
  bandScale = 3,
  seedValue = 35.7,
  hasRings = false,
  hasMoons = false,
  radius = 1,
  sections = 128,
  visible = true,
  scale = 1,
  ...props
}) {
  const position = [0, 0, 0]
  const {
    // eslint-disable-next-line no-unused-vars
    // scene,
    // eslint-disable-next-line no-unused-vars
    gl
  } = useThree()
  useFrame((state) => {
    const time = 1.2 + (state.clock.getElapsedTime())
    materialRef.current.uniforms.time.value += time
    materialRef.current.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)

    if (appState.splash.scene.planets.orbit.animate) {
      const x = orbitalDistance * Math.sin(time * orbitalSpeedFactor)
      const z = orbitalDistance * Math.cos(time * orbitalSpeedFactor)
      meshRef.current.position.x = x
      meshRef.current.position.z = z
    }
    if (appState.splash.scene.planets.rotation.animate) {
      meshRef.current.rotation.y += 0.005
    }
  })
  const groupRef = React.useRef(null)
  const meshRef = React.useRef(null)
  const materialRef = React.useRef(null)
  const geom = new THREE.SphereGeometry(radius, sections, sections)
  // geom.deleteAttribute('normal')
  // geom.deleteAttribute('uv')
  // geom = THREE.BufferGeometryUtils.mergeVertices(geom)
  geom.computeVertexNormals()
  geom.computeTangents()

  // eslint-disable-next-line no-unused-vars
  const ExoPlanetMaterial = shaderMaterial(
    exoPlanetShader.uniforms,
    exoPlanetShader.vertexShader,
    exoPlanetShader.fragmentShader
  )
  extend({ ExoPlanetMaterial })
  return (
    <group
      name={'splash-exo-planet'}
      ref={groupRef}
      dispose={null}
      visible={visible}
      position={position}
      rotation={rotation}
    >
      <mesh
        castShadow
        receiveShadow
        ref={meshRef}
        scale={scale}
        geometry={geom}
        position={position}
        rotation={rotation}
      >
        <exoPlanetMaterial
          attach={'material'}
          ref={materialRef}
          mode={'multiply'}
          alpha={0.1}
          side={THREE.DoubleSide}
          emissiveIntensity={0.1}
          bandScale={bandScale}
          seedValue={seedValue}
          hasRings={hasRings}
          hasMoons={hasMoons}
        />
      </mesh>
      <primitive object={new THREE.AxesHelper(2 * radius)}/>
    </group>
  )
}

ExoPlanet.propTypes = {
  name: PropTypes.string,
  setState: PropTypes.func,
  appState: PropTypes.object,
  rotation: PropTypes.array,
  orbitalAnimation: PropTypes.bool,
  orbitalRotation: PropTypes.bool,
  orbitalDistance: PropTypes.number,
  orbitalSpeedFactor: PropTypes.number,
  bandScale: PropTypes.number,
  seedValue: PropTypes.number,
  hasRings: PropTypes.bool,
  hasMoons: PropTypes.bool,
  radius: PropTypes.number,
  sections: PropTypes.number,
  visible: PropTypes.bool,
  scale: PropTypes.number
}

export {
  ExoPlanet
}
