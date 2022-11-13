
// import logo from './logo.svg'
import './App.css'
import React from 'react'
import PropTypes from 'prop-types'

import {
  Configuration
} from './config/Configuration.js'

import {
  createTheme,
  ThemeProvider,
  // Box,
  CssBaseline,
  Grid
} from '@mui/material'

import {
  ControlBar
} from './components/ControlBar.jsx'

import {
  Splash
} from './components/Splash.jsx'

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
      background: 'black',
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
  const theme = createTheme({
    ...Configuration.themes.find(
      theme => theme.name === state?.theme?.mode
    ).theme
  })

  console.log({
    event: 'theme.load',
    theme
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        id={'application'}
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          backgroundColor: theme.palette.primary.main
        }}
      >
        <Grid
          container
          alignItems={'center'}
          justifyContent={'center'}

        >
          <Grid
            item

          >
            <Splash
              state={state}
              setState={setState}
              theme={theme}
            />
          </Grid>
          <Grid
            item
          >
            <ControlBar
              state={state}
              setState={setState}
              theme={
                // state.theme
                theme
              }
              config={Configuration}
              className="control-bar"
            />
          </Grid>
        </Grid>
      </div>

      {/* <Box className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {Configuration.title}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            More
          </a>
        </header>
      </Box> */}
    </ThemeProvider>
  )
}
export default App
