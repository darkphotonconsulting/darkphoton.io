/* eslint-disable react/no-unknown-property */
import './Splash.css'
import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import {
  useThree,
  useFrame,
  Canvas
} from '@react-three/fiber'

import {
  Float,
  Stars,
  Sphere,
  Line,
  OrbitControls
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
SpaceSpheres.propTypes = {
  theme: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired
}

SpaceSphere.propTypes = {
  position: PropTypes.array,
  x: PropTypes.number,
  y: PropTypes.number,
  major: PropTypes.number,
  minor: PropTypes.number,
  segments: PropTypes.number,
  lineWidth: PropTypes.number
}

function Navigation ({
  ...props
}) {
  const { camera, gl: { domElement } } = useThree()

  return (
    <OrbitControls
      camera={camera}
      domElement={domElement}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
      {...props}
    />
  )
}
function SpaceSphere ({
  position = [0, 0, 0],
  x = 0,
  y = 0,
  major = 4,
  minor = 4,
  segments = 64,
  lineWidth = 0.2,
  ...props
}) {
  const points = React.useMemo(() => {
    console.log({
      event: 'memo',
      x,
      y,
      major,
      minor
    })
    return new THREE.EllipseCurve(
      0, 0,
      major, minor,
      0, 2 * Math.PI,
      false,
      0
    ).getPoints(1000)
  }, [])

  console.log({
    event: 'sphere',
    x,
    y,
    major,
    minor
  })

  return (
    <group {...props} position={position}>
        <Line worldUnits points={points} color={new THREE.Color('#D0ABDE')} lineWidth={lineWidth} rotation={[-Math.PI / 2, 0, 0]} />
        <Line worldUnits points={points} color={new THREE.Color('#8A808E')} lineWidth={lineWidth} rotation={[0, Math.PI / 2, 0]} />
        <Line worldUnits points={points} color={new THREE.Color('#290637')} lineWidth={lineWidth} rotation={[0, 0, 0]} />
        <Sphere
          args={[major / 2, segments, segments]}
        >
          <meshBasicMaterial color={[16, 0.7, 2]} toneMapped={false}/>
          {/* <Line worldUnits points={points} color={new THREE.Color('#290637')} lineWidth={lineWidth} position={position}/> */}
        </Sphere>
    </group>
  )
}

function SpaceSpheres ({
  theme = {},
  state = {},
  setState = () => {},
  count = 1,
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const { scene } = useThree()
  // const points = React.useMemo(() => {
  //   return new THREE.EllipseCurve(
  //     0, 0, // ax, aY
  //     3, 1.15, // xRadius, yRadius
  //     0, 2 * Math.PI, // aStartAngle, aEndAngle
  //     false, // aClockwise
  //     0 // aRotation
  //   ).getPoints(100)
  // }, [])
  useFrame((state, delta) => {
    // if (scene) {
    //   console.log(scene)
    // }
  })
  return (
      <group {...props}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {
          Object.keys(Array.from(Array(count - 1))).map((i) => {
            /*  calculate random positions & sizes for spheres */
            const x = Math.random() *
              (state.splash.limits.x[1] - state.splash.limits.x[0] + 1) + state.splash.limits.x[0]
            const y = Math.random() *
              (state.splash.limits.y[1] - state.splash.limits.y[0] + 1) + state.splash.limits.y[0]
            const z = Math.random() *
              (state.splash.limits.z[1] - state.splash.limits.z[0] + 1) + state.splash.limits.z[0]
            const major = Math.random() *
              (state.splash.limits.major[1] - state.splash.limits.major[0] + 1) + state.splash.limits.major[0]
            const minor = Math.random() *
              (state.splash.limits.minor[1] - state.splash.limits.minor[0] + 1) + state.splash.limits.minor[0]
            console.log({
              event: 'splash.sphere',
              x,
              y,
              z,
              major,
              minor
            })
            return (
              <SpaceSphere
                key={`space-sphere-${i}`}
                position={
                  [
                    x,
                    y,
                    z
                  ]
                }
                x={x}
                y={y}
                major={major}
                minor={minor}
              />
            )
          })
        }
        <SpaceSphere/>
          {/* <Line worldUnits points={points} color={new THREE.Color('#5E0980')} lineWidth={0.2} />
          <Line worldUnits points={points} color={new THREE.Color('#5E0980')} lineWidth={0.2} rotation={[0, 0, 1]}/>
          <Line worldUnits points={points} color={new THREE.Color('#5E0980')} lineWidth={0.2} rotation={[0, 0, -1]}/>
          <Sphere args={[0.55, 64, 64]}>
            <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false}/>
          </Sphere> */}

      </group>
  )
}

Splash.propTypes = {
  theme: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired
}

export function Splash ({
  theme = {},
  state = {},
  setState = () => {},
  ...props
}) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh'

      }}
    >
      <React.Suspense fallback={null}>
        <Canvas
          hidden={state.splash.hidden}
          colorManagement={true}
          dpr={window.devicePixelRatio}
          camera={{
            position: [1, 3, 10]
          }}
        >
        <color attach='background' args={[`${theme.palette.primary.dark}`]}/>
        <Navigation/>
        <Stars
          saturation={0}
          count={400}
          speed={0.5}
        />
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <SpaceSpheres
            theme={theme}
            state={state}
            setState={setState}
            count={3}
          />
        </Float>

        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
        </EffectComposer>
        </Canvas>
      </React.Suspense>
    </div>

  )
}
