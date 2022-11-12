/* eslint-disable react/no-unknown-property */
import './Splash.css'
import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import {
  useThree,
  useFrame,
  useLoader,
  Canvas,
  extend
} from '@react-three/fiber'

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  Loader,
  Trail,
  Float,
  Stars,
  Sphere,
  Line,
  Billboard,
  OrbitControls,
  MeshDistortMaterial,
  PerspectiveCamera
  // Center
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

extend({ TextGeometry })

const lineResolution = 1000
const lineWidth = 0.1

/* prop types */

ParticleZoo.propTypes = {
  theme: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired
}

Particle.propTypes = {
  position: PropTypes.array,
  x: PropTypes.number,
  y: PropTypes.number,
  major: PropTypes.number,
  minor: PropTypes.number,
  segments: PropTypes.number,
  lineWidth: PropTypes.number,
  key: PropTypes.string,
  index: PropTypes.number,
  color: PropTypes.array
}

Splash.propTypes = {
  theme: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired
}

Nucleus.propTypes = {
  index: PropTypes.number,
  position: PropTypes.array,
  radius: PropTypes.number,
  sections: PropTypes.number,
  distortion: PropTypes.number,
  speed: PropTypes.number,
  color: PropTypes.array,
  emission: PropTypes.number
}

Electron.propTypes = {
  position: PropTypes.array,
  rotation: PropTypes.array,
  radius: PropTypes.number,
  buffer: PropTypes.number
}

Camera.propTypes = {
  position: PropTypes.array
}

Orbital.propTypes = {
  position: PropTypes.array,
  radius: PropTypes.number,
  buffer: PropTypes.number,
  color: PropTypes.array,
  count: PropTypes.number,
  width: PropTypes.number
}

SplashText.propTypes = {
  position: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  font: PropTypes.string,
  size: PropTypes.number,
  extrude: PropTypes.number
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
      minPolarAngle={-1 * Math.PI * 2}
      maxPolarAngle={Math.PI * 2}
      minAzimuthAngle={-1 * Math.PI * 2}
      maxAzimuthAngle={Math.PI * 2}
      {...props}
    />
  )
}

function Camera ({
  position = [-100, -100, -100],
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
      ref={groupRef}
    >
      <PerspectiveCamera
        ref={cameraRef}
        far={2500}
        near={0.001}
        fov={75}
        // makeDefault
        position={position}
        resolution={[window.innerWidth, window.innerHeight]}
        {...props}
      />
    </group>

  )
}

function Particle ({
  position = [0, 0, 0],
  x = 0,
  y = 0,
  major = 4,
  minor = 4,
  segments = 64,
  lineWidth = 0.2,
  key = 'foo',
  index = 0,
  color = [0.06274509803921569, 0.13333333333333333, 0.9333333333333333],
  ...props
}) {
  const points = React.useMemo(() => {
    return new THREE.EllipseCurve(
      0, 0,
      major, minor,
      0, 2 * Math.PI,
      false,
      0
    ).getPoints(1000)
  }, [])

  const groupRef = React.useRef(null)
  const particleSphereRef = React.useRef(null)
  const particlRingARef = React.useRef(null)
  const particleRingBRef = React.useRef(null)
  const particleRingCRef = React.useRef(null)
  const materialRef = React.useRef(null)
  const trailRef = React.useRef(null)
  // const primaryTextRef = React.useRef(null)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime() * 6
    trailRef.current.position.set(
      Math.sin(t) * major,
      (Math.cos(t) * major * Math.atan(t)) / Math.PI / 1.25,
      0
    )
  })
  return (
    <group key={`${index}-group`} ref={groupRef} position={position} {...props}>
        <Line key={`${index}-line-a`} ref={particlRingARef} worldUnits points={points} color={new THREE.Color(...color)} lineWidth={lineWidth} rotation={[-Math.PI / 2, 0, 0]}>
          <lineDashedMaterial
            attach='material'
            color={new THREE.Color(...color)}
          />
        </Line>
        <Line key={`${index}-line-b`} ref={particleRingBRef} worldUnits points={points} color={new THREE.Color(...color)} lineWidth={lineWidth} rotation={[0, Math.PI / 2, 0]} />
        <Line key={`${index}-line-c`} ref={particleRingCRef} worldUnits points={points} color={new THREE.Color(...color)} lineWidth={lineWidth} rotation={[0, 0, 0]} />
        <Sphere
          key={`${index}-sphere`}
          ref={particleSphereRef}
          args={[major / 2, segments, segments]}
        >
          <MeshDistortMaterial
            ref={materialRef}
            speed={3}
            distort={0.5}
            color={new THREE.Color(...color)}
            emissive={new THREE.Color(...color)}
            emissiveIntensity={0.4}
            clearcoat={1}
            side={THREE.DoubleSide}
            depthTest={true}
            depthWrite={true}
          />
        </Sphere>
        <Trail local width={5} length={6} color={new THREE.Color(2, 1, 10)} attenuation={(t) => t * t}>
            <mesh ref={trailRef}>
              <sphereGeometry args={[0.75, 64, 64]}/>
              <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
            </mesh>
        </Trail>
    </group>
  )
}

