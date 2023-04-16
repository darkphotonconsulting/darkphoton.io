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
import { jovianShader } from './shaders/PlanetMaterials.js'
// import { BufferGeometryUtils } from 'three/'

function JovianPlanet ({
  // position = [0, 0, 0],
  name = 'Damascus A',
  setState = () => { return null },
  appState = {},
  rotation = [0, 0, 0],
  orbitalAnimation = true,
  orbitalDistance = 150,
  orbitalSpeedFactor = 125,
  ringed = false,
  atmosphereColor = new THREE.Color(1, 1, 1),
  landColor = '#540E06',
  waterColor = '#1A4564',
  color = '#540E06',
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
    const time = 10.0 + (state.clock.getElapsedTime() * 0.005)
    materialRef.current.uniforms.color.value = new THREE.Color(color)
    materialRef.current.uniforms.time.value += time
    materialRef.current.uniforms.speed.value = 0.001
    materialRef.current.uniforms.density.value = 0.003
    materialRef.current.uniforms.strength.value = 0.01
    materialRef.current.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
    materialRef.current.uniforms.height.value = 3.25
    materialRef.current.uniforms.lacunarity.value = 1.25
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
  geom.updateMatrix()
  geom.computeVertexNormals()
  geom.computeTangents()

  // eslint-disable-next-line no-unused-vars
  const JovianMaterial = shaderMaterial(
    jovianShader.uniforms,
    jovianShader.vertexShader,
    jovianShader.fragmentShader
  )
  extend({ JovianMaterial })
  return (
    <group
      name={'splash-planet'}
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
        <jovianMaterial
          attach={'material'}
          ref={materialRef}
          color={'#6D6761'}
          landColor={'#540E06'}
          waterColor={'#1A4564'}
          atmosphereColor={'#C6D8E5'}
        />
      </mesh>
    </group>
  )
}

JovianPlanet.propTypes = {
  // position: PropTypes.array,
  name: PropTypes.string,
  setState: PropTypes.func,
  appState: PropTypes.object,
  rotation: PropTypes.array,
  orbitalAnimation: PropTypes.bool,
  orbitalDistance: PropTypes.number,
  orbitalSpeedFactor: PropTypes.number,
  jovian: PropTypes.bool,
  ringed: PropTypes.bool,
  landColor: PropTypes.object,
  atmosphereColor: PropTypes.object,
  waterColor: PropTypes.object,
  color: PropTypes.object,
  radius: PropTypes.number,
  sections: PropTypes.number,
  visible: PropTypes.bool,
  scale: PropTypes.number
}

export {
  JovianPlanet
}
