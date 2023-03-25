import glsl from 'babel-plugin-glsl/macro'
class Material {
  #uniforms

  #vertexShader = glsl`
    varying vec3 vUv;

    void main() {
      vUv = position;
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `
  get uniforms () {
    return this.#uniforms
  }

  constructor ({ uniforms = {} }) {
    this.#uniforms = uniforms
  }
}

export {
  Material
}
