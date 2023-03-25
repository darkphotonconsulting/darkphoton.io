import glsl from 'babel-plugin-glsl/macro'
import * as THREE from 'three'

const outerShader = {
  uniforms: {
    time: 0,
    color: new THREE.Color('0x000000'),
    resolution: new THREE.Vector4(),
    uvRate: new THREE.Vector2(1, 1)
  },
  fragmentShader: glsl`
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 eyeVector;
  float PI = 3.14159265358;
  attribute vec3 barycentric;
  varying vec3 vBarycentric;
  void main() {
    vBarycentric = barycentric;
    vUv = uv;
    vPosition = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    vNormal = normalize(normalMatrix*normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  vertexShader: glsl`
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 eyeVector;
  varying vec3 vBarycentric;
  float PI = 3.14159265358;
  uniform float time;
  void main () {
    float width = 0.5;
    vec3 change = fwidth(vBarycentric);
    vec3 step = smoothstep(
      change*(width+0.5),
      change*(width-0.5),
      vBarycentric
    );
    float line = max(step.x, max(step.y, step.z));
    if (line<0.1) discard;
    gl_FragColor.rgba = vec4(vec3(line), 1.0);
    gl_FragColor.rgb = vec3(1., 0., 0.);
  }
  `
}

const panelTexture = new THREE.TextureLoader().load('/gsfc.jpg')
panelTexture.wrapS = panelTexture.wrapT = THREE.MirroredRepeatWrapping
const panelShader = {
  uniforms: {
    time: 0,
    color: new THREE.Color('0x000000'),
    tex: panelTexture,
    resolution: new THREE.Vector4(),
    uvRate: new THREE.Vector2(1, 1)
  },
  fragmentShader: glsl`
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 eyeVector;
  float PI = 3.14159265358;
  void main() {
    vUv = uv;
    vPosition = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    vNormal = normalize(normalMatrix*normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  vertexShader: glsl`
  #define numberOfTextures 4
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 eyeVector;
  float PI = 3.14159265358;
  uniform float time;
  uniform sampler2D tex;
  // uniform sampler2D texList[numberOfTextures];

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

  // this implementation does not work well.
  // https://webglfundamentals.org/webgl/lessons/webgl-qna-how-to-bind-an-array-of-textures-to-a-webgl-shader-uniform-.html
  // vec4 getSampleFromArray(sampler2D texes[4], int ndx, vec2 uv) {
  //   vec4 color = vec4(0.);
  //   for (int i=0; i<numberOfTextures; ++i) {
  //     vec4 c = texture2D(texes[i], uv);
  //     if (i == ndx) {
  //       color += c;
  //     }
  //   }
  //   return color;
  // }

  void main() {
    // vec2 uv = gl_FragCoord.xy/vec2(1000.);
    vec3 xDerivative = dFdx(vNormal);
    vec3 yDerivative = dFdy(vNormal);
    vec3 crossNormal = normalize(cross(xDerivative, yDerivative));
    float diffuse = dot(crossNormal, vec3(1.));
    vec2 rand = hash22(vec2(floor(diffuse*20.)));
    vec2 uv = vec2(
      sign(rand.x - 0.5)*1. + (rand.x-0.5)*.6,
      sign(rand.y - 0.5)*1. + (rand.y-0.5)*.6
    )
    *gl_FragCoord.xy / vec2(1024., 1024.);
    vec3 refracted = refract(eyeVector, crossNormal, 0.5);
    uv += refracted.xy;
    // render texture per UV island
    vec4 textureColor = texture2D(tex, uv);
    gl_FragColor.rgba = textureColor;
  }
  `
}

export {
  panelShader,
  outerShader
}
