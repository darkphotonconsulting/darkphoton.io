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
    void main() {
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
      return mix( mix( random( i + vec2(0.0,0.0) ),
                       random( i + vec2(1.0,0.0) ), u.x),
                  mix( random( i + vec2(0.0,1.0) ),
                       random( i + vec2(1.0,1.0) ), u.x), u.y);
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

    void main() {
      vec2 p = gl_FragCoord.xy / resolution.xy;
      p.y *= resolution.y / resolution.x;
      vec2 pos = p.yx*vec2(1., 1.);
      float pattern = pos.x;
      pos += rotate2d(
        randomNoise(pos)
      ) * pos.yx;

      // mat4 3dRotationalMatrix = rotation3d(
      //   vPosition.xyz,
      //   0.
      // ) ;
      pattern = lines(pos, .5);

      float mfrac = multifractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float terrain = heteroTerrain(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float hybrid = hybridMultiFractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset);
      float ridged = ridgedMultiFractal(vec2(vPosition.x, vPosition.y), height, lacunarity, frequency, octaves, offset, gain);

      float fbmNoise = fbm(gl_FragCoord.xy, 25, 15.5, time, 1.777, 0.333);
      float mnoise = mixedNoise(
        // vPosition
        vec3(
          cos(vUv.x * 3.1415),
          sin(vUv.y * 3.1415),
          1.0
        )
      );
      float turbulence = abs(
        mnoise
      ) * 0.1111 +
        abs(
          mixedNoise(
            vec3(
              cos(vUv.x * (3.1415 * 2.)),
              tan(vUv.y * (3.1415 * 2.)) ,
              1.
            )
          )
        ) * 0.3333 +
        abs(
          mixedNoise(
            vec3(
              cos(vUv.x * (3.1415 * 3.)),
              tan(vUv.y * (3.1415 * 3.)),
              1.
            )
          )
        ) * 0.6666;
      // vec3 noise = vec3(ridged);
      gl_FragColor = vec4(
        vec3(
          turbulence
        ), 1.
      );
    }
  `
}

export {
  terrestrialShader,
  jovianShader
}
