/* eslint-disable react/no-unknown-property */
import React from 'react'
import PropTypes from 'prop-types'
import { Observer } from './Observer.jsx'
import { Navigator } from './Navigator.jsx'
import * as THREE from 'three'
import {
  useThree,
  useFrame
} from '@react-three/fiber'

function Internals ({
  rfactor = 0.01,
  observerPosition = [0, 0, -125],
  observerRotation = [0, 0, 0],
  observerOrthographic = false,
  axesHelper = true,
  gridHelper = false,
  ...props
}) {
  const {
    // eslint-disable-next-line no-unused-vars
    scene,
    gl
  } = useThree()
  const groupRef = React.useRef(null)
  useFrame((state) => {
    scene.rotation.y += rfactor
    gl.outputEncoding = THREE.sRGBEncoding
    gl.setPixelRatio(window.devicePixelRatio)
    gl.setSize(window.innerWidth, window.innerHeight)
    // console.log(gl)
  })
  return (
    <group
      name={'splash-internals'}
      ref={groupRef}
      {...props}
    >
      <Observer
        position={observerPosition}
        rotation={observerRotation}
        orthographic={observerOrthographic}
        {...props}
      />
      <Navigator/>
      {axesHelper && (<primitive object={new THREE.AxesHelper(175)} />)}
      {gridHelper && (<primitive object={new THREE.GridHelper(1000, 50)}/>)}
    </group>
  )
}

Internals.propTypes = {
  rfactor: PropTypes.number,
  observerPosition: PropTypes.array,
  observerRotation: PropTypes.array,
  observerOrthographic: PropTypes.bool,
  axesHelper: PropTypes.bool,
  gridHelper: PropTypes.bool
}

export {
  Internals
}
