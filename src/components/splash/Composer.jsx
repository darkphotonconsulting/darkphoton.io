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
  bloom = {
    mipmapBlur: true,
    luminanceThreshold: 0.01,
    radius: 0.2,
    levels: 5,
    blendFunction: BlendFunction.MULTIPLY
  },
  enableColorDepth = true,
  depth = {
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
          mipmapBlur={bloom.mipmapBlur}
          luminanceThreshold={bloom.luminanceThreshold}
          radius={bloom.radius}
          levels={bloom.levels}
          blendFunction={bloom.blendFunction}
        />
      )}
      {enableColorDepth && (
        <ColorDepth
          bits={depth.bits}
          opacity={depth.opacity}
          blendFunction={depth.blendFunction}
        />
      )}
    </EffectComposer>
  )
}

Composer.propTypes = {
  state: PropTypes.object,
  setState: PropTypes.func,
  enableBloom: PropTypes.bool,
  bloom: PropTypes.object,
  enableColorDepth: PropTypes.bool,
  depth: PropTypes.object
}

export {
  Composer
}