function Nucleus ({
  position = [0, 0, 0],
  radius = 5,
  sections = 64,
  index = 0,
  color = [0.06274509803921569, 0.13333333333333333, 0.9333333333333333],
  distortion = 0.2,
  speed = 3,
  emission = 0.4,
  ...props
}) {
  const groupRef = React.useRef(null)
  const nucleusRef = React.useRef(null)
  const materialRef = React.useRef(null)
  useFrame(() => {
    materialRef.current.color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    )
    materialRef.current.emissive = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    )
  })
  return (
    <group
      ref={groupRef}
      key={`${index}-nucleus-group`}
      position={position}
    >
      <Sphere
        ref={nucleusRef}
        key={`${index}-nucleus`}
        args={[radius, sections, sections]}
      >
        <MeshDistortMaterial
          ref={materialRef}
          speed={speed}
          distort={distortion}
          color={color}
          emissive={color}
          emissiveIntensity={emission}
          clearcoat={1}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={true}
          vertexColors={true}
        />
      </Sphere>
    </group>
  )
}

function Orbital ({
  position = [0, 0, 0],
  radius = 5,
  buffer = 0.30,
  color = [0.06274509803921569, 0.13333333333333333, 0.9333333333333333],
  count = 3,
  width = 0.02,
  ...props
}) {
  const points = React.useMemo(() => {
    return new THREE.EllipseCurve(
      0, 0,
      radius + (radius * buffer), radius + (radius * buffer),
      0, 2 * Math.PI,
      false,
      0
    ).getPoints(lineResolution)
  }, [])
  const groupRef = React.useRef(null)
  return (
    <group ref={groupRef} position={position}>
      {
        Object.keys(Array.from(Array(count))).map((i) => {
          return (
            <mesh key={`${i}-orbital-mesh`}>
              <Line
                key={`${i}-orbital-line`}
                worldUnits
                points={points}
                color={new THREE.Color(
                  color[0] + Math.random() * 0.1,
                  color[1] + Math.random() * 0.1,
                  color[2] + Math.random() * 0.1
                )}
                dashed={true}
                lineWidth={lineWidth}
                gapSize={0.1}
                dashSize={1}
                rotation={[
                  // rotates orbital lines "smoothly" around all axes
                  i % 2 === 0 ? Math.PI / i : -Math.PI / i,
                  i % 2 === 0 ? -Math.PI / i : Math.PI / i,
                  i % 2 === 0 ? Math.PI / i : 0
                ]}
              >
              </Line>
              <Electron
                key={`${i}-orbital-electron`}
                radius={radius}
                rotation={[
                  i % 2 === 0 ? Math.PI / i : -Math.PI / i,
                  i % 2 === 0 ? -Math.PI / i : Math.PI / i,
                  i % 2 === 0 ? Math.PI / i : 0
                ]}
              />
            </mesh>
          )
        })
      }
    </group>
  )
}

function Electron ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  radius = 5,
  buffer = 0.30,
  ...props
}) {
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.position.set(
      Math.sin(t) * (radius + (radius * buffer)),
      (Math.cos(t) * (radius + (radius * buffer)) * Math.atan(t)) / Math.PI / 1.25,
      0
    )
    materialRef.current.color = new THREE.Color(
      Math.sin(t) * 0.5 + 0.5,
      Math.cos(t) * 0.5 + 0.5,
      Math.sin(t) * 0.5 + 0.5
    )
  })
  const trailRef = React.useRef(null)
  const meshRef = React.useRef(null)
  const materialRef = React.useRef(null)
  return (
    <group position={position} rotation={rotation}>
      <Trail
        ref={trailRef}
        local
        width={5}
        length={6}
        color={new THREE.Color(2, 1, 10)}
        attenuation={(t) => t * t}
      >
        <mesh
          ref={meshRef}
        >
          <sphereGeometry
            args={
              [
                0.75,
                64,
                64
              ]
            }
          />
          <meshBasicMaterial
            ref={materialRef}
            color={
              [
                10,
                1,
                10
              ]
            }
            toneMapped={false}
          />
        </mesh>
      </Trail>
    </group>
  )
}

