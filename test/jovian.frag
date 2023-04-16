// precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

const float PI = 3.141592653589793238;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 getAtmosphereColor(float height) {
  float h = clamp((height + 3000.0) / 50000.0, 0.0, 1.0);
  return mix(vec3(0.9, 0.8, 0.7), vec3(0.4, 0.2, 0.1), h);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;

  // Set the position of the sphere
  vec3 spherePos = vec3(0.0, 0.0, 0.0);

  // Set the radius of the sphere
  float sphereRadius = 50000.0;

  // Calculate the distance between the fragment and the sphere center
  float dist = length(spherePos - gl_FragCoord.xyz);

  // Calculate the normal vector of the sphere surface
  vec3 normal = normalize(gl_FragCoord.xyz - spherePos);

  // Calculate the angle between the normal and the view direction
  vec3 viewDir = normalize(vec3(st - 0.5, 1.0));
  float angle = max(dot(normal, viewDir), 0.0);

  // Calculate the height of the fragment above the surface of the sphere
  float height = dist - sphereRadius;

  // Set the colors for the atmosphere
  vec3 atmosphereColor = getAtmosphereColor(height);

  // Calculate the color of the fragment
  vec3 color = mix(atmosphereColor, vec3(0.7, 0.6, 0.5), pow(angle, 8.0));

  // Output the color of the fragment
  gl_FragColor = vec4(color, 1.0);
}
