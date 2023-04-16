import glsl from 'babel-plugin-glsl/macro'
import * as THREE from 'three'

const terrestrialShader = {
  // float H, float lacunarity, float frequency, float octaves, float offset, float gain
  uniforms: {
    time: 0,
    resolution: new THREE.Vector2(
      4096,
      4096
    ),
    speed: 0.1,
    density: 5,
    strength: 0.2,
    distortionStrength: 0.02,
    distortionFrequency: 0.5,
    distortionAmplitude: 0.5,
    distortionDensity: 5,
    distortionSpeed: 0.1,
    frequency: 0.5,
    amplitude: 0.5,
    lacunarity: 2.0,
    color: new THREE.Color(1, 1, 1),
    landColor: new THREE.Color(5.0, 0.0, 0.0),
    waterColor: new THREE.Color(28.0, 88.0, 115.0),
    height: 1.0,
    octaves: 10.0,
    offset: 1.0,
    gain: 0.5
  },
  vertexShader: glsl`
    precision mediump float;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vDistort;
    varying vec3 vPosition;
    uniform float distortionStrength;
    uniform float distortionFrequency;
    uniform float distortionAmplitude;
    uniform float distortionDensity;
    uniform float distortionSpeed;
    uniform vec2 resolution;
    uniform vec3 color;
    uniform vec3 landColor;
    uniform vec3 waterColor;
    uniform float time;
    uniform float speed;
    uniform float density;
    uniform float strength;
    uniform float frequency;
    uniform float amplitude;
    uniform float height;
    uniform float lacunarity;
    uniform float octaves;
    uniform float offset;
    uniform float gain;
    #pragma glslify: pnoise = require(glsl-noise/periodic/3d)
    #pragma glslify: rotateY = require(glsl-rotate/rotateY)
    void main() {
      float t = time * distortionSpeed;
      float distortion = pnoise((normal + t), vec3(10.0) * distortionDensity) * distortionStrength;
      vDistort = distortion;
      vPosition = position;
      vec3 distortPosition = position + (normal * distortion);
      float angle = sin(uv.x * distortionFrequency + t) * distortionAmplitude;
      distortPosition = rotateY(distortPosition, angle);
      vUv = uv;
      vNormal = normal ;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(distortPosition, 1.0);
      // temporarily disable distortion
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: glsl`
    #pragma glslify: snoise = require('glsl-noise/simplex/2d')
    precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    uniform vec3 color;
    uniform vec3 landColor;
    uniform vec3 waterColor;
    uniform float density;
    uniform float strength;
    uniform float frequency;
    uniform float amplitude;
    uniform float height;
    uniform float lacunarity;
    uniform float octaves;
    uniform float offset;
    uniform float gain;
    varying float vDistort;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    #pragma glslify: snoise = require(glsl-noise/simplex/2d)

    float noisePattern(vec2 point, float scale) {
      float noise = 0.0;
      return noise * scale;
    }

    vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
    }
    // https://www.shadertoy.com/view/4sXXW2
    float fBmA(vec2 point, float H, float lacunarity, float frequency, float octaves) {
      float value = 0.0;
      float remainder = 0.0;
      float pwrHL = pow(lacunarity, -H);
      float pwr = 1.0;

      /* inner loop of fractal construction */
      for (int i=0; i<65535; i++) {
        value += snoise(point * frequency) * pwr;
        pwr *= pwrHL;
        point *= lacunarity;

        if (i==int(octaves)-1) break;
      }

      remainder = octaves - floor(octaves);
      if (remainder != 0.0) {
        value += remainder * snoise(point * frequency) * pwr;
      }

      return value;
    }

    float multifractalA(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
      float value = 1.0;
      float rmd = 0.0;
      float pwHL = pow(lacunarity, -H);
      float pwr = 1.0;

      /* inner loop of fractal construction */
      for (int i=0; i<65535; i++) {
        value *= pwr * snoise(point*frequency) + offset;
        pwr *= pwHL;
        point *= lacunarity;

        if (i==int(octaves)-1) break;
      }

      rmd = octaves - floor(octaves);
      if (rmd != 0.0) value += (rmd * snoise(point*frequency) * pwr);

      return value;
    }

    float heteroTerrainA(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
      float value, increment, remainder;
       float pwrHL = pow(lacunarity, -H);
       float pwr = pwrHL; /* starts with i=1 instead of 0 */

       value = offset + snoise(point * frequency);
       point *= lacunarity;

       for (int i=1; i<65535; i++) {
         increment = (snoise(point * frequency) + offset) * pwr * value;
         // frequency *= lacunarity;
         value += increment;
         point *= lacunarity;

         if (i==int(octaves)) break;
       }

       /* take care of remainder in 'octaves'  */
       remainder = mod(octaves, floor(octaves));

       if (remainder != 0.0) {
         increment = (snoise(point * frequency) + offset) * pwr * value;
         value += remainder * increment;
       }

       return value;
     }

     float fBm(vec2 point, float H, float lacunarity, float frequency, float octaves) {
       float value = 0.0;
       float rmd = 0.0;
       float pwHL = pow(lacunarity, -H);
       float pwr = pwHL;

       for (int i=0; i<65535; i++)
       {
         value += snoise(point * frequency) * pwr;
         point *= lacunarity;
         pwr *= pwHL;
         if (i==int(octaves)-1) break;
       }

       rmd = octaves - floor(octaves);
       if (rmd != 0.0) value += rmd * snoise(point * frequency) * pwr;

       return value;
     }

     // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
     float multifractal(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
       float value = 1.0;
       float rmd = 0.0;
       float pwHL = pow(lacunarity, -H);
       float pwr = pwHL;

       for (int i=0; i<65535; i++)
       {
         value *= pwr*snoise(point*frequency) + offset;
         point *= lacunarity;
         pwr *= pwHL;
         if (i==int(octaves)-1) break;
       }

       rmd = octaves - floor(octaves);
       if (rmd != 0.0) value += (rmd * snoise(point*frequency) * pwr);

       return value;
     }

     // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
     float heteroTerrain(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
       float value = 1.;
       float increment = 0.;
       float rmd = 0.;
       float pwHL = pow(lacunarity, -H);
       float pwr = pwHL;

       value = pwr*(offset + snoise(point * frequency));
       point *= lacunarity;
       pwr *= pwHL;

       for (int i=1; i<65535; i++)
       {
         increment = (snoise(point * frequency) + offset) * pwr * value;
         value += increment;
         point *= lacunarity;
         pwr *= pwHL;
         if (i==int(octaves)) break;
       }

       rmd = mod(octaves, floor(octaves));
       if (rmd != 0.0) value += rmd * ((snoise(point * frequency) + offset) * pwr * value);

       return value;
     }

     // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
     float hybridMultiFractal(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
       float value = 1.0;
       float signal = 0.0;
       float rmd = 0.0;
       float pwHL = pow(lacunarity, -H);
       float pwr = pwHL;
       float weight = 0.;
       value = pwr*(snoise(point * frequency)+offset);
       weight = value;
       point *= lacunarity;
       pwr *= pwHL;

       for (int i=1; i<65535; i++)
       {
         weight = weight>1. ? 1. : weight;
         signal = pwr * (snoise(point*frequency) + offset);
         value += weight*signal;
         weight *= signal;
         pwr *= pwHL;
         point *= lacunarity;
         if (i==int(octaves)-1) break;
       }
       rmd = octaves - floor(octaves);
       if (rmd != 0.0) value += (rmd * snoise(point*frequency) * pwr);

       return value;
     }

     float ridgedMultiFractal(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset, float gain) {
       float value = 1.0;
       float signal = 0.0;
       float pwHL = pow(lacunarity, -H);
       float pwr = pwHL;
       float weight = 0.;

       /* get first octave of function */
       signal = snoise(point * frequency);
       signal = offset-abs(signal);
       signal *= signal;
       value = signal * pwr;
       weight = 1.0;
       pwr *= pwHL;

       /* spectral construction inner loop, where the fractal is built */
       for (int i=1; i<65535; i++)
       {
         point *= lacunarity;
         weight = clamp(signal*gain, 0.,1.);
         signal = snoise(point * frequency);
         signal = offset-abs(signal);
         signal *= signal;
         signal *= weight;
         value += signal * pwr;
         pwr *= pwHL;
         if (i==int(octaves)-1) break;
       }

       return value;
     }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      float aspectRatio = resolution.x / resolution.y;
      vec2 norm = 2.0 * uv - 1.0;
      norm.x *= aspectRatio;
      float r = length(norm) / 1.0 ;
      float phi = atan(norm.y, norm.x);
      r = 2.0 * asin(r) / 3.1415;
      vec2 coordinate = vec2(r * cos(phi), r * sin(phi));
      coordinate = coordinate + 0.5;
      vec2 q = 2.*uv-1.;
      q.y = q.y<0.?1.+q.y:q.y;
      q *= 2.;
      float mask = -9.;
      vec3 brightness = vec3(0.5, 0.5, 0.5);
      vec3 contrast = vec3(0.5, 0.5, 0.5);
      vec3 oscilation = vec3(1.0, 1.0, 1.0);
      vec3 phase = vec3(0.0, 0.1, 0.2);
      float distort = vDistort * density;
      vec3 col = cosPalette(distort, brightness, contrast, oscilation, phase);
      float mfrac = multifractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float terrain = heteroTerrain(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float hybrid = hybridMultiFractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float ridged = ridgedMultiFractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset, gain);

      // position works better than gl_FragCoord
      if (vPosition.x < 0.198) {
        // vec2 point, float H, float lacunarity, float frequency, float octaves
        mask = fBm(vec2(vPosition.x, vPosition.y), 1., 2.0, 5., 10.);
      }

      if (vPosition.x > 0.198 && vPosition.x < 0.396) {
        // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
        mask = multifractal(vec2(vPosition.x, vPosition.y), 1., 2., 5., 10., 0.5);
      }
      if (vPosition.x > 0.4 && vPosition.x < 0.594) {
        // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
        mask = heteroTerrain(vec2(vPosition.x, vPosition.y), 1., 2., 5., 10., 0.5);
      }
      if (vPosition.x > 0.594 && vPosition.x < 0.792) {
        // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
        mask = hybridMultiFractal(vec2(vPosition.x, vPosition.y), 1., 3., 5., 10.0, 0.05);
      }
      if (vPosition.x > 0.792) {
        // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset, float gain
        mask = ridgedMultiFractal(vec2(vPosition.x, vPosition.y), 5., 2., 5., 10., 0.9, 1.5);
      }

      if (mask < -9.9) {
        discard;
      }
      vec3 clampedFragment = vec3(
        clamp(ridged, 0., 1.),
        clamp(-ridged, 0., 1.),
        clamp(-ridged, 0., 1.)
      );

      vec3 fragment = vec3(
        ridged
      );
      float noise = snoise(vec2( vPosition.x, vPosition.y ) * 0.1);
      if (fragment.x > 0.5) {
        vec3 col = waterColor * 5.5;
        // col = mix(col, waterColor, smoothstep(0.0, 0.18, noise));
        gl_FragColor = vec4(col, 1.);
      } else {
        vec3 col = landColor / 5.5;
        col = mix(col, landColor, smoothstep(0.0, 0.8, noise));
        gl_FragColor = vec4(col, 1.);
      }
    }
  `
}

const jovianShader = {
  uniforms: {
    time: 0,
    resolution: new THREE.Vector2(4096, 4096),
    speed: 0.1,
    density: 5,
    strength: 0.2,
    distortionStrength: 0.02,
    distortionFrequency: 0.5,
    distortionAmplitude: 0.5,
    distortionDensity: 5,
    distortionSpeed: 0.1,
    frequency: 0.5,
    amplitude: 0.5,
    lacunarity: 2.0,
    color: new THREE.Color(1, 1, 1),
    landColor: new THREE.Color('#545454'),
    waterColor: new THREE.Color('#C6D8E5'),
    height: 1.0,
    octaves: 10.0,
    offset: 1.0,
    gain: 0.5
  },
  vertexShader: glsl`
    uniform float time;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix*normal);
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      // gl_Position = vec4(position, 1.0);
      // return vec4(position, 1.0);
    }
  `,
  fragmentShader: glsl`
    #pragma glslify: snoise = require(glsl-noise/simplex/2d)
    #pragma glslify: rotation3d = require(glsl-rotate/rotation-3d)
    #pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
    #define PI 3.1415926535897932384626433832795
    #define TAU (2.0 * PI)
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform vec3 color;
    uniform vec3 landColor;
    uniform vec3 waterColor;
    uniform float density;
    uniform float strength;
    uniform float frequency;
    uniform float amplitude;
    uniform float height;
    uniform float lacunarity;
    uniform float octaves;
    uniform float offset;
    uniform float gain;
    varying float vDistort;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    // varying vec3 vNormal;

    vec4 hash44(vec4 p4) {
        p4 *= vec4(0.1031, 0.1030, 0.0973, 0.1099);
        p4  = fract(p4);
        p4 += dot(p4, p4.wzxy+33.33);
        return fract( (p4.xxyz+p4.yzzw)*p4.zywx );
    }

    float noisePattern(vec2 point, float scale) {
      float noise = 0.0;
      return noise * scale;
    }

    vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
    }
    // https://www.shadertoy.com/view/4sXXW2
    float fBmA(vec2 point, float H, float lacunarity, float frequency, float octaves) {
      float value = 0.0;
      float remainder = 0.0;
      float pwrHL = pow(lacunarity, -H);
      float pwr = 1.0;

      /* inner loop of fractal construction */
      for (int i=0; i<65535; i++) {
        value += snoise(point * frequency) * pwr;
        pwr *= pwrHL;
        point *= lacunarity;

        if (i==int(octaves)-1) break;
      }

      remainder = octaves - floor(octaves);
      if (remainder != 0.0) {
        value += remainder * snoise(point * frequency) * pwr;
      }

      return value;
    }

    float multifractalA(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
      float value = 1.0;
      float rmd = 0.0;
      float pwHL = pow(lacunarity, -H);
      float pwr = 1.0;

      /* inner loop of fractal construction */
      for (int i=0; i<65535; i++) {
        value *= pwr * snoise(point*frequency) + offset;
        pwr *= pwHL;
        point *= lacunarity;

        if (i==int(octaves)-1) break;
      }

      rmd = octaves - floor(octaves);
      if (rmd != 0.0) value += (rmd * snoise(point*frequency) * pwr);

      return value;
    }

    float heteroTerrainA(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
      float value, increment, remainder;
      float pwrHL = pow(lacunarity, -H);
      float pwr = pwrHL; /* starts with i=1 instead of 0 */

      value = offset + snoise(point * frequency);
      point *= lacunarity;

      for (int i=1; i<65535; i++) {
        increment = (snoise(point * frequency) + offset) * pwr * value;
        // frequency *= lacunarity;
        value += increment;
        point *= lacunarity;

        if (i==int(octaves)) break;
      }

      /* take care of remainder in 'octaves'  */
      remainder = mod(octaves, floor(octaves));

      if (remainder != 0.0) {
        increment = (snoise(point * frequency) + offset) * pwr * value;
        value += remainder * increment;
      }

      return value;
    }

    float fBm(vec2 point, float H, float lacunarity, float frequency, float octaves) {
      float value = 0.0;
      float rmd = 0.0;
      float pwHL = pow(lacunarity, -H);
      float pwr = pwHL;

      for (int i=0; i<65535; i++)
      {
        value += snoise(point * frequency) * pwr;
        point *= lacunarity;
        pwr *= pwHL;
        if (i==int(octaves)-1) break;
      }

      rmd = octaves - floor(octaves);
      if (rmd != 0.0) value += rmd * snoise(point * frequency) * pwr;

      return value;
    }

    // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
    float multifractal(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
      float value = 1.0;
      float rmd = 0.0;
      float pwHL = pow(lacunarity, -H);
      float pwr = pwHL;

      for (int i=0; i<65535; i++)
      {
        value *= pwr*snoise(point*frequency) + offset;
        point *= lacunarity;
        pwr *= pwHL;
        if (i==int(octaves)-1) break;
      }

      rmd = octaves - floor(octaves);
      if (rmd != 0.0) value += (rmd * snoise(point*frequency) * pwr);

      return value;
    }

    // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
    float heteroTerrain(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
      float value = 1.;
      float increment = 0.;
      float rmd = 0.;
      float pwHL = pow(lacunarity, -H);
      float pwr = pwHL;

      value = pwr*(offset + snoise(point * frequency));
      point *= lacunarity;
      pwr *= pwHL;

      for (int i=1; i<65535; i++)
      {
        increment = (snoise(point * frequency) + offset) * pwr * value;
        value += increment;
        point *= lacunarity;
        pwr *= pwHL;
        if (i==int(octaves)) break;
      }

      rmd = mod(octaves, floor(octaves));
      if (rmd != 0.0) value += rmd * ((snoise(point * frequency) + offset) * pwr * value);

      return value;
    }

    // vec2 point, float H, float lacunarity, float frequency, float octaves, float offset
    float hybridMultiFractal(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset) {
      float value = 1.0;
      float signal = 0.0;
      float rmd = 0.0;
      float pwHL = pow(lacunarity, -H);
      float pwr = pwHL;
      float weight = 0.;
      value = pwr*(snoise(point * frequency)+offset);
      weight = value;
      point *= lacunarity;
      pwr *= pwHL;

      for (int i=1; i<65535; i++)
      {
        weight = weight>1. ? 1. : weight;
        signal = pwr * (snoise(point*frequency) + offset);
        value += weight*signal;
        weight *= signal;
        pwr *= pwHL;
        point *= lacunarity;
        if (i==int(octaves)-1) break;
      }
      rmd = octaves - floor(octaves);
      if (rmd != 0.0) value += (rmd * snoise(point*frequency) * pwr);

      return value;
    }

    float ridgedMultiFractal(vec2 point, float H, float lacunarity, float frequency, float octaves, float offset, float gain) {
      float value = 1.0;
      float signal = 0.0;
      float pwHL = pow(lacunarity, -H);
      float pwr = pwHL;
      float weight = 0.;

      /* get first octave of function */
      signal = snoise(point * frequency);
      signal = offset-abs(signal);
      signal *= signal;
      value = signal * pwr;
      weight = 1.0;
      pwr *= pwHL;

      /* spectral construction inner loop, where the fractal is built */
      for (int i=1; i<65535; i++)
      {
        point *= lacunarity;
        weight = clamp(signal*gain, 0.,1.);
        signal = snoise(point * frequency);
        signal = offset-abs(signal);
        signal *= signal;
        signal *= weight;
        value += signal * pwr;
        pwr *= pwHL;
        if (i==int(octaves)-1) break;
      }

      return value;
    }

    float hash( float n ) {
      return fract(sin(n)*123.456789);
    }

    float fbm ( vec2 uv, int octaves, float scale, float time, float freq, float amp) {
      // create band pattern
      uv = 1. - scale * uv;
      // uv.x += abs(cos(1. - scale));
      uv.x *= 2.71828;
      // this removes the seam from this sphere.
      uv.x = atan(uv.x);
      uv.y = asin(uv.y);
      // uv.y += pow(scale, 2.);
      // uv.y += cos(uv.y);
      float value = 0.;
      float amplitude = amp;
      float frequency = freq;
      for (int i = 0; i < octaves; i++) {
        frequency += freq;
        amplitude *= amp;
        // value += snoise(vec2(cos(uv.x) * frequency, sin(uv.y) * frequency + scale ));
        value += snoise(vec2(cos(uv.x+scale) * frequency, sin(uv.y) * frequency) + time) * amplitude;
      }
      //
      return clamp(value, 0., 1.);
    }

    float mixedNoise (vec3 pos) {
      vec3 floorPos = floor(pos);
      vec3 fractPos = fract(pos);
      vec3 mixedPos = fractPos * fractPos * (3.0 - 2.0 * fractPos);
      vec3 fractMutatedPos = fractPos * fractPos * (3.0 - 2.0 * fractPos);
      float n = fractMutatedPos.x + fractMutatedPos.y * 157.0 + 113. * fractMutatedPos.z;
      return mix(
        mix(
          mix(dot(fractMutatedPos, vec3(0.0, 1.0, 0.0)),
            dot(fractMutatedPos - vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)), fractMutatedPos.x),
          mix(dot(fractMutatedPos - vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0)),
            dot(fractMutatedPos - vec3(1.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0)), fractMutatedPos.x), fractMutatedPos.y),
          mix(mix(dot(fractMutatedPos, vec3(0.0, 1.0, 0.0)),
            dot(fractMutatedPos - vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)), fractMutatedPos.x),
          mix(dot(fractMutatedPos - vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0)),
            dot(fractMutatedPos - vec3(1.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0)), fractMutatedPos.x), fractMutatedPos.y), fractMutatedPos.z) * 2.0 - 1.0;
    }

    highp float random (vec2 st) {
      // return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
      highp float a = 12.9898;
      highp float b = 78.233;
      highp float c = 43758.5453;
      highp float dt = dot(st.xy ,vec2(a,b));
      highp float sn = mod(dt,3.14);
      return fract(sin(sn) * c);
    }

    float randomNoise (vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      vec2 u = f*f*(3.0-2.0*f);
      return clamp(mix( mix( random( i + vec2(0.0,0.0) ),
                       random( i + vec2(1.0,0.0) ), u.x),
                  mix( random( i + vec2(0.0,1.0) ),
                       random( i + vec2(1.0,1.0) ), u.x), u.y), 0., 1.);
    }

    mat2 rotate2d(float angle) {
      return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }

    float lines (vec2 pos, float b) {
      float scale = 10.;
      pos *= scale;
      return smoothstep(
        0.0,
        -.5+b*.5,
        abs((sin(pos.x*3.1415)+b*2.0))*.5
      );
    }

    vec3 hsl2rgb(vec3 hsl) {
      vec3 rgb = clamp(
        abs(
          mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0
        ) - 1.0,
        0.0,
        1.0
      );
      rgb = mix(
        vec3(1.0),
        rgb,
        hsl.y
      );
      rgb = mix(
        vec3(0.5),
        rgb,
        hsl.z
      );
      return rgb;
    }

    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 p = gl_FragCoord.xy / resolution.xy;
      // p.y *= resolution.y / resolution.x;
      // vec2 pos = p.yx*vec2(3., 7.);
      // float pattern = pos.x;
      // pos += rotate2d(
      //   randomNoise(pos)
      // ) * pos.yx;

      // pattern = lines(pos, .5);

      float mfrac = multifractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float terrain = heteroTerrain(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float hybrid = hybridMultiFractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float ridged = ridgedMultiFractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset, gain);

      float fbmNoise = fbm(gl_FragCoord.xy, 25, 15.5, time, 1.777, 0.333);
      float x = mixedNoise(vec3(
        sin(vNormal.x)
      ));
      float y = mixedNoise(vec3(
        cos(vPosition.y)
      ));
      float z = mixedNoise(vec3(
        cos(vPosition.z) * sin(vPosition.z)
      ));
      float mnoise = mixedNoise(
        vec3(
          x,
          y * sin(time * 0.00005) * terrain,
          // (cos(y*1.025) * sin(y*1.333)) + (terrain*(time * 0.0005)),
          // (y * 1.25) * clamp( sin(terrain*(time * 0.00007)) , 0.1, 1.),
          z
        )
      );
      float turbulence = abs( mnoise );
      turbulence *= abs(mixedNoise(
        vec3(
          x,
          y  * cos(time * 0.00002) * terrain,
          // y * clamp((terrain*(time * 0.0009)), 0.5, 3.5),
          z+0.3
        )
      ));
      vec3 ncolor = mix(
        color,
        landColor,
        turbulence
      );
      gl_FragColor = vec4(
        0., 0., 0., 1.
      );
      gl_FragColor += vec4(
        mix(
          smoothstep(
            color / vec3(0.2, 0.3, 0.4),
            color,
            vec3(turbulence)
          ),
          smoothstep(
            landColor / vec3(0.2, 0.3, 0.4),
            landColor,
            vec3(0.3)
          ),
          turbulence
        ),
        // vec3(
        //   turbulence,
        //   turbulence,
        //   turbulence
        // ),
        1.
      );
    }
  `
}

const exoPlanetShader = {
  uniforms: {
    time: 0,
    resolution: new THREE.Vector2(4096, 4096),
    seedValue: 25.3,
    bandScale: 3,
    distortionStrength: 0.02,
    distortionFrequency: 0.5,
    distortionAmplitude: 0.5,
    distortionDensity: 5,
    distortionSpeed: 0.1
  },
  vertexShader: glsl`
  precision mediump float;
  // attribute vec3 position;
  // attribute vec3 normal;
  // attribute vec2 uv;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vDistort;
  varying vec3 vPosition;
  varying vec3 eyeVector;
  uniform vec2 resolution;
  uniform float time;
  uniform float bandScale;
  uniform float distortionStrength;
  uniform float distortionFrequency;
  uniform float distortionAmplitude;
  uniform float distortionDensity;
  uniform float distortionSpeed;

  #pragma glslify: pnoise = require(glsl-noise/periodic/3d)
  #pragma glslify: rotateY = require(glsl-rotate/rotateY)
  void main() {
    float t = time * distortionSpeed;
    float distortion = pnoise((normal + t), vec3(10.0) * distortionDensity) * distortionStrength;
    vDistort = distortion;
    vPosition = position;
    vec3 distortPosition = position + (normal * distortion);
    float angle = sin(uv.x * distortionFrequency + t) * distortionAmplitude;
    distortPosition = rotateY(distortPosition, angle);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    vUv = uv;
    vNormal = normal ;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(distortPosition, 1.0);
    // temporarily disable distortion
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: glsl`
  precision mediump float;

  uniform vec2 resolution;
  // uniform vec2 u_mouse;
  uniform float time;
  uniform float bandScale;
  uniform float seedValue;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 eyeVector;


  const float tau = 6.283185;

  // mat3 transpose(in mat3 m) {
  //     vec3 i0 = m[0];
  //     vec3 i1 = m[1];
  //     vec3 i2 = m[2];

  //     return mat3(
  //       vec3(i0.x, i1.x, i2.x),
  //       vec3(i0.y, i1.y, i2.y),
  //       vec3(i0.z, i1.z, i2.z)
  //     );
  // }

  // mat4 transpose(in mat4 m) {
  //     vec4 i0 = m[0];
  //     vec4 i1 = m[1];
  //     vec4 i2 = m[2];
  //     vec4 i3 = m[3];

  //     return mat4(
  //       vec4(i0.x, i1.x, i2.x, i3.x),
  //       vec4(i0.y, i1.y, i2.y, i3.y),
  //       vec4(i0.z, i1.z, i2.z, i3.z),
  //       vec4(i0.w, i1.w, i2.w, i3.w)
  //     );
  // }

  // float det(mat2 matrix) {
  //     return matrix[0].x * matrix[1].y - matrix[0].y * matrix[1].x;
  // }

  // mat3 inverse(mat3 matrix) {
  //     vec3 row0 = matrix[0];
  //     vec3 row1 = matrix[1];
  //     vec3 row2 = matrix[2];

  //     vec3 minors0 = vec3(
  //         det(mat2(row1.y, row1.z, row2.y, row2.z)),
  //         det(mat2(row1.z, row1.x, row2.z, row2.x)),
  //         det(mat2(row1.x, row1.y, row2.x, row2.y))
  //     );
  //     vec3 minors1 = vec3(
  //         det(mat2(row2.y, row2.z, row0.y, row0.z)),
  //         det(mat2(row2.z, row2.x, row0.z, row0.x)),
  //         det(mat2(row2.x, row2.y, row0.x, row0.y))
  //     );
  //     vec3 minors2 = vec3(
  //         det(mat2(row0.y, row0.z, row1.y, row1.z)),
  //         det(mat2(row0.z, row0.x, row1.z, row1.x)),
  //         det(mat2(row0.x, row0.y, row1.x, row1.y))
  //     );

  //     mat3 adj = transpose(mat3(minors0, minors1, minors2));
  //     // mat3 adj = mat3(minors0, minors1, minors2);

  //     return (1.0 / dot(row0, minors0)) * adj;
  // }

  float hash1(float p) {
      p = fract(p * .1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
  }

  float hash1(float p, float q) {
      vec3 p3  = fract(vec3(p, q, p) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
  }

  vec2 hash2(float p) {
      vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.xx+p3.yz)*p3.zy);
  }

  vec2 hash2(float p, float q) {
      vec3 p3 = fract(vec3(p, q, p) * vec3(.1031, .1030, .0973));
      p3 += dot(p3, p3.yzx+33.33);
      return fract((p3.xx+p3.yz)*p3.zy);
  }

  vec3 hash3(float p) {
      vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
      p3 += dot(p3, p3.yzx+33.33);
      return fract((p3.xxy+p3.yzz)*p3.zyx);
  }

  vec3 hash3(vec3 p3) {
      p3 = fract(p3 * vec3(.1031, .1030, .0973));
      p3 += dot(p3, p3.yxz+33.33);
      return fract((p3.xxy + p3.yxx)*p3.zyx);
  }

  vec4 hash4(float p) {
      vec4 p4 = fract(vec4(p) * vec4(.1031, .1030, .0973, .1099));
      p4 += dot(p4, p4.wzxy+33.33);
      return fract((p4.xxyz+p4.yzzw)*p4.zywx);
  }

  float noise1(float p) {
      float i = floor(p);
      float f = fract(p);
      float u = f * f * (3.0 - 2.0 * f);
      return 1.0 - 2.0 * mix(hash1(i), hash1(i + 1.0), u);
  }

  vec3 noise3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);
      return 1.0 - 2.0 * mix(mix(mix(hash3(i + vec3(0.0, 0.0, 0.0)),
                                  hash3(i + vec3(1.0, 0.0, 0.0)), u.x),
                              mix(hash3(i + vec3(0.0, 1.0, 0.0)),
                                  hash3(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
                          mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)),
                                  hash3(i + vec3(1.0, 0.0, 1.0)), u.x),
                              mix(hash3(i + vec3(0.0, 1.0, 1.0)),
                                  hash3(i + vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
  }

  float fbm1(float p) {
      float f = noise1(p); p = 2.0 * p;
      f += 0.5 * noise1(p); p = 2.0 * p;
      f += 0.25 * noise1(p); p = 2.0 * p;
      f += 0.125 * noise1(p); p = 2.0 * p;
      f += 0.0625 * noise1(p);
      return f / 1.9375;
  }

  const mat3 m = mat3( 0.51162, -1.54702,  1.15972,
                      -1.70666, -0.92510, -0.48114,
                       0.90858, -0.86654, -1.55678);

  vec3 fbm3(vec3 p) {
      vec3 f = noise3(p); p = m * p;
      f += 0.5 * noise3(p); p = m * p;
      f += 0.25 * noise3(p); p = m * p;
      f += 0.125 * noise3(p); p = m * p;
      f += 0.0625 * noise3(p);
      return f / 1.9375;
  }

  vec3 uniform3(float seed) {
      vec2 hash = hash2(seed);
      float x = 2.0 * hash.x - 1.0;
      float r = sqrt(1.0 - x * x);
      float t = tau * hash.y;
      return vec3(x, r * sin(t), r * cos(t));
  }

  vec3 hsv(float hue, float sat, float val) {
      return (val) * (vec3(1.0 - (sat)) + (sat) * (0.5 + 0.5 * cos(6.2831853 * (vec3(hue) + vec3(0.0, 0.33, 0.67)))));
  }

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                          -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));

      vec3 m = max(
        0.5 - vec3(
          dot(x0,x0),
          dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)
        ),
        0.0
      );
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
  }

  void main() {
      float slowTime = time * 0.00025;
      float seedTime = time * 0.00025 * seedValue;
      vec3 norm = vNormal;
      vec2 uv = vPosition.xy;
      float seed = floor(seedValue) + 1.;
      vec3 center = vec3(0.);
      float s = 2. * fract(seedValue);
      float powerS = s * s;
      powerS = s * s;
      powerS = s * s;
      powerS = s * s;
      center += s * powerS * vec3(
          1.,
          3.,
          0.
      );
      // switching the fractional component to a static value vs. time this locks the turbulence
      vec3 eye = center + vec3(0.0, -5.0, 0.0) + fract(slowTime) * vec3(1.0, 1.0, 0.0);
      eye = vPosition * 0.5;
      float zoom = 3.;
      vec3 forward = normalize(center - eye);
      vec3 right = normalize(cross(forward, vec3(0.0, 0.0, 1.0)));
      vec3 up = cross(right, forward);
      vec2 xy = bandScale * gl_FragCoord.xy - resolution.xy;
      vec3 ray = normalize(xy.x * right + xy.y * up + zoom * forward * resolution.y);
      vec3 light = uniform3(seed);
      vec3 pole = uniform3(seed + 0.1);
      float dist = 1. + 1.2 * hash1(seed);
      eye *= dist;
      vec2 bandHash = hash2(seed + 0.2);
      float bandScale = 1.0 + 6.0 * bandHash.x;
      float bandTurbulence = 0.1 * pow(bandHash.x, 2.);
      vec4 planetHash = hash4(seed + 0.3);
      vec3 planetColor = hsv(
        planetHash.x,
        0.5,
        0.5 + 0.2 * planetHash.y
      );
      vec3 planetMinorX = hsv(
        planetHash.x, 0.3, 0.5 + 0.2 * planetHash.y + 0.3 * planetHash.w
      ) - planetColor;
      vec3 planetMinorY = hsv(planetHash.x + 0.4 * planetHash.z, 0.5, 0.5 + 0.2 * planetHash.y
      ) - planetColor;
      vec3 planetMinorZ = hsv(planetHash.x + 0.4 * planetHash.z, 0.3, 0.5 + 0.2 * planetHash.y - 0.4 * planetHash.w
      ) - planetColor;
      float b = dot(eye, ray);
      float c = dot(eye, eye);
      float h = b * b - c;
      float hit = step(0.0, h);
      h = max(h, 0.0);
      float illumination = max(dot(norm, light), 0.0);
      float depth = -b - sqrt(h);
      vec3 pos = eye + depth * ray;
      // vec3 pos = depth * ray;
      vec3 poleX = normalize(cross(pole, vec3(0.0, 0.0, 1.0)));
      vec3 poleY = cross(pole, poleX);
      mat3 rot = inverse(mat3(pole, poleX, poleY));
      vec3 p = rot * pos ;
      p += bandTurbulence * ( slowTime * 0.025 ) * fbm3(10.0 * p);
      vec3 bands = fbm3(
          bandScale * vec3(1.0, 0.05, 0.05) * p + seed
      );
      vec3 color = planetColor;
      // color *= hit * illumination;
      color += planetMinorY * bands.y;
      color += planetMinorX * bands.x;
      color += planetMinorZ * bands.z;

      gl_FragColor = vec4(
        color,
        1.
      );
  }
  `
}

export {
  terrestrialShader,
  jovianShader,
  exoPlanetShader
}
