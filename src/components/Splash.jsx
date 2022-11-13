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
  shaderMaterial,
  PerspectiveCamera,
  CubeCamera
  // Center
} from '@react-three/drei'
import { EffectComposer, Bloom, ColorDepth } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
// eslint-disable-next-line no-unused-vars
import glsl from 'babel-plugin-glsl/macro'
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

Star.propTypes = {
  position: PropTypes.array,
  radius: PropTypes.number,
  sections: PropTypes.number
}

DysonSphere.propTypes = {
  position: PropTypes.array,
  radius: PropTypes.number
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

Internals.propTypes = {
  rfactor: PropTypes.number
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

function Internals ({
  rfactor = 0.01,
  ...props
}) {
  const { scene, gl } = useThree()
  useFrame((state) => {
    scene.rotation.y += 0.001
    gl.outputEncoding = THREE.sRGBEncoding
  })
  return (
    <group>
      <Camera/>
      <Navigation/>
    </group>
  )
}

function Star ({
  position = [0, 0, 0],
  radius = 1,
  sections = 64,
  ...props
}) {
  const groupRef = React.useRef(null)
  const meshRef = React.useRef(null)
  const geometryRef = React.useRef(null)
  const materialRef = React.useRef(null)
  const parallaxMaterialRef = React.useRef(null)
  const StarPerlinNoiseMaterial = shaderMaterial(
    {
      time: 0,
      color: new THREE.Color(0xffffff)
    },
    glsl`
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        // ignore the compiler error
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    glsl`
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;
      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      float mod289(float x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }

      float permute(float x) {
        return mod289(((x*34.0)+1.0)*x);
      }

      vec4 taylorInvSqrt(vec4 r)  {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      float taylorInvSqrt(float r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      vec4 grad4(float j, vec4 ip) {
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p,s;

        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

        return p;
      }

      // (sqrt(5) - 1)/4 = F4, used once below
      #define F4 0.309016994374947451

      float snoise(vec4 v) {
        const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
        0.276393202250021,  // 2 * G4
        0.414589803375032,  // 3 * G4
        -0.447213595499958); // -1 + 4 * G4

        // First corner
        vec4 i  = floor(v + dot(v, vec4(F4)) );
        vec4 x0 = v -   i + dot(i, C.xxxx);

        // Other corners

        // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
        vec4 i0;
        vec3 isX = step( x0.yzw, x0.xxx );
        vec3 isYZ = step( x0.zww, x0.yyz );
        //  i0.x = dot( isX, vec3( 1.0 ) );
        i0.x = isX.x + isX.y + isX.z;
        i0.yzw = 1.0 - isX;
        //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
        i0.y += isYZ.x + isYZ.y;
        i0.zw += 1.0 - isYZ.xy;
        i0.z += isYZ.z;
        i0.w += 1.0 - isYZ.z;

        // i0 now contains the unique values 0,1,2,3 in each channel
        vec4 i3 = clamp( i0, 0.0, 1.0 );
        vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
        vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

        //  x0 = x0 - 0.0 + 0.0 * C.xxxx
        //  x1 = x0 - i1  + 1.0 * C.xxxx
        //  x2 = x0 - i2  + 2.0 * C.xxxx
        //  x3 = x0 - i3  + 3.0 * C.xxxx
        //  x4 = x0 - 1.0 + 4.0 * C.xxxx
        vec4 x1 = x0 - i1 + C.xxxx;
        vec4 x2 = x0 - i2 + C.yyyy;
        vec4 x3 = x0 - i3 + C.zzzz;
        vec4 x4 = x0 + C.wwww;

        // Permutations
        i = mod289(i);
        float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
        vec4 j1 = permute( permute( permute( permute (
        i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
        + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
        + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
        + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

        // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
        // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
        vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

        vec4 p0 = grad4(j0,   ip);
        vec4 p1 = grad4(j1.x, ip);
        vec4 p2 = grad4(j1.y, ip);
        vec4 p3 = grad4(j1.z, ip);
        vec4 p4 = grad4(j1.w, ip);

        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        p4 *= taylorInvSqrt(dot(p4,p4));

        // Mix contributions from the five corners
        vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
        vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
        m0 = m0 * m0;
        m1 = m1 * m1;
        return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
        + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

      }

      float fbm(vec4 p) {
        float sum = 0.;
        float amp = 1.;
        float scale = 1.;
        for (int i=0; i<6; i++) {
          sum += snoise(p*scale)*amp;
          p.w += 100.;
          amp *= 0.9;
          scale *= 2.;
        }
        return sum;
      }

      void main() {
        vec4 p  = vec4(vPosition / 25., time * 0.05);
        float noisy = fbm(p);
        vec4 p1  = vec4(vPosition / 15., time * 0.05);
        float spots = max(snoise(p1), 0.0);
        gl_FragColor.rgba = vec4(noisy * mix(1., spots, 0.7));
      }
    `
  )
  const StarParallaxMaterial = shaderMaterial(
    {
      perlin: null,
      time: 0,
      resolution: new THREE.Vector4()
    },
    glsl`
      #pragma vscode_glsllint_stage : frag
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 eyeVector;
      float PI = 3.14159265358;

      void main() {
        // ignore compiler error
        vUv = uv;
        vPosition = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        eyeVector = normalize(worldPosition.xyz - cameraPosition);
        vNormal = normalize(normalMatrix*normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    glsl`
      uniform float time;
      uniform float resolution;
      uniform samplerCube perlin;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        // gl_FragColor = vec4(1., 1., 1., 1.0);
        gl_FragColor = textureCube(perlin, vPosition);
      }
    `
  )
  extend({ StarPerlinNoiseMaterial, StarParallaxMaterial })
  // eslint-disable-next-line no-unused-vars
  const { gl, size } = useThree()
  useFrame(() => {
    materialRef.current.uniforms.time.value += 0.05
    // console.log(parallaxMaterialRef.current)
    // parallax layer
    // parallaxMaterial.uniforms.perlin = parallaxRenderTarget.texture
    // gl.render(parallaxScene, parallaxCamera)
  })
  return (
    <group
      ref={groupRef}
      position={position}
      visible={true}
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
          color={new THREE.Color('#000000')}
          time={10}
          side={THREE.DoubleSide}
        />
      </mesh>
        <CubeCamera
          near={0.1}
          far={1000}
        >
          {(texture) => (
              <mesh>
                <sphereBufferGeometry
                  attach='geometry'
                  args={
                    [
                      radius,
                      sections,
                      sections
                    ]
                  }
                />
                <starParallaxMaterial
                  ref={parallaxMaterialRef}
                  attach='material'
                  color={new THREE.Color('#000000')}
                  time={10}
                  side={THREE.DoubleSide}
                  perlin={
                    texture
                  }
                />
                {/* <meshStandardMaterial
                  attach='material'
                  color={new THREE.Color('#000000')}
                /> */}
              </mesh>
          )}
        </CubeCamera>
      {/* <mesh>
        <icosahedronBufferGeometry
          attach='geometry'
          args={
            [
              radius + radius * 0.5
            ]
          }
        />
        <meshPhysicalMaterial
          attach='material'
          color={new THREE.Color('#FB0101')}
          side={THREE.DoubleSide}
          opacity={0.5}
          // alphaTest={true}
          visible={false}
          alpha={0.5}
          transparent={false}
        />
      </mesh> */}
    </group>
  )
}

function DysonSphere ({
  position = [0, 0, 0],
  radius = 1,
  ...props
}) {
  const groupRef = React.useRef(null)
  // const cubeCamRef = React.useRef(null)
  const texture = new THREE.TextureLoader().load('/gsfc.jpg')
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
  const dysonSphere = new THREE.IcosahedronGeometry(radius, 2)
  const outerSphere = new THREE.IcosahedronGeometry(radius, 2)
  const outerSphereLength = outerSphere.attributes.position.array.length
  // console.log(outerSphereLength)
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
    {
      time: 0,
      color: new THREE.Color('#000000'),
      resolution: new THREE.Vector4(),
      uvRate: new THREE.Vector2(1, 1)
    },
    glsl`
      #pragma vscode_glsllint_stage : frag
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 eyeVector;
      float PI = 3.14159265358;
      attribute vec3 barycentric;
      varying vec3 vBarycentric;
      void main() {
        // ignore compiler error
        vBarycentric = barycentric;
        vUv = uv;
        vPosition = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        eyeVector = normalize(worldPosition.xyz - cameraPosition);
        vNormal = normalize(normalMatrix*normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    glsl`
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 eyeVector;
      varying vec3 vBarycentric;
      float PI = 3.14159265358;
      uniform float time;

      void main () {
        float width = 2.;
        vec3 change = fwidth(vBarycentric);
        vec3 step = smoothstep(
          change*(width+0.5),
          change*(width-0.5),
          vBarycentric
        );
        float line = max(step.x, max(step.y, step.z));
        if (line<0.1) discard;
        gl_FragColor.rgba = vec4(vec3(line), 1.0);
      }
    `
  )
  const DysonSphereMaterial = shaderMaterial(
    {
      time: 0,
      color: new THREE.Color('#000000'),
      tex: texture,
      resolution: new THREE.Vector4(),
      uvRate: new THREE.Vector2(2, 1)
    },
    glsl`
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 eyeVector;
      float PI = 3.14159265358;
      void main() {
        // ignore compiler error
        vUv = uv;
        vPosition = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        eyeVector = normalize(worldPosition.xyz - cameraPosition);
        vNormal = normalize(normalMatrix*normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    glsl`
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 eyeVector;
      float PI = 3.14159265358;
      uniform float time;
      uniform sampler2D tex;

      float hash12(vec2 p) {
        p = fract(p * vec2(5.3983, 5.4427));
          p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
        return fract(p.x * p.y * 95.4337);
      }

      vec2 hash22(vec2 p) {
        p = fract(p * vec2(5.3983, 5.4427));
          p += dot(p.yx, p.xy +  vec2(21.5351, 14.3137));
        return fract(vec2(p.x * p.y * 95.4337, p.x * p.y * 97.597));
      }

      void main() {

        // smooth UVs out
        vec3 xDerivative = dFdx(vNormal);
        vec3 yDerivative = dFdy(vNormal);
        vec3 crossNormal = normalize(cross(xDerivative, yDerivative));
        float diffuse = dot(crossNormal, vec3(1.));
        vec2 rand = hash22(vec2(floor(diffuse*20.)));

        // derive UV from view
        // vec2 uv = rand*gl_FragCoord.xy / vec2(1024., 1024.);
        vec2 uv = vec2(
          sign(rand.x - 0.5)*1. + (rand.x-0.5)*.6,
          sign(rand.y - 0.5)*1. + (rand.y-0.5)*.6
        )
        *gl_FragCoord.xy / vec2(1024., 1024.);
        vec3 refracted = refract(eyeVector, crossNormal, 0.5);
        uv += refracted.xy;
        // render texture per UV island
        vec4 textureColor = texture2D(tex, uv);

        // gl_FragColor.rgba = textureColor;
        gl_FragColor.rgba = textureColor;
      }
    `
  )
  extend({ DysonSphereMaterial, OuterSphereMaterial })
  return (
    <group ref={groupRef} visible={false}>
      <CubeCamera>
        {(texture) => (
          <group>
            <mesh
              geometry={dysonSphere}
            >
              {/* <icosahedronBufferGeometry args={[radius, 2]}/> */}
              <dysonSphereMaterial
                wireframe={false}
              />
            </mesh>
            <mesh
              geometry={outerSphere}
              >
              {/* <icosahedronBufferGeometry args={[radius, 2]}/> */}
              <outerSphereMaterial
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
        <Internals/>
        {/* <Navigation/> */}
        {/* <Camera/> */}
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
          <Float
            speed={4}
            rotationIntensity={1}
            floatIntensity={2}
          >
          <Star
            radius={55}
          />
          <DysonSphere
            radius={65}
          />
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
        </Float>

          {/* <primitive object={new THREE.AxesHelper(100)} /> */}

        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.1}
            radius={0.8}
            levels={10}
          />
          <ColorDepth
            bits={16}
            opacity={0.9}
            blendFunction={BlendFunction.MULTIPLY}
            // blendFunction={BlendFunction.COLOR_DODGE}
            // blendFunction={new THREE.}
          />
        </EffectComposer>
        </Canvas>
        <Loader/>
      </React.Suspense>
    </div>

  )
}
