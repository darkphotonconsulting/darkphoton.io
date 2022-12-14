import './Landing.css'
import './nasalization_regular.otf'
import React from 'react'
import PropTypes from 'prop-types'
import {
  // eslint-disable-next-line no-unused-vars
  Grid,
  Stack,
  Box,
  Typography,
  Divider
} from '@mui/material'
import { useSpring, animated } from 'react-spring'

import {
  // Link as RouterLink,
  // Route,
  // Routes,
  useLocation,
  useHistory,
  MemoryRouter,
  withRouter
  // useLocation
} from 'react-router-dom'

// eslint-disable-next-line no-unused-vars
const landingSections = [
  {
    title: 'Solutions Architecture',
    description: 'From the ground up, we can help you build your solution.',
    color: 'linear-gradient(45deg, #6B7CFE 30%, #EE53FF 90%)'
  },
  {
    title: 'Data Science',
    description: 'Doing the data things',
    color: 'linear-gradient(45deg, #6B7CFE 30%, #EE53FF 90%)'
  }
]
function Title ({
  theme = {},
  text = 'Dark Photon IT Consultants, LLC',
  // sub = 'Engineering solutions for the stars',
  ...props
}) {
  const animations = useSpring({
    loop: false,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    opacity: 0,
    config: {
      duration: 5000,
      tension: 300,
      friction: 10
    },
    to: {
      opacity: 1
    },
    from: {
      opacity: 0
    }
  })
  return (
    <Box
      id={'landing-title-container'}
      className={'landing-title-container'}
      style={{
        display: 'flex'
      }}
    >
      <animated.div
        style={{ ...animations }}
        className={'landing-title'}
        id={'landing-title'}
      >
       <span>{text}</span>
      </animated.div>
    </Box>
  )
}

Title.propTypes = {
  theme: PropTypes.object,
  text: PropTypes.string
  // sub: PropTypes.string
}

function Subtitle ({
  theme = {},
  text = 'Solutions for a type 1 civilization',
  ...props
}) {
  const animations = useSpring({
    loop: false,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    opacity: 0,
    transform: 'translate3d(0,0,0)',
    config: {
      duration: 5000,
      tension: 300,
      friction: 10
    },
    to: {
      opacity: 1,
      transform: 'translate3d(0,0,0)'
    },
    from: {
      opacity: 0,
      transform: 'translate3d(100px,100px,0)'
    }
  })
  return (
    <Box
      id={'landing-subtitle-container'}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center'
      }}
    >
      <animated.div
        style={{ ...animations }}
        className={'landing-subtitle'}
        id={'landing-subtitle'}
      >
        <span className={'landing-subtitle'}>{text}</span>
      </animated.div>
    </Box>
  )
}

Subtitle.propTypes = {
  theme: PropTypes.object,
  text: PropTypes.string
}

function Section ({
  title = 'Section',
  description = 'Section description',
  color = 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        width: '75%',
        flexGrow: landingSections.length,
        flexShrink: landingSections.length / landingSections.length
        // height: '33%'
      }}
    >
      <Typography
        variant='h2'
        sx={{
          typography: {
            xs: 'h6',
            sm: 'h6',
            md: 'h6',
            lg: 'h2',
            xl: 'h2'
          }
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          typography: {
            xs: 'body2',
            sm: 'body2',
            md: 'body2',
            lg: 'body1',
            xl: 'body1'
          }
        }}
        variant='subtitle'
      >
        {description}
      </Typography>
    </Box>
  )
}

Section.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  color: PropTypes.string
}

function Sections ({
  data = landingSections,
  ...props
}) {
  return (
    <Stack
      direction='column'
      spacing={2}
      alignItems='center'
      justifyContent='center'
      alignContent='center'
      style={{
        display: 'flex',
        width: '80%',
        border: '1px solid black',
        padding: 5,
        flexGrow: 1,
        flexShrink: 0
      }}
    >
      {
        data.map((section, index) => {
          return (
            <Box
              style={{
                display: 'flex',
                backgroundImage: section.color,
                borderRadius: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                padding: 5,
                width: 'inherit',
                flexGrow: data.length - index,
                flexShrink: data.length - index,
                border: '5px solid black'
              }}
              key={`landing-parallax-section-${index}`}
            >
              <Section
                key={`landing-section-${index}`}
                title={section.title}
                description={section.description}
                color={section.color}
              />
              <Divider/>
            </Box>
          )
        })
      }

    </Stack>
  )
}

Sections.propTypes = {
  data: PropTypes.array
}

function Landing ({
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()

  return (
    <MemoryRouter
      initialEntries={['/']}
      initialIndex={0}
      id={'landing-router'}
      className={'memory-router'}
    >
        <Grid
          container
          direction={'column'}
          id={'landing-grid'}
          className={'landing-grid'}
          alignContent={'center'}
          justifyContent={'center'}
          alignItems={'center'}
          style={{
            padding: 5,
            margin: 'auto',
            borderRadius: 15,
            width: '100%',
            height: '100%'
          }}
        >
          <Grid
            item
            id={'landing-content-item'}
            className={'landing-content-item'}
            alignContent={'center'}
            justifyContent={'center'}
            alignItems={'center'}
            style={{
              top: 0,
              left: 0
            }}
          >
            <Title
              id={'landing-title-component'}
              className={'landing-title-component'}
            />
          </Grid>
          <Grid
            item
            id={'landing-subtitle-item'}
            className={'landing-subtitle-item'}
            alignContent={'center'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Subtitle
              id={'landing-subtitle-component'}
              className={'landing-subtitle-component'}
            />
          </Grid>
          <Grid
            item
            id={'landing-content-item'}
            className={'landing-content-item'}
            alignContent={'center'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
            sx={{
              border: '2px solid purple',
              borderRadius: 15,
              margin: 'auto',
              width: '90%',
              // height: '90%',
              padding: 5,
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 5,
              flexShrink: 0
            }}
          >
            <Sections/>
          </Grid>
        </Grid>
    </MemoryRouter>
  )
}

export default animated(withRouter(Landing))
