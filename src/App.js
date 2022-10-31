
import logo from './logo.svg'
import './App.css'
import React from 'react'
import PropTypes from 'prop-types'

import {
  Configuration
} from './config/Configuration.js'

import {
  createTheme,
  ThemeProvider,
  Box,
  CssBaseline
} from '@mui/material'

import {
  ControlBar
} from './components/ControlBar.jsx'

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
  const theme = createTheme({
    ...Configuration.themes.find(theme => theme.name === 'default').theme
  })
  // const config = config || Configuration
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ControlBar
        theme={theme}
        config={Configuration}
      />
      <Box className="App">
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
      </Box>
    </ThemeProvider>

  )
}

export default App
