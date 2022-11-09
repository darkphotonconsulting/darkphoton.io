import './ControlBar.css'
import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  // faPlanetMoon,
  faFluxCapacitor,
  faStarship,
  faSunBright,
  faMoon,
  faHeadSideBrain
} from '@fortawesome/pro-duotone-svg-icons'
import {
  faTwitter,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

import {
  Stack,
  Box,
  Divider,
  AppBar,
  Toolbar,
  // Typography,
  IconButton,
  Tooltip,
  // Grow,
  // Fade,
  Slide
} from '@mui/material'

ControlBar.propTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
}
export function ControlBar ({
  state = {},
  setState = () => {},
  theme = {},
  config = {},
  ...props
}) {
  const containerRef = React.useRef(null)
  const sections = [
    {
      icon: faStarship,
      name: 'About',
      tooltip: 'About Us'
    },
    {
      icon: faFluxCapacitor,
      name: 'Services',
      tooltip: 'Discover Services'
    },
    {
      icon: faTwitter,
      name: 'Twitter',
      tooltip: 'Follow us on Twitter'
    },
    {
      icon: faGithub,
      name: 'GitHub',
      tooltip: 'View our code repositories'
    },
    {
      icon: faHeadSideBrain,
      name: 'Philosophy',
      tooltip: 'Our Philosophy'
    }
  ]
  // eslint-disable-next-line no-unused-vars
  const [userTheme, setUserTheme] = React.useState('dark')
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    setWidth(containerRef.current.offsetWidth)
    console.log('width', width)
    setHeight(containerRef.current.offsetHeight)
    console.log('height', height)
  })

  const dimensions = {
    width: {
      hovered: {
        xs: 60
      },
      idle: {
        xs: 50
      }
    },
    height: {
      hovered: {
        xs: 68
      },
      idle: {
        xs: 64
      }
    }
  }

  return (
    <Slide in={true} direction={'up'} mountOnEnter unmountOnExit>
    <div
      id={'control-bar-container'}
      ref={containerRef}
      style={{
        width: '100vh',
        bottom: 10
      }}
    >
      <AppBar
        id={'control-bar'}
        position={
          config.settings.appBar.position
        }
        sx={{
          backgroundColor: theme.palette.primary.dark,
          top: 'auto',
          width: state.bar.hovered ? `${dimensions.width.hovered.xs}%` : `${dimensions.width.idle.xs}%`,
          height: state.bar.hovered ? `${dimensions.height.hovered.xs}px` : `${dimensions.width.idle.xs}px`,
          bottom: 10,
          transform: state.bar.hovered ? 'translateX(-40%)' : 'translateX(-50%)',
          transition: state.bar.hovered ? 'width 5s, height 5s, transform 5s' : 'width 0.5s, height 0.5s, transform 0.5s',
          borderRadius: state.bar.hovered ? 60 : 50,
          justifyContent: 'center',
          alignContent: 'center',
          verticalAlign: 'middle',
          alignItems: 'center',
          zIndex: state.bar.hovered ? 1000 : 100
        }}
        onMouseOver={() => {
          setState((state) => {
            return {
              ...state,
              bar: {
                ...state.bar,
                hovered: true
              }
            }
          })
        }}
        onMouseLeave={() => {
          setState((state) => {
            return {
              ...state,
              bar: {
                ...state.bar,
                hovered: false
              }
            }
          })
        }}
      >
        <Toolbar>
          <Stack direction={'row'} spacing={theme.spacing(5)}>

                  {sections.map((section, index) => {
                    return (
                      <Box key={`controlbar-section-container-${section.name.toLowerCase()}`}>
                      <Tooltip
                      key={`controlbar-tooltip-${section.name.toLowerCase()}`}
                      title={section.tooltip}

                      >
                      <IconButton
                        key={`controlbar-ibutton-${section.name.toLowerCase()}`}
                        id={`controlbar-ibutton-${section.name.toLowerCase()}`}
                        sx={{
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
                              // const sectionFromEvent = sections.find((section, index) => {
                              //   const sectionMeta = event.target.id.split('-')
                              //   const eventId = sectionMeta[sectionMeta.length - 1]
                              //   return section.name.toLowerCase() === eventId
                              // })
                              // console.log('section: ', sectionFromEvent)
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
                      >
                          <FontAwesomeIcon icon={section.icon}/>
                      </IconButton>
                      </Tooltip>
                      </Box>
                    )
                  })}
              <Box>
                {/* settings */}
              <Divider
                orientation={'vertical'}
              />
              </Box>
              <Box>
                  <Tooltip
                    title={userTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                  >
                  <IconButton
                    id={'controlbar-ibutton-theme'}
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
                    onClick={(event) => {
                      setState((state) => ({
                        ...state,
                        theme: {
                          mode: state.theme.mode === 'light' ? 'dark' : 'light'
                        }
                      }))
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        userTheme === 'light' ? faMoon : faSunBright
                      }
                    />
                  </IconButton>
                  </Tooltip>
              </Box>
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
    </Slide>
  )
}
