import React from 'react'
import PropTypes from 'prop-types'

import {
  EffectComposer,
  Bloom,
  ColorDepth
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

function Composer ({
  state = {},
  setState = () => {},
  enableBloom = true,
  bloomOptions = {
    mipmapBlur: true,
    luminanceThreshold: 0.01,
    radius: 0.2,
    levels: 5,
    blendFunction: BlendFunction.MULTIPLY
  },
  enableColorDepth = true,
  depthOptions = {
    bits: 32,
    opacity: 0.9,
    blendFunction: BlendFunction.ADD
  },
  ...props
}) {
  return (
    <EffectComposer>
      {enableBloom && (
        <Bloom
          mipmapBlur={bloomOptions.mipmapBlur}
          luminanceThreshold={bloomOptions.luminanceThreshold}
          radius={bloomOptions.radius}
          levels={bloomOptions.levels}
          blendFunction={bloomOptions.blendFunction}
        />
      )}
      {enableColorDepth && (
        <ColorDepth
          bits={depthOptions.bits}
          opacity={depthOptions.opacity}
          blendFunction={depthOptions.blendFunction}
        />
      )}
    </EffectComposer>
  )
}

Composer.propTypes = {
  state: PropTypes.object,
  setState: PropTypes.func,
  enableBloom: PropTypes.bool,
  bloomOptions: PropTypes.object,
  enableColorDepth: PropTypes.bool,
  depthOptions: PropTypes.object
}

export {
  Composer
}
