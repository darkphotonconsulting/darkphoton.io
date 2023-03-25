/* eslint-disable react/no-unknown-property */
import './Splash.css'
import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
/*
  THREE.js loads beta libs in the examples folder and it feels bad 😒
*/
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import {
  // useThree,
  useFrame,
  useLoader,
  Canvas,
  extend
} from '@react-three/fiber'

// eslint-disable-next-line no-unused-vars
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  Loader,
  // Float,
  Stars,
  Billboard,
  // shaderMaterial,
  // CubeCamera,
  Center
} from '@react-three/drei'
// import {
//   EffectComposer,
//   Bloom,
//   ColorDepth
// } from '@react-three/postprocessing'
// import { BlendFunction } from 'postprocessing'
// eslint-disable-next-line no-unused-vars
import glsl from 'babel-plugin-glsl/macro'

// import { Observer } from './splash/Observer.jsx'
// import { Navigator } from './splash/Navigator.jsx'
import { Internals } from './splash/Internals.jsx'
import { ControlPad } from './splash/ControlPad.jsx'
import { Composer } from './splash/Composer.jsx'
// eslint-disable-next-line no-unused-vars
import { Star } from './splash/Star.jsx'
import { DysonSphere } from './splash/DysonSphere.jsx'
// eslint-disable-next-line no-unused-vars
import { TerrestrialPlanet } from './splash/TerrestrialPlanet.jsx'
import { JovianPlanet } from './splash/JovianPlanet.jsx'

extend({ TextGeometry })

function Words ({
  position = [0, 0, 0],
  title = 'Dark Photon',
  subtitle = 'Engineering solutions for the stars',
  font = 'nasalization_regular',
  size = 15,
  extrude = 10,
  visible = true,
  ...props
}) {
  const groupRef = React.useRef(null)
  const meshRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const titleMaterialRef = React.useRef(null)
  const titleFont = useLoader(FontLoader, `/fonts/${font}.typeface.json`)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    titleRef.current.computeBoundingBox()
    /* updates color of wording */
    titleMaterialRef.current.color = new THREE.Color(
      Math.sin(t * 0.5) * 0.5 + 0.5,
      Math.sin(t * 0.3) * 0.5 + 0.5,
      Math.sin(t * 0.2) * 0.5 + 0.5
    )
  })
  return (
    <group
      ref={groupRef}
      visible={visible}
    >
      {/* <Center top bottom right front back left> */}
        <Center top right>
          <Billboard>
            <mesh ref={meshRef}>
              <textGeometry
                ref={titleRef}
                args={
                  [
                    title,
                    {
                      font: titleFont,
                      size,
                      height: extrude
                    }
                  ]
                }
              />
              <meshPhysicalMaterial
                ref={titleMaterialRef}
                attach='material'
                wireframe={true}
                color={
                  new THREE.Color(
                    Math.random(),
                    Math.random(),
                    Math.random()
                  )
                }
              />
            </mesh>
          </Billboard>

        </Center>
      {/* </Center> */}
    </group>
  )
}

Words.propTypes = {
  position: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  font: PropTypes.string,
  size: PropTypes.number,
  extrude: PropTypes.number,
  visible: PropTypes.bool
}

export function Splash ({
  theme = {},
  state = {},
  visible = true,
  setState = () => {},
  ...props
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'

      }}
    >
      <React.Suspense fallback={null}>
        <Canvas
          hidden={state.splash.hidden}
          dpr={window.devicePixelRatio}
          camera={{
            position: [100, 100, 100],
            rotation: [0, Math.PI * 2, Math.PI / 2]
          }}
        >
        <Internals
          rfactor={0.01}
          observerPosition={[
            0, 0, -325
          ]}
          observerRotation={[
            0, 0, 0
          ]}
          observerOrthographic={true}
        />
        <ControlPad
          state={state}
          setState={setState}
          {...props}
        />

        <color
          attach='background'
          args={
            [new THREE.Color('#000000')]
          }
        />
        <pointLight
          position={
            [0, 0, 0]
          }
          color={new THREE.Color('#ffffff')}
          intensity={1}
        />
        <ambientLight
          color={new THREE.Color('#ffffff')}
          intensity={1.5}
        />
          <Stars
            saturation={10}
            count={10000}
            radius={500}
            speed={0.5}
            scale={1}
            noise={0.7}
            depth={500}
          />
        <Star
          position={[0, 0, 0]}
          radius={55}
          visible={state.splash.scene.stars.visible}
          />
        <TerrestrialPlanet
          setState={setState}
          appState={state}
          orbitalAnimation={true}
          orbitalDistance={150}
          orbitalSpeedFactor={125}
          rotation={[0, 0, 0]}
          radius={3}
          visible={state.splash.scene.planets.visible}
          resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)}
          color={new THREE.Color(0, 0, 0)}
        />
        <JovianPlanet
          setState={setState}
          appState={state}
          orbitalAnimation={true}
          orbitalDistance={220}
          orbitalSpeedFactor={15}
          rotation={[0, 0, 0]}
          radius={10}
          visible={state.splash.scene.planets.visible}
          resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)}
          color={'#632864'}
        />

        <DysonSphere
          position={[0, 0, 0]}
          radius={65}
          visible={state.splash.scene.tech.visible}
        />
        <Composer
          state={state}
          setState={setState}
          enableBloom={state.splash.composer.bloom.enabled}
          bloom={{
            luminanceThreshold: 0.1,
            luminanceSmoothing: 0.9,
            intensity: 0.9,
            radius: 0.9
          }}
          enableColorDepth={true}
          depth={{
            bits: 32,
            opacity: 0.9
          }}
          {...props}
        />
        {/* <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.1}
            radius={0.9}
            levels={10}
            blendFunction={BlendFunction.ADD}
          />
          <ColorDepth
            bits={32}
            opacity={0.9}
            blendFunction={BlendFunction.ADD}
          />
        </EffectComposer> */}
        </Canvas>
        <Loader/>
      </React.Suspense>
    </div>

  )
}

Splash.propTypes = {
  theme: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired
}
