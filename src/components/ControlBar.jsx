import './ControlBar.css'
import boopSound from '../audio/toyhammer.mp3'
// eslint-disable-next-line no-unused-vars
import { Configuration } from '../config/Configuration.js'
import React from 'react'
import PropTypes from 'prop-types'
import useSound from 'use-sound'

import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome'

import {
  faSunBright,
  faMoon,
  faVolumeSlash,
  faVolumeUp,
  faFilmSimple,
  faFilmSlash
} from '@fortawesome/pro-duotone-svg-icons'

import {
  Stack,
  Box,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  // SpeedDial,
  // SpeedDialAction,
  // SpeedDialIcon,
  Tooltip,
  Slide
} from '@mui/material'

export function ControlBar ({
  state = {},
  setState = () => {},
  theme = {},
  config = {},
  ...props
}) {
  const [play] = useSound(boopSound)
  const containerRef = React.useRef(null)
  // eslint-disable-next-line no-unused-vars
  const [userTheme, setUserTheme] = React.useState('dark')
  // eslint-disable-next-line no-unused-vars
  const [width, setWidth] = React.useState(0)
  // eslint-disable-next-line no-unused-vars
  const [height, setHeight] = React.useState(0)
  // eslint-disable-next-line no-unused-vars
  const [services, setServices] = React.useState([])

  React.useLayoutEffect(() => {
    setWidth(containerRef.current.offsetWidth)
    // console.log('width', width)
    setHeight(containerRef.current.offsetHeight)
    // console.log('height', height)
  })

  React.useEffect(() => {
    const fetchServices = async () => {
      fetch(
        'http://localhost:3001/services',
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )
        .then((res) => {
          const json = res.json()
          return json
        })
        .then((json) => {
          if (services.length === 0) {
            setServices((services) => [...json])
          }
        })
    }
    fetchServices()
  }, [services])

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
    <Slide
      in={true}
      direction={'up'}
      mountOnEnter
      unmountOnExit
      >
      <div
        // id={'control-bar-container'}
        className={'control-bar-container'}
        ref={containerRef}
        style={{
          display: 'flex',
          width: '100%',
          bottom: 10
        }}
      >
        <AppBar
          id={'control-bar'}
          className={'control-bar'}
          position={
            config.settings.appBar.position
          }
          sx={{
            // opacity: 1,
            display: 'flex',
            backgroundColor: theme.palette.primary.dark,
            border: '1px solid black',
            top: 'auto',
            width: state.bar.hovered ? `${dimensions.width.hovered.xs}%` : `${dimensions.width.idle.xs}%`,
            height: state.bar.hovered ? `${dimensions.height.hovered.xs}px` : `${dimensions.width.idle.xs}px`,
            bottom: 10,
            transform: state.bar.hovered ? 'translateX(-40%)' : 'translateX(-50%)',
            transition: state.bar.hovered ? 'width 5s, height 5s, transform 5s' : 'width 5s, height 5s, transform 5s',
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
          <Toolbar
            style={{
              marginRight: 'auto',
              marginLeft: 'auto',
              display: 'flex',
              flexGrow: Configuration.settings.appBar.sections.length
            }}
          >
            <Stack
              direction={'row'}
              spacing={theme.spacing(2)}
              sx={{
                display: 'flex',
                flexGrow: Configuration.settings.appBar.sections.length,
                flexShrink: Configuration.settings.appBar.sections.length,
                border: '1px solid red'
                // width: '75%'
                // padding: 5
              }}
            >
                  {/* pulling in a speed dial */}
                    {/* <Box
                      style={{
                        width: '100%',
                        border: '1px dashed blue',
                        position: 'absolute',
                        bottom: 5
                      }}
                    >
                      <SpeedDial
                        ariaLabel='SpeedDial example'
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
                          }

                        }}
                        icon={
                          <SpeedDialIcon
                            openIcon = {
                              <FontAwesomeIcon icon={<faMoon/>}
                              />
                            }
                          />
                        }
                      >
                        {services.map((service) => {
                          return (
                            <SpeedDialAction
                              key={service.data.name}
                              icon={<FontAwesomeIcon icon={<faMoon/>}/>}
                              tooltipTitle={service.data.name}
                            >

                            </SpeedDialAction>
                          )
                        })}

                      </SpeedDial>
                    </Box> */}
                    <Stack direction='column'>

                      <Box
                        style={{
                          // display: 'flex',
                          width: '100%',
                          border: '1px dashed blue'
                        }}
                      >
                        <IconButton>
                          <FontAwesomeIcon icon={faMoon}/>
                        </IconButton>
                      </Box>
                    </Stack>

                    {Configuration.settings.appBar.sections.map((section, index) => {
                      return (
                        <Box
                          key={`controlbar-section-container-${section.name.toLowerCase()}`}
                          style={{
                            // display: 'flex',
                            width: '100%',
                            border: '1px dashed blue'
                          }}
                        >
                          <Tooltip
                          key={`controlbar-tooltip-${section.name.toLowerCase()}`}
                          title={section.tooltip}

                          >
                          <IconButton
                            className={'controlbar-button'}
                            key={`controlbar-ibutton-${section.name.toLowerCase()}`}
                            id={`controlbar-ibutton-${section.name.toLowerCase()}`}
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
                              // height: 42,
                              // width: 42,
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
                            onClick={(event) => {
                              if (state.audio.enabled) {
                                play()
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
                <Box>
                  <Divider
                    orientation={'vertical'}
                  />
                </Box>

                </Box>
                <Box
                  style={{
                    display: 'flex',
                    width: '100%',
                    border: '1px dashed blue'
                  }}
                >
                    <Tooltip
                      title={state.audio.enabled ? 'Disable Audio' : 'Enable Audio'}
                    >
                      <IconButton
                        id={'controlbar-ibutton-audio'}
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
                            audio: {
                              ...state.audio,
                              enabled: !state.audio.enabled
                            }
                          }))
                        }}
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
                          // height: 42,
                          // width: 42,
                          transition: `${theme.transitions.create(['transform', 'cursor', 'backgroundColor'], { duration: theme.transitions.duration.standard })}`,
                          '&:hover': {
                            transform: 'scale(1.3) rotate(360deg)',
                            cursor: 'pointer',
                            backgroundColor: theme.palette.primary.main
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={state.audio.enabled ? faVolumeSlash : faVolumeUp}/>
                      </IconButton>
                    </Tooltip>
                </Box>
                <Box
                  style={{
                    display: 'flex',
                    width: '100%',
                    border: '1px dashed blue'
                  }}
                >
                  <Tooltip
                        title={'Toggle Splash'}
                      >
                        <IconButton
                          id={'controlbar-ibutton-splash'}
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
                              splash: {
                                ...state.splash,
                                hidden: !state.splash.hidden
                              }
                            }))
                          }}
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
                            // height: 42,
                            // width: 42,
                            transition: `${theme.transitions.create(['transform', 'cursor', 'backgroundColor'], { duration: theme.transitions.duration.standard })}`,
                            '&:hover': {
                              transform: 'scale(1.3) rotate(360deg)',
                              cursor: 'pointer',
                              backgroundColor: theme.palette.primary.main
                            }
                          }}
                        >
                          <FontAwesomeIcon
                            icon={state.splash.hidden ? faFilmSimple : faFilmSlash}
                          />
                        </IconButton>
                      </Tooltip>
                </Box>
                <Box
                  style={{
                    display: 'flex',
                    width: '100%',
                    border: '1px dashed blue'
                  }}
                >
                <Tooltip
                      title={state.theme.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
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
                        // height: 42,
                        // width: 42,
                        transition: `${theme.transitions.create(['transform', 'cursor', 'backgroundColor'], { duration: theme.transitions.duration.standard })}`,
                        '&:hover': {
                          transform: 'scale(1.3) rotate(360deg)',
                          cursor: 'pointer',
                          backgroundColor: theme.palette.primary.main
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={
                          state.theme.mode === 'light' ? faMoon : faSunBright
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

ControlBar.propTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
}
