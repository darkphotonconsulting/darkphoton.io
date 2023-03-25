import React from 'react'
import PropTypes from 'prop-types'
import {
  OrbitControls
} from '@react-three/drei'
import {
  useThree
} from '@react-three/fiber'
function Navigator ({
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  enableDamping = true,
  dampingFactor = 0.05,
  rotateSpeed = 0.5,
  ...props
}) {
  const {
    camera,
    gl:
    {
      domElement
    }
  } = useThree()

  return (
    <group
      name={'splash-navigator'}
      {...props}
    >
      <OrbitControls
        camera={camera}
        domElement={domElement}
        enableZoom={enableZoom}
        enablePan={enablePan}
        enableRotate={enableRotate}
        enableDamping={enableDamping}
        dampingFactor={dampingFactor}
        rotateSpeed={rotateSpeed}
        args={[camera, domElement]}
        {...props}
      />
    </group>

  )
}

Navigator.propTypes = {
  enableZoom: PropTypes.bool,
  enablePan: PropTypes.bool,
  enableRotate: PropTypes.bool,
  enableDamping: PropTypes.bool,
  dampingFactor: PropTypes.number,
  rotateSpeed: PropTypes.number
}

export {
  Navigator
}
