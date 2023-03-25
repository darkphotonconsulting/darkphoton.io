
// import logo from './logo.svg'
import './App.css'
import React from 'react'
// import { useSpring, animated } from 'react-spring'
import * as Colors from '@mui/material/colors'
import {
  MemoryRouter,
  withRouter,
  Switch,
  BrowserRouter as Router,
  Route,
  useHistory,
  useLocation
} from 'react-router-dom'

import PropTypes from 'prop-types'

import {
  Configuration
} from './config/Configuration.js'

// import {

// } from '@mui/material/styles'
import {
  useMediaQuery,
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
  // ThemeProvider,
  // Box,
  CssBaseline,
  Grid,
  Box
} from '@mui/material'

import ControlBar from './components/ControlBar.jsx'

import {
  Splash
} from './components/Splash.jsx'

import Landing from './components/Landing.jsx'
import Services from './components/Services.jsx'
import About from './components/About.jsx'

// eslint-disable-next-line no-unused-vars
import Crumb from './components/primitives/Crumb.jsx'
// import { orthographicDepthToViewZ } from 'postprocessing'

App.propTypes = {
  colors: PropTypes.string,
  config: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string
}
export function App ({
  colors = 'dark',
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const landScapeQuery = useMediaQuery('screen and (orientation: landscape)')
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()
  // eslint-disable-next-line no-unused-vars
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = React.useState({
    theme: {
      mode: 'dark'
    },
    audio: {
      enabled: false
    },
    bar: {
      hovered: false,
      buttons: {}
    },
    splash: {
      hidden: false,
      background: '#322F2F',
      navigation: {
        enabled: true,
        rotate: true,
        rotationSpeed: 0.5,
        zoom: true,
        pan: true,
        dampen: true,
        dampenFactor: 0.5
      },
      limits: {
        x: [-400, 400],
        y: [-400, 400],
        z: [-400, 400],
        major: [1, 5],
        minor: [1, 5],
        radius: [1, 5]
      },
      scene: {
        stars: {
          visible: true
        },
        tech: {
          visible: true
        },
        planets: {
          visible: true,
          orbit: {
            animate: true
            // factor: 125.5
          }
        }
      },
      composer: {
        bloom: {
          // mipmapBlur: true,
          // luminanceThreshold: 0.01,
          // radius: 0.2,
          // levels: 5,
          // blendFunction: BlendFunction.MULTIPLY
          enabled: true
        },
        depth: {
          enabled: true
        }
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  const [rootWidth, setRootWidth] = React.useState(window.innerWidth)
  // eslint-disable-next-line no-unused-vars
  const [rootHeight, setRootHeight] = React.useState(window.innerHeight)
  // update theme based on state
  const theme = React.useMemo(() =>
    responsiveFontSizes(createTheme(
      {
        ...Configuration.themes.find(
          theme => theme.name === state?.theme?.mode
        ).theme
      }
    )),
  [state?.theme?.mode]
  )

  theme.palette.mode = state?.theme?.mode
  const rootContainerRef = React.useRef(null)

  const layoutContainerRef = React.useRef(null)
  // const controlContainerRef = React.useRef(null)
  const contentContainerRef = React.useRef(null)

  React.useLayoutEffect(() => {
    const rootWidth = rootContainerRef.current.offsetWidth
    const rootHeight = rootContainerRef.current.offsetHeight
    // eslint-disable-next-line no-unused-vars
    const layoutWidth = layoutContainerRef.current.offsetWidth
    // eslint-disable-next-line no-unused-vars
    const layoutHeight = layoutContainerRef.current.offsetHeight
    // const controlWidth = controlContainerRef.current.offsetWidth
    // const controlHeight = controlContainerRef.current.offsetHeight
    // eslint-disable-next-line no-unused-vars
    const contentWidth = contentContainerRef.current.offsetWidth
    // eslint-disable-next-line no-unused-vars
    const contentHeight = contentContainerRef.current.offsetHeight
    setRootWidth(rootWidth)
    setRootHeight(rootHeight)
  }, [rootContainerRef.current])

  return (
    <ThemeProvider
      theme={theme}
    >
      <CssBaseline />
      {/*
        Root Container
      */}
      <Box
        ref={rootContainerRef}
        id={'root-container'}
        style={{
          display: 'flex',
          flex: '1 1 auto',
          // backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          backgroundColor: state.theme.mode === 'light' ? Colors.grey[100] : Colors.grey[900],
          backgroundSize: 'cover',
          // height: '100%',
          /*
          padding is configured as a percentage of the root container's width and height
          */
          paddingTop: `${rootHeight * 0.04}px`,
          paddingBottom: `${rootHeight * 0.04}px`,
          paddingLeft: `${rootWidth * 0.04}px`,
          paddingRight: `${rootWidth * 0.04}px`,
          /*
          align items, content & justification with center
          */
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {/*
          layout container (flex item)
        */}
        <Grid
          ref={layoutContainerRef}
          id={'layout-container'}
          spacing={5}
          container
          sx={{
            // border: '1px dashed ' + theme.palette.primary.main,
            padding: 0,
            margin: 0,
            order: 0,
            flexDirection: 'column',
            flexGrow: 2,
            flexShrink: 0
          }}
        >
          {/*
          - skeleton container
          */}
            <Grid
              ref={contentContainerRef}
              className={'content-container'}
              id={'main-content'}
              item
              sx={{
                // justifyContent: 'flex-start',
                alignItems: 'center',
                alignContent: 'center',
                flexGrow: 1,
                flexShrink: 0,
                order: 0
                // border: '5px dashed green'
              }}
            >
              <MemoryRouter
                initialEntries={['/']}
                initialIndex={0}
                className={'memory-router'}
                id={'app-memory-router'}
              >
                  {/*
                    TODO: 🧐 research if is it ok to embed the Switch and Router components within MemoryRouter?
                  */}
                  <Switch
                    className={'switch-container'}
                    id={'app-switch'}
                  >
                    <Router
                      className={'router-container'}
                      id={'app-router'}
                    >
                      {/* <Route
                        className={'route-container'}
                        id={'home-route'}
                        exact
                        path='/'
                      > */}
                      {
                        state.splash.hidden === false
                          ? (
                            <Route
                              className={'route-container'}
                              id={'splash-route'}
                              exact
                              path='/'
                            >
                              <Splash
                                className={'splash-component'}
                                id={'splash'}
                                state={state}
                                setState={setState}
                                theme={theme}
                                visible={true}
                              />
                            </Route>
                            )
                          : (
                            <Route
                              className={'route-container'}
                              id={'landing-route'}
                              exact
                              path='/'
                            >
                              <Box
                                className={'landing-component-container'}
                                id={'landing-component-container'}
                                sx={{
                                  padding: 5,
                                  flexGrow: 1,
                                  flexShrink: 0
                                }}
                              >
                                  <Landing
                                    className={'landing-component'}
                                    id={'app-landing'}
                                    theme={theme}
                                  />
                              </Box>
                            </Route>
                            )
                      }
                      {/* </Route> */}
                      <Route exact path='/test'>
                        <Box>
                          <Crumb/>
                          <Box>Testing 123!</Box>
                        </Box>
                      </Route>
                      <Route exact path='/services'>
                        <Box>
                          <Crumb/>
                          <Services/>
                        </Box>
                      </Route>
                      <Route exact path='/about'>
                        <Box
                          sx={{
                            padding: 5,
                            flexGrow: 1,
                            flexShrink: 0,
                            flex: '1 1 auto'
                          }}
                        >
                          <About
                            config={Configuration}
                            theme={theme}
                          />
                        </Box>
                      </Route>
                    </Router>
                  </Switch>
                {/* </Breadcrumbs> */}
              </MemoryRouter>
            </Grid>

          {/* application control */}
        </Grid>
        <ControlBar
          state={state}
          setState={setState}
          theme={theme}
          config={Configuration}
          className="application-control-bar"
          id={'application-control-bar'}
        />
      </Box>
    </ThemeProvider>
  )
}
export default withRouter(App)
