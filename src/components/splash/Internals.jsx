/* eslint-disable react/no-unknown-property */
import React from 'react'
import PropTypes from 'prop-types'
import { Observer } from './Observer.jsx'
import { Navigator } from './Navigator.jsx'
import * as THREE from 'three'
import {
  GizmoHelper,
  GizmoViewport
} from '@react-three/drei'
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
  axesGizmo = true,
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
      {axesGizmo && (
        <GizmoHelper
          alignment='bottom-right'
          margin={[80, 80]}
        >
          <GizmoViewport
            axisColors={[
              '#9d4b4b', '#2f7f4f', '#3b5b9d'
            ]}
            labelColor='white'
          />
        </GizmoHelper>
      )}
    </group>
  )
}

Internals.propTypes = {
  rfactor: PropTypes.number,
  observerPosition: PropTypes.array,
  observerRotation: PropTypes.array,
  observerOrthographic: PropTypes.bool,
  axesHelper: PropTypes.bool,
  gridHelper: PropTypes.bool,
  axesGizmo: PropTypes.bool
}

export {
  Internals
}
