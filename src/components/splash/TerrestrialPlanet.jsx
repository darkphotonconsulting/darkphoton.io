/* eslint-disable react/no-unknown-property */
import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'

import {
  extend,
  useFrame
  // useThree
} from '@react-three/fiber'

import {
  shaderMaterial
  // CubeCamera
} from '@react-three/drei'
import { terrestrialShader } from './shaders/PlanetMaterials.js'

function TerrestrialPlanet ({
  // position = [0, 0, 0],
  name = 'Terra Pretta',
  setState = () => { return null },
  appState = {},
  rotation = [0, 0, 0],
  orbitalAnimation = true,
  orbitalDistance = 150,
  orbitalSpeedFactor = 125,
  jovian = false,
  ringed = false,
  atmosphereColor = new THREE.Color(1, 1, 1),
  landColor = '#540E06',
  waterColor = '#1A4564',
  color = new THREE.Color(1, 1, 1),
  radius = 1,
  sections = 64,
  visible = true,
  scale = 1,
  ...props
}) {
  const position = [0, 0, 0]
  useFrame((state) => {
    const time = state.clock.getElapsedTime() / 55
    materialRef.current.uniforms.time.value = time
    materialRef.current.uniforms.speed.value = 0.001
    materialRef.current.uniforms.density.value = 0.003
    materialRef.current.uniforms.strength.value = 0.01
    materialRef.current.uniforms.distortionSpeed = 0.001
    materialRef.current.uniforms.distortionStrength.value = 0.01
    materialRef.current.uniforms.distortionFrequency.value = 0.05
    materialRef.current.uniforms.distortionAmplitude.value += 0.07
    materialRef.current.uniforms.landColor.value = new THREE.Color(landColor)
    materialRef.current.uniforms.waterColor.value = new THREE.Color(waterColor)
    if (appState.splash.scene.planets.orbit.animate) {
      const x = orbitalDistance * Math.sin(time * orbitalSpeedFactor)
      const z = orbitalDistance * Math.cos(time * orbitalSpeedFactor)
      meshRef.current.position.x = x
      meshRef.current.position.z = z
    }
  })
  const groupRef = React.useRef(null)
  const meshRef = React.useRef(null)
  const materialRef = React.useRef(null)
  const geom = new THREE.SphereGeometry(radius, sections, sections)
  const LandMaterial = shaderMaterial(
    terrestrialShader.uniforms,
    terrestrialShader.vertexShader,
    terrestrialShader.fragmentShader
  )
  extend({ LandMaterial })
  return (
    <group
      name={`planet-group-${name.replaceAll(/\s+/g, '').toLowerCase()}`}
      ref={groupRef}
      dispose={null}
      visible={visible}
      position={position}
      rotation={rotation}
    >
      <mesh
        name={`planet-mesh-${name.replaceAll(/\s+/g, '').toLowerCase()}`}
        castShadow
        receiveShadow
        ref={meshRef}
        scale={scale}
        geometry={geom}
        position={position}
        rotation={rotation}
      >
        <landMaterial
          name={`planet-material-${name.replaceAll(/\s+/g, '').toLowerCase()}`}
          ref={materialRef}
          attach='material'
          side={THREE.DoubleSide}
          color={landColor}
        />

      </mesh>
    </group>
  )
}

TerrestrialPlanet.propTypes = {
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
  TerrestrialPlanet
}
