
// import logo from './logo.svg'
import './App.css'
import React from 'react'
// import { useSpring, animated } from 'react-spring'
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

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
  // Box,
  CssBaseline,
  Grid,
  Box
} from '@mui/material'

import {
  ControlBar
} from './components/ControlBar.jsx'

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
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  const [rootWidth, setRootWidth] = React.useState(window.innerWidth)
  // eslint-disable-next-line no-unused-vars
  const [rootHeight, setRootHeight] = React.useState(window.innerHeight)
  // update theme based on state
  const theme = responsiveFontSizes(createTheme({
    ...Configuration.themes.find(
      theme => theme.name === state?.theme?.mode
    ).theme
  }))
  const rootContainerRef = React.useRef(null)

  const layoutContainerRef = React.useRef(null)
  // const controlContainerRef = React.useRef(null)
  const contentContainerRef = React.useRef(null)

  React.useLayoutEffect(() => {
    const rootWidth = rootContainerRef.current.offsetWidth
    const rootHeight = rootContainerRef.current.offsetHeight
    const layoutWidth = layoutContainerRef.current.offsetWidth
    const layoutHeight = layoutContainerRef.current.offsetHeight
    // const controlWidth = controlContainerRef.current.offsetWidth
    // const controlHeight = controlContainerRef.current.offsetHeight
    const contentWidth = contentContainerRef.current.offsetWidth
    const contentHeight = contentContainerRef.current.offsetHeight
    console.log('content width: ', contentWidth)
    console.log('content height: ', contentHeight)
    console.log('layout width: ', layoutWidth)
    console.log('layout height: ', layoutHeight)
    // console.log('control width: ', controlWidth)
    // console.log('control height: ', controlHeight)
    console.log('root width: ', rootWidth)
    console.log('root height: ', rootHeight)
    console.log('window width: ', window.innerWidth)
    console.log('window height: ', window.innerHeight)
    console.log('window:', window)
    setRootWidth(rootWidth)
    setRootHeight(rootHeight)
  }, [rootContainerRef.current])

  return (
    <ThemeProvider
      theme={theme}
    >
      <CssBaseline />
      {/*
        root div (flex container)
      */}
      <div
        ref={rootContainerRef}
        id={'root-container'}
        style={{
          display: 'flex',
          flex: '1 1 auto',
          backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          backgroundSize: 'cover',
          // height: '100%',
          /*
          padding is configured as a percentage of the root container's width and height
          */
          paddingTop: `${rootHeight * 0.02}px`,
          paddingBottom: `${rootHeight * 0.02}px`,
          paddingLeft: `${rootWidth * 0.02}px`,
          paddingRight: `${rootWidth * 0.02}px`,
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
            border: '5px dashed red',
            padding: 5,
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
              order: 0,
              border: '5px dashed green'
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
                    <Route
                      className={'route-container'}
                      id={'home-route'}
                      exact
                      path='/'
                    >
                    {
                      state.splash.hidden === false
                        ? (
                          <Splash
                            className={'splash-component'}
                            id={'splash'}
                            state={state}
                            setState={setState}
                            theme={theme}
                            visible={true}
                          />
                          )
                        : (
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
                          )
                    }
                    </Route>
                    <Route exact path='/test'>
                      <Box>
                        <Crumb/>
                        <div>Testing 123!</div>
                      </Box>
                    </Route>
                    <Route exact path='/services'>
                      <Box>
                        <Crumb/>
                        <Services/>
                      </Box>
                    </Route>
                    <Route exact path='/about'>
                      <Box>
                        <About/>
                      </Box>
                    </Route>
                  </Router>
                </Switch>
              {/* </Breadcrumbs> */}
            </MemoryRouter>

          </Grid>
          {/* application control */}
          {/* <Grid
            ref={controlContainerRef}
            id={'application-control-container'}
            item
            sx={{
              position: 'relative',
              flex: 1,
              // bottom: 0,
              justifyContent: 'space-between',
              alignItems: 'center',
              alignContent: 'center',
              border: '10px dashed black',
              order: 1
            }}
          >
            Text
            <ControlBar
              state={state}
              setState={setState}
              theme={theme}
              config={Configuration}
              className="application-control-bar"
              id={'application-control-bar'}
            />
          </Grid> */}
        </Grid>
        <ControlBar
              state={state}
              setState={setState}
              theme={theme}
              config={Configuration}
              className="application-control-bar"
              id={'application-control-bar'}
            />
      </div>
    </ThemeProvider>
  )
}
export default withRouter(App)
