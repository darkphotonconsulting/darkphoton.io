import React from 'react'
import PropTypes from 'prop-types'
import {
  useFrame
} from '@react-three/fiber'

import {
  PerspectiveCamera,
  OrthographicCamera
} from '@react-three/drei'

function Observer ({
  position = [0, 0, -125],
  rotation = [0, 0, 0],
  orthographic = false,
  ...props
}) {
  const groupRef = React.useRef(null)
  const cameraRef = React.useRef(null)
  useFrame((state, delata) => {
    cameraRef.current.updateProjectionMatrix()
    cameraRef.current.lookAt(0, 20, 0)
  })
  return (
    <group
      name={'splash-observer'}
      ref={groupRef}
    >
      {
        orthographic
          ? (
          <OrthographicCamera
            makeDefault
            ref={cameraRef}
            far={2500}
            near={0.001}
            fov={75}
            position={position}
            resolution={[window.innerWidth, window.innerHeight]}
            {...props}
          />
            )
          : (
          <PerspectiveCamera
            makeDefault
            ref={cameraRef}
            far={2500}
            near={0.001}
            fov={75}
            // makeDefault
            position={position}
            resolution={[window.innerWidth, window.innerHeight]}
            {...props}
          />
            )
      }
      {/* <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        far={2500}
        near={0.001}
        fov={75}
        // makeDefault
        position={position}
        resolution={[window.innerWidth, window.innerHeight]}
        {...props}
      /> */}
    </group>

  )
}

Observer.propTypes = {
  position: PropTypes.array,
  rotation: PropTypes.array,
  orthographic: PropTypes.bool
}

export {
  Observer
}
