import React from 'react'
import PropTypes from 'prop-types'
import { useControls } from 'leva'

function ControlPad ({
  setState = () => { return null },
  state = {},
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const controls = useControls('mission-control', {
    animateOrbits: state.splash.scene.planets.orbit.animate,
    animateRotation: state.splash.scene.planets.rotation.animate,
    showTech: state.splash.scene.tech.visible,
    showStar: state.splash.scene.stars.visible,
    showPlanets: state.splash.scene.planets.visible,
    useBloom: false,
    useColorDepth: true
  })
  const groupRef = React.useRef(null)
  const meshRef = React.useRef(null)
  React.useEffect(() => {
    setState({
      ...state,
      splash: {
        ...state.splash,
        scene: {
          ...state.splash.scene,
          stars: {
            ...state.splash.scene.stars,
            visible: controls.showStar
          },
          tech: {
            ...state.splash.scene.tech,
            visible: controls.showTech
          },
          planets: {
            ...state.splash.scene.planets,
            visible: controls.showPlanets,
            orbit: {
              animate: controls.animateOrbits
            },
            rotation: {
              animate: controls.animateRotation
            }
          }
        },
        composer: {
          ...state.splash.composer,
          bloom: {
            ...state.splash.composer.bloom,
            enabled: controls.useBloom
          },
          colorDepth: {
            ...state.splash.composer.colorDepth,
            enabled: controls.useColorDepth
          }
        }
      }
    })
  }, [controls])
  return (
    <group
      name={'control-pad'}
      ref={groupRef}
    >
      <mesh
        ref={meshRef}
      >
      </mesh>
    </group>
  )
}

ControlPad.propTypes = {
  setState: PropTypes.func,
  state: PropTypes.object
}

export {
  ControlPad
}
