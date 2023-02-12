import React from 'react'
import PropTypes from 'prop-types'
import {
  Stack,
  Box
} from '@mui/material'

function ServiceDetail ({ data = {}, ...props }) {
  return (
    <Stack>
      <Box>{data.name}</Box>
    </Stack>
  )
}

ServiceDetail.propTypes = {
  data: PropTypes.object
}

export {
  ServiceDetail
}
