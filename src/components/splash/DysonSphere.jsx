/* eslint-disable react/no-unknown-property */
import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import {
  extend
} from '@react-three/fiber'
import {
  shaderMaterial,
  CubeCamera
} from '@react-three/drei'
// import glsl from 'babel-plugin-glsl/macro'
// eslint-disable-next-line no-unused-vars
import { outerShader, panelShader } from './shaders/DysonSphereMaterials.js'

function DysonSphere ({
  position = [0, 0, 0],
  radius = 1,
  visible = true,
  ...props
}) {
  React.useEffect(() => {
    // console.log(panelShader.vertexShader)
    // console.log(panelShader.fragmentShader)
  })
  const groupRef = React.useRef(null)
  // const cubeCamRef = React.useRef(null)
  const texture = new THREE.TextureLoader().load('/gsfc.jpg')
  const outerTextureRef = React.useRef(null)
  const innerSphereRef = React.useRef(null)
  const outerSphereRef = React.useRef(null)
  const innerTextureRef = React.useRef(null)
  // const textures = ['/gsfc.jpg', '/milkyway.jpg', '/brazil.jpg'].map((path) => new THREE.TextureLoader().load(path))
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
  const dysonSphere = new THREE.IcosahedronGeometry(radius, 2)
  const outerSphere = new THREE.IcosahedronGeometry(radius, 2)
  const outerSphereLength = outerSphere.attributes.position.array.length
  const barycentrics = []
  for (let i = 0; i < outerSphereLength / 3; i++) {
    barycentrics.push(
      0, 0, 1,
      0, 1, 0,
      1, 0, 0
    )
  }
  const baryCoord = new Float32Array(barycentrics)
  outerSphere.setAttribute('barycentric', new THREE.BufferAttribute(baryCoord, 3))
  const OuterSphereMaterial = shaderMaterial(
    outerShader.uniforms,
    outerShader.fragmentShader,
    outerShader.vertexShader
  )
  const DysonSphereMaterial = shaderMaterial(
    panelShader.uniforms,
    panelShader.fragmentShader,
    panelShader.vertexShader
  )

  extend({ DysonSphereMaterial, OuterSphereMaterial })
  return (
    <group name={'splash-dyson'} ref={groupRef} visible={visible}>
      <CubeCamera>
        {(texture) => (
          <group>
            <mesh
              ref={outerSphereRef}
              geometry={dysonSphere}
            >
              {/* <icosahedronBufferGeometry args={[radius, 2]}/> */}
              <dysonSphereMaterial
                ref={outerTextureRef}
                wireframe={false}
              />
            </mesh>
            <mesh
              ref={innerSphereRef}
              geometry={outerSphere}
              >
              {/* <icosahedronBufferGeometry args={[radius, 2]}/> */}
              <outerSphereMaterial
                ref={innerTextureRef}
                alpha={0.1}
                wireframe={false}
                color={new THREE.Color(1, 1, 1)}
              />

            </mesh>
          </group>
        )}
      </CubeCamera>
    </group>
  )
}

DysonSphere.propTypes = {
  position: PropTypes.array,
  radius: PropTypes.number,
  visible: PropTypes.bool
}

export {
  DysonSphere
}
