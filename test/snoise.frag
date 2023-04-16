#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


const float tau = 6.283185;

mat3 transpose(in mat3 m) {
    vec3 i0 = m[0];
    vec3 i1 = m[1];
    vec3 i2 = m[2];

    return mat3(
                    vec3(i0.x, i1.x, i2.x),
                    vec3(i0.y, i1.y, i2.y),
                    vec3(i0.z, i1.z, i2.z)
                );
}

mat4 transpose(in mat4 m) {
    vec4 i0 = m[0];
    vec4 i1 = m[1];
    vec4 i2 = m[2];
    vec4 i3 = m[3];

    return mat4(
                    vec4(i0.x, i1.x, i2.x, i3.x),
                    vec4(i0.y, i1.y, i2.y, i3.y),
                    vec4(i0.z, i1.z, i2.z, i3.z),
                    vec4(i0.w, i1.w, i2.w, i3.w)
                );
}

float det(mat2 matrix) {
    return matrix[0].x * matrix[1].y - matrix[0].y * matrix[1].x;
}
mat3 inverse(mat3 matrix) {
    vec3 row0 = matrix[0];
    vec3 row1 = matrix[1];
    vec3 row2 = matrix[2];

    vec3 minors0 = vec3(
        det(mat2(row1.y, row1.z, row2.y, row2.z)),
        det(mat2(row1.z, row1.x, row2.z, row2.x)),
        det(mat2(row1.x, row1.y, row2.x, row2.y))
    );
    vec3 minors1 = vec3(
        det(mat2(row2.y, row2.z, row0.y, row0.z)),
        det(mat2(row2.z, row2.x, row0.z, row0.x)),
        det(mat2(row2.x, row2.y, row0.x, row0.y))
    );
    vec3 minors2 = vec3(
        det(mat2(row0.y, row0.z, row1.y, row1.z)),
        det(mat2(row0.z, row0.x, row1.z, row1.x)),
        det(mat2(row0.x, row0.y, row1.x, row1.y))
    );

    mat3 adj = transpose(mat3(minors0, minors1, minors2));
    // mat3 adj = mat3(minors0, minors1, minors2);

    return (1.0 / dot(row0, minors0)) * adj;
}

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
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    float seed = floor(u_time) + 1.0;
    vec3 center = vec3(0.);
    float s = 2.0 * fract(u_time) - 1.;
    float powerS = s * s;
    powerS = s * s;
    powerS = s * s;
    powerS = s * s;
    center += s * powerS * vec3(1., 3., 0.);
    vec3 eye = center + vec3(0.0, -5.0, 0.0) + fract(u_time) * vec3(1.0, 1.0, 0.0);
    float zoom = 3.;
    vec3 forward = normalize(center - eye);
    vec3 right = normalize(cross(forward, vec3(0.0, 0.0, 1.0)));
    vec3 up = cross(right, forward);
    vec2 xy = 2.0 * gl_FragCoord.xy - u_resolution.xy;
    vec3 ray = normalize(xy.x * right + xy.y * up + zoom * forward * u_resolution.y);
    vec3 light = uniform3(seed);
    vec3 pole = uniform3(seed + 0.1);
    float dist = 1.0 + 1.2 * hash1(seed);
    eye *= dist;
    vec2 bandHash = hash2(seed + 0.2);
    float bandScale = 1.0 + 6.0 * bandHash.x;
    float bandTurbulence = 0.1 * pow(bandHash.y, 2.);
    vec4 planetHash = hash4(seed* 0.1 + 0.3);
    vec3 planetColor = hsv(planetHash.x, 0.5, 0.5 + 0.2 * planetHash.y);
    vec3 planetMinorX = hsv(planetHash.x, 0.3, 0.5 + 0.2 * planetHash.y + 0.3 * planetHash.w) - planetColor;
    vec3 planetMinorY = hsv(planetHash.x + 0.4 * planetHash.z, 0.5, 0.5 + 0.2 * planetHash.y) - planetColor;
    vec3 planetMinorZ = hsv(planetHash.x + 0.4 * planetHash.z, 0.3, 0.5 + 0.2 * planetHash.y - 0.4 * planetHash.w) - planetColor;

    float b = dot(eye, ray);
    float c = dot(eye, eye);
    float h = b * b - c;
    float hit = step(0.0, h);
    h = max(h, 0.0);
    float depth = -b - sqrt(h);
    vec3 pos = eye + depth * ray;
    vec3 poleX = normalize(cross(pole, vec3(0.0, 0.0, 1.0)));
    vec3 poleY = cross(pole, poleX);
    mat3 rot = inverse(mat3(pole, poleX, poleY));
    vec3 p = rot * pos;
    // p = rot * vec3(gl_FragCoord.xy / u_resolution.xy, 0.0);
    //p.x = asin(p.x); // Latitude bands
    p += bandTurbulence * fbm3(10.0 * p);

    vec3 bands = fbm3(bandScale * vec3(1.0, 0.05, 0.05) * p + seed);
    vec3 color = planetColor;
    color += planetMinorX * bands.x;
    // color += planetMinorY;
    color += planetMinorY * bands.y;
    color += planetMinorZ * bands.z;

    float DF = 0.0;

    // Add a random position
    // float a = 0.0;
    // vec2 vel = vec2(u_time*.1);
    // DF += snoise(pos+vel)*.25+.25;

    // Add a random position
    // a = snoise(pos*vec2(cos(u_time*0.15),sin(u_time*0.1))*0.1)*3.1415;
    // vel = vec2(cos(a),sin(a));
    // DF += snoise(pos+vel)*.25+.25;

    // color = vec3(
    //   smoothstep(
    //     .7,
    //     .75,
    //     fract(
    //       DF
    //     )
    //   ),
    //   smoothstep(
    //     .7,
    //     .75,
    //     fract(
    //       DF+0.333
    //     )
    //   ),
    //   smoothstep(
    //     .7,
    //     .75,
    //     fract(
    //       DF+0.666
    //     )
    //   )
    // );

    gl_FragColor = vec4(
      vec3(b),
      1.0
    );
}