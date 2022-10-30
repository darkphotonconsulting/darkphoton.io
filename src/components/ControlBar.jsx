import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  // faPlanetMoon,
  faFluxCapacitor
} from '@fortawesome/pro-duotone-svg-icons'
import {
  Stack,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  // Grow,
  Fade
} from '@mui/material'

ControlBar.propTypes = {
  theme: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}
export function ControlBar ({
  theme = {},
  config = {},
  ...props
}) {
  return (
    <AppBar
      sx={{
        // backgroundColor: theme.palette.secondary.main
      }}
    >
      <Toolbar>
        <Stack direction={'row'} spacing={5}>
            <Fade in={true}>
              <Box
                sx={{
                  display: 'flex',
                  border: '1px solid',
                  padding: '0.5rem',
                  borderRadius: '0.5rem'
                }}
              >
                <Typography>{config.title}</Typography>
              </Box>
            </Fade>
            <Fade
              in={true}
            >
              <Box>
                <IconButton>
                  <FontAwesomeIcon icon={faFluxCapacitor}/>
                </IconButton>
              </Box>
            </Fade>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
