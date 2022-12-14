
// import logo from './logo.svg'
import './App.css'
import React from 'react'
// import { useSpring, animated } from 'react-spring'
import {
  MemoryRouter,
  withRouter,
  Switch,
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import PropTypes from 'prop-types'

import {
  Configuration
} from './config/Configuration.js'

import {
  // Breadcrumbs,
  // Link,
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

// eslint-disable-next-line no-unused-vars
import Crumb from './components/primitives/Crumb.jsx'

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

  // update theme based on state
  const theme = responsiveFontSizes(createTheme({
    ...Configuration.themes.find(
      theme => theme.name === state?.theme?.mode
    ).theme
  }))

  return (
    <ThemeProvider
      theme={theme}
      className={'theme-container'}
    >
      <CssBaseline />
      {/* application root */}
      <div
        id={'root-container'}
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          padding: 15,
          backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          backgroundSize: 'cover',
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {/* application layout */}
        <Grid
          id={'layout-container'}
          container
          alignItems={'center'}
          justifyContent={'center'}
          alignContent={'center'}
          // spacing={2}
          style={{
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            border: '1px dashed #B6B0B0',
            borderRadius: '1rem',
            height: '97%',
            width: '97%',
            margin: 0,
            flexGrow: 3,
            flexShrink: 0,
            padding: 10
          }}
        >
          {/* application center staged content */}
          <Grid
            className={'content-container'}
            id={'main-content'}
            item
            spacing={2}
            xs={12}
            sm={12}
            sx={{
              // position: 'absolute',
              // top: 5,
              display: 'flex',
              width: '97%',
              height: '97%',
              // height: '85%',
              border: '1px dashed #DD1616',
              borderRadius: '1rem',
              margin: 'auto',
              padding: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center'
            }}
          >
            <MemoryRouter
              initialEntries={['/']}
              initialIndex={0}
              className={'memory-router'}
              id={'app-memory-router'}
            >
              {/* <Breadcrumbs
                className={'breadcrumb-container'}
                id={'breadcrumbs'}
                aria-label='breadcrumbs'
                style={{
                  // top: 0,
                  backgroundColor: 'pink'
                }}
              > */}
                {/*
                  TODO: ???? research if is it ok to embed the Switch and Router components within MemoryRouter?
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
                          />
                          )
                        : (
                          <div
                            className={'landing-component-container'}
                            id={'landing-component-container'}
                            style={{
                              display: 'flex',
                              border: '1px dashed pink',
                              borderRadius: 15,
                              width: '100%'
                              // height: '100%'
                              // margin: 'auto',
                              // width: 'inherit',
                              // flexGrow: 3
                            }}
                          >
                            <Landing
                              className={'landing-component'}
                              id={'app-landing'}
                            />
                          </div>
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
                  </Router>
                </Switch>
              {/* </Breadcrumbs> */}
            </MemoryRouter>

          </Grid>
          {/* application control */}
          <Grid
            id={'application-control-container'}
            item
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center'
            }}
          >
            <ControlBar
              state={state}
              setState={setState}
              theme={theme}
              config={Configuration}
              className="application-control-bar"
              id={'application-control-bar'}
            />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  )
}
export default withRouter(App)