function SplashText ({
  position = [0, 0, 0],
  title = 'Dark Photon',
  subtitle = 'Engineering solutions for the stars',
  font = 'nasalization_regular',
  size = 15,
  extrude = 10,
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
    const center = titleRef.current.boundingBox.getCenter(new THREE.Vector3())
    // Math.sin(t) * major,
    // (Math.cos(t) * major * Math.atan(t)) / Math.PI / 1.25,
    // 0
    meshRef.current.position.set(
      // -center.x,
      Math.sin(t) * 150 - center.x,
      // -center.y,
      0,
      // -center.z
      // 0,
      Math.cos(t) * 150 - center.y
    )

    titleMaterialRef.current.color = new THREE.Color(
      Math.sin(t * 0.5) * 0.5 + 0.5,
      Math.sin(t * 0.3) * 0.5 + 0.5,
      Math.sin(t * 0.2) * 0.5 + 0.5
    )
    // console.log(titleMaterialRef)
  })
  return (
    <group
      ref={groupRef}
    >
      {/* <Center top bottom right front back left> */}
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
            color={
              new THREE.Color(
                Math.random(),
                Math.random(),
                Math.random()
              )
            }
          />
        </mesh>
      {/* </Center> */}
    </group>
  )
}

function ParticleZoo ({
  theme = {},
  state = {},
  setState = () => {},
  count = 1,
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const { scene } = useThree()
  useFrame((state, delta) => {
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
            const radius = Math.random() *
              (state.splash.limits.major[1] - state.splash.limits.major[0] + 1) + state.splash.limits.major[0]
            // const minor = Math.random() *
            //   (state.splash.limits.minor[1] - state.splash.limits.minor[0] + 1) + state.splash.limits.minor[0]

            return (
              // <Particle
              //   key={`space-sphere-${i}`}
              //   index={i}
              //   position={
              //     [
              //       x,
              //       y,
              //       z
              //     ]
              //   }
              //   x={x}
              //   y={y}
              //   major={major}
              //   minor={minor}
              //   color={[
              //     Math.random(),
              //     Math.random(),
              //     Math.random()
              //   ]}
              // />
              <group key={`zoo-group-${i}`}>
                <Nucleus
                  radius={radius}
                  distortion={0.8}
                  position={[x, y, z]}
                >
                </Nucleus>
                <Orbital
                    radius={radius}
                    position={[x, y, z]}
                />
                <Electron
                  radius={radius}
                  position={[x, y, z]}
                />
              </group>
            )
          })
        }
        <Particle/>
      </group>
  )
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
          dpr={window.devicePixelRatio}
          camera={{
            position: [500, 100, 100],
            rotation: [0, Math.PI * 2, Math.PI / 2]
          }}
        >
        <Navigation/>
        <Camera/>
        <color attach='background' args={[`${theme.palette.primary.dark}`]}/>
        <ambientLight
          intensity={10}
        />
          <Stars
            saturation={10}
            count={10000}
            speed={0.5}
            scale={1}
            noise={0.7}
            depth={500}
          />
          <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <ParticleZoo
            theme={theme}
            state={state}
            setState={setState}
            count={20}
          />
          <Billboard
              follow={false}
              lockX={false}
              lockY={false}
              lockZ={false}
          >
              <SplashText/>

          </Billboard>
          {/* <group>
            <Nucleus
              radius={10}
              distortion={0.8}
              position={[25, 25, 0]}
            >

            </Nucleus>
            <Orbital
                radius={15}
                position={[25, 25, 0]}
            />
            <Electron
              radius={15}
              position={[25, 25, 0]}
            />
          </group> */}
        </Float>

          {/* <primitive object={new THREE.AxesHelper(100)} /> */}

        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={0.1} radius={0.8} levels={10} />
        </EffectComposer>
        </Canvas>
        <Loader/>
      </React.Suspense>
    </div>

  )
}
