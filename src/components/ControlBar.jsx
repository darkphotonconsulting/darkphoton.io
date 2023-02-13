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
  useMediaQuery,
  Stack,
  Box,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
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
  // eslint-disable-next-line no-unused-vars
  const landScapeQuery = useMediaQuery('screen and (orientation: landscape)')
  const [play] = useSound(boopSound)
  const containerRef = React.useRef(null)
  const appBarRef = React.useRef(null)
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
    setHeight(containerRef.current.offsetHeight)
    console.log('window.innerWidth: ', window.innerWidth)
    console.log('window.innerHeight: ', window.innerHeight)
    console.log('in landscape', landScapeQuery)
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

  // eslint-disable-next-line no-unused-vars
  const dimensions = {
    width: {
      hovered: {
        xs: 60,
        sm: 60,
        md: 60,
        lg: 60
      },
      idle: {
        xs: 50,
        sm: 50,
        md: 50,
        lg: 50
      }
    },
    height: {
      hovered: {
        xs: 68,
        sm: 68,
        md: 68,
        lg: 68
      },
      idle: {
        xs: 64,
        sm: 64,
        md: 64,
        lg: 64
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
        className={'control-bar-container'}
        ref={containerRef}
        style={{
          // display: 'flex',
          // width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          bottom: 10
        }}
      >
        <AppBar
          ref={appBarRef}
          id={'control-bar'}
          className={'control-bar'}
          position={
            config.settings.appBar.position
          }
          sx={{
            // opacity: 1,
            // display: 'flex',
            backgroundColor: theme.palette.primary.main,
            border: '1px solid black',
            top: 'auto',
            width: '50%',
            // width: state.bar.hovered ? `${dimensions.width.hovered.xs}%` : `${dimensions.width.idle.xs}%`,
            // height: state.bar.hovered ? `${dimensions.height.hovered.xs}px` : `${dimensions.width.idle.xs}px`,
            bottom: 10,
            // transform: state.bar.hovered ? 'translateX(-40%)' : 'translateX(-50%)',
            transform: 'translateX(-50%)',
            transition: state.bar.hovered ? 'width 3s, height 3s, transform 3s' : 'width 0.5s, height 0.5s, transform 0.5s',
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
                // display: 'flex',
                flexGrow: Configuration.settings.appBar.sections.length,
                flexShrink: Configuration.settings.appBar.sections.length,
                // border: '1px solid red',
                alignContent: 'baseline'
                // width: '75%'
                // padding: 5
              }}
            >
                    {/* <Stack
                      direction='column'
                      sx={{}}
                    >

                      <Box
                        style={{
                          // width: '100%'
                        }}
                      >
                        <IconButton>
                          <FontAwesomeIcon icon={faMoon}/>
                        </IconButton>
                      </Box>
                    </Stack> */}

                    {Configuration.settings.appBar.sections.map((section, index) => {
                      return (
                        <Box
                          key={`controlbar-section-container-${section.name.toLowerCase()}`}
                          style={{
                            // border: '1px solid red'
                            // display: 'flex',
                            // width: '100%'
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
                                sm: 'small',
                                md: 'small',
                                lg: 'small',
                                xl: 'small'
                              },
                              minHeight: {
                                xs: '1%',
                                sm: '1%',
                                md: '1%',
                                lg: '1%',
                                xl: '1%'
                              },
                              minWidth: {
                                xs: '1%',
                                sm: '1%',
                                md: '1%',
                                lg: '1%',
                                xl: '1%'
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
                    width: '100%'
                    // border: '1px dashed blue'
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
                            sm: 'small',
                            md: 'small',
                            lg: 'small',
                            xl: 'small'
                          },
                          minHeight: {
                            xs: '1%',
                            sm: '1%',
                            md: '1%',
                            lg: '1%',
                            xl: '1%'
                          },
                          minWidth: {
                            xs: '1%',
                            sm: '1%',
                            md: '1%',
                            lg: '1%',
                            xl: '1%'
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
                    width: '100%'
                    // border: '1px dashed blue'
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
                              sm: 'small',
                              md: 'small',
                              lg: 'small',
                              xl: 'small'
                            },
                            minHeight: {
                              xs: '1%',
                              sm: '1%',
                              md: '1%',
                              lg: '1%',
                              xl: '1%'
                            },
                            minWidth: {
                              xs: '1%',
                              sm: '1%',
                              md: '1%',
                              lg: '1%',
                              xl: '1%'
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
                    width: '100%'
                    // border: '1px dashed blue'
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
                          sm: 'small',
                          md: 'small',
                          lg: 'small',
                          xl: 'small'
                        },
                        minHeight: {
                          xs: '1%',
                          sm: '1%',
                          md: '1%',
                          lg: '1%',
                          xl: '1%'
                        },
                        minWidth: {
                          xs: '1%',
                          sm: '1%',
                          md: '1%',
                          lg: '1%',
                          xl: '1%'
                        },
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
