import React from 'react'
import PropTypes from 'prop-types'
import useSound from 'use-sound'
import boopSound from '../audio/toyhammer.mp3'
import {
  Stack,
  Box,
  IconButton
} from '@mui/material'

import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome'

import {
  faHouseTree
} from '@fortawesome/pro-duotone-svg-icons'

function ControlButton ({
  theme = {},
  state = {},
  setState = () => {},
  text = 'Home',
  icon = (<FontAwesomeIcon icon={faHouseTree}/>),
  ...props
}) {
  const [play] = useSound(boopSound)
  return (
    <Stack>
      <Box>
        <IconButton
          sx={{
            fontSize: {
              xs: 'small',
              sm: 'medium',
              md: 'large',
              lg: 'large',
              xl: 'large'
            },
            height: {
              xs: '12px',
              sm: '24px',
              md: '42px',
              lg: '42px',
              xl: '42px'
            },
            width: {
              xs: '12px',
              sm: '24px',
              md: '42px',
              lg: '42px',
              xl: '42px'
            },
            transition: `${theme.transitions.create(['transform', 'cursor', 'backgroundColor'], { duration: theme.transitions.duration.standard })}`,
            '&:hover': {
              transform: 'scale(1.3) rotate(360deg)',
              cursor: 'pointer',
              backgroundColor: theme.palette.primary.main
            }
          }}
        onMouseLeave={(event) => {
          if (event.target.id) {
            setState((state) => {
              return {
                ...state,
                bar: {
                  ...state.bar,
                  buttons: {
                    ...state.bar.buttons,
                    [event.target.id]: {
                      hovered: false
                    }
                  }
                }
              }
            })
          }
        }}
        onMouseOver={(event) => {
          if (event.target.id) {
            setState((state) => {
              return {
                ...state,
                bar: {
                  ...state.bar,
                  buttons: {
                    ...state.bar.buttons,
                    [event.target.id]: {
                      hovered: true
                    }
                  }
                }
              }
            })
          }
        }}
          onClick={(event) => {
            if (state.audio.enabled) {
              play()
            }
          }}
        >
          {icon}
        </IconButton>
      </Box>
    </Stack>
  )
}

ControlButton.propTypes = {
  theme: PropTypes.object,
  state: PropTypes.object,
  setState: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.object
}
