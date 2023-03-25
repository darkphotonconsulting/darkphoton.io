/* eslint-disable react/no-unknown-property */
import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import {
  useThree,
  useFrame,
  extend
} from '@react-three/fiber'
// import glsl from 'babel-plugin-glsl/macro'
// eslint-disable-next-line no-unused-vars
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  shaderMaterial,
  CubeCamera
} from '@react-three/drei'

import { parallaxShader, convectionShader } from './shaders/StarMaterials.js'

function Star ({
  position = [0, 0, 0],
  radius = 1,
  sections = 64,
  visible = true,
  ...props
}) {
  const groupRef = React.useRef(null)
  const meshRef = React.useRef(null)
  const geometryRef = React.useRef(null)
  const materialRef = React.useRef(null)
  const parallaxMaterialRef = React.useRef(null)
  const StarPerlinNoiseMaterial = shaderMaterial(
    convectionShader.uniforms,
    convectionShader.fragmentShader,
    convectionShader.vertexShader
  )
  const StarParallaxMaterial = shaderMaterial(
    parallaxShader.uniforms,
    parallaxShader.fragmentShader,
    parallaxShader.vertexShader
  )
  extend({ StarPerlinNoiseMaterial, StarParallaxMaterial })
  // eslint-disable-next-line no-unused-vars
  const { gl, size } = useThree()
  useFrame((state) => {
    // const time = state.clock.getElapsedTime()
    materialRef.current.uniforms.time.value += 0.05
    parallaxMaterialRef.current.uniforms.time.value += 0.05
  })
  return (
    <group
      name={'splash-star'}
      ref={groupRef}
      position={position}
      visible={visible}
    >
      <mesh
        ref={meshRef}
      >
        <sphereBufferGeometry
          ref={geometryRef}
          attach='geometry'
          args={
            [
              radius,
              sections,
              sections
            ]
          }
        />
        <starPerlinNoiseMaterial
          ref={materialRef}
          attach='material'
          color={new THREE.Color('#FFFFFF')}
          time={0}
          side={THREE.DoubleSide}
        />
      </mesh>
        <CubeCamera
          near={0.1}
          far={100}
        >
          {(texture) => (
              <mesh
                castShadow
              >
                <sphereBufferGeometry
                  attach='geometry'
                  args={
                    [
                      radius + (radius * 0.1),
                      sections,
                      sections
                    ]
                  }
                />
                <starParallaxMaterial
                  ref={parallaxMaterialRef}
                  attach='material'
                  color={new THREE.Color('#FFFFFF')}
                  time={10}
                  side={THREE.FrontSide}
                  perlin={
                    texture
                  }
                />
              </mesh>
          )}
        </CubeCamera>
    </group>
  )
}

Star.propTypes = {
  position: PropTypes.array,
  radius: PropTypes.number,
  sections: PropTypes.number,
  visible: PropTypes.bool
}

export {
  Star
}
