import './Landing.css'
import './nasalization_regular.otf'
import React from 'react'
import PropTypes from 'prop-types'
// import { randomUUID } from 'crypto'
import {
  // eslint-disable-next-line no-unused-vars
  createTheme,
  ThemeProvider,
  Paper,
  Grid,
  Stack,
  Box,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import { useSpring, animated } from 'react-spring'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRoad,
  faMapLocationDot,
  faBars,
  // faCircle,
  faDotCircle
} from '@fortawesome/pro-duotone-svg-icons'
import {
  useLocation,
  useHistory,
  MemoryRouter,
  withRouter
} from 'react-router-dom'
// import { width } from '@mui/system'

const localTheme = createTheme({
  typography: {
    fontFamily: 'Nasalization, sans-serif'
  }
})
// eslint-disable-next-line no-unused-vars
const landingSections = [
  {
    title: 'Professional Services',
    description: 'From the ground up, we can help you build your solution.',
    roadmap: false,
    tiers: [
      {
        name: 'standard',
        description: 'Standard Tier',
        price: 0,
        features: [
          {
            name: 'Feature 1',
            description: 'Feature 1 description'
          },
          {
            name: 'Feature 2',
            description: 'Feature 2 description'
          }
        ]
      }
    ],
    color: 'linear-gradient(45deg, #6B7CFE 30%, #EE53FF 90%)'
  },
  {
    title: 'Infrastructure Solutions',
    description: 'From the ground up, we can help you build your solution.',
    roadmap: false,
    tiers: [
      {
        name: 'standard',
        description: 'Standard Tier',
        price: 0,
        features: [
          {
            name: 'Feature 1',
            description: 'Feature 1 description'
          },
          {
            name: 'Feature 2',
            description: 'Feature 2 description'
          }
        ]
      }
    ],
    color: 'linear-gradient(45deg, #6B7CFE 30%, #EE53FF 90%)'
  },
  {
    title: 'Application Modernization',
    description: 'From the ground up, we can help you build your solution.',
    roadmap: true,
    tiers: [
      {
        name: 'standard',
        description: 'Standard Tier',
        price: 0,
        features: []
      }
    ],
    color: 'linear-gradient(45deg, #6B7CFE 30%, #EE53FF 90%)'
  },
  {
    title: 'Data Science',
    description: 'Doing the data thing, blah blah blah blah',
    roadmap: true,
    tiers: [
      {
        name: 'standard',
        description: 'Standard Tier',
        price: 0,
        features: []
      }
    ],
    color: 'linear-gradient(45deg, #6B7CFE 30%, #EE53FF 90%)'
  }
]
function Title ({
  theme = {},
  text = 'Dark Photon IT',
  color = 'white',
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
      }}
    >
      <animated.div
        style={{ ...animations }}
        className={'landing-title'}
        id={'landing-title'}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: `${color}`,
            fontSize: {
              xs: '.5rem',
              sm: '.75rem',
              md: '1rem',
              lg: '2rem',
              xl: '3rem'
            }
          }}
        >
          {text}
        </Typography>
        {/* <span>{text}</span> */}
      </animated.div>
    </Box>
  )
}

Title.propTypes = {
  theme: PropTypes.object,
  text: PropTypes.string,
  color: PropTypes.string
}

function Subtitle ({
  theme = {},
  text = 'Solutions for a type 1 civilization',
  color = 'white',
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
        textAlign: 'center',
        flexGrow: 5,
        flexShrink: 5
      }}
    >
      <animated.div
        style={{ ...animations }}
        className={'landing-subtitle'}
        id={'landing-subtitle'}
      >
        <Typography
          className={'landing-subtitle'}
          sx={{
            fontSize: {
              xs: '.5rem',
              sm: '.75rem',
              md: '1rem',
              lg: '2rem',
              xl: '3rem'
            },
            fontWeight: 'bold',
            color: `${color}`
          }}
        >
          {text}
        </Typography>
      </animated.div>
    </Box>
  )
}

Subtitle.propTypes = {
  theme: PropTypes.object,
  text: PropTypes.string,
  color: PropTypes.string
}

function Section ({
  title = 'Section',
  // theme = {},
  description = 'Section description',
  color = 'linear-gradient(45deg, #6DFE6B 30%, #FF8E53 90%)',
  roadmap = false,
  tiers = [],
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const [tier, setTier] = React.useState('Basic')
  const [tierMenuActive, setTierMenuActive] = React.useState(false)
  const tierMenuRef = React.useRef(null)

  /* govern tier selection */
  const handleTier = (event) => {
    console.log(event.currentTarget)
    setTier(event.currentTarget)
  }

  const handleTierMenu = (event) => {
    console.log(event)
    setTierMenuActive(!tierMenuActive)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        // border: '5px solid blue',
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center'
      }}
    >
      <Stack
        direction='column'
        sx={{
          display: 'flex',
          flexGrow: landingSections.length,
          flexShrink: landingSections.length
        }}
      >
        {/* title */}
          <Stack
            direction='row'
            spacing={6}
            sx={{
              display: 'flex',
              alignContent: 'flex-start',
              alignItems: 'flex-start',
              textAlign: 'center',
              justifyContent: 'flex-start',
              flexGrow: landingSections.length,
              flexShrink: landingSections.length
            }}
          >
            <Box
              sx={{
                display: 'flex',
                paddingLeft: '1rem',
                backgroundColor: 'primary.main'
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: '.25rem',
                    sm: '.35rem',
                    md: '.45rem',
                    lg: '.95rem',
                    xl: '1rem'
                  }
                }}
              >
                {title}{' '}
                {roadmap
                  ? (
                  <IconButton>
                    <FontAwesomeIcon icon={faRoad} />
                  </IconButton>
                    )
                  : (
                  <IconButton>
                    <FontAwesomeIcon icon={faMapLocationDot} />
                  </IconButton>
                    )}
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={(event) => {
                  handleTierMenu(event)
                }}
                onChange={(event) => { handleTier(event) }}
                ref={tierMenuRef}
              >
                <FontAwesomeIcon icon={faBars} />
                <Typography
                  // variant={'body2'}
                  sx={{
                    fontSize: {
                      xs: '.25rem',
                      sm: '.35rem',
                      md: '.45rem',
                      lg: '.95rem',
                      xl: '1rem'
                    }
                  }}
                >{tier}
                </Typography>
              </IconButton>
              <Menu
                id={`${title.toLowerCase().replaceAll(' ', '')}-tier-menu`}
                aria-labelledby={`${title.toLowerCase().replaceAll(' ', '')}-tier-menu`}
                open={tierMenuActive}
                anchorEl={tierMenuRef.current}
                onClose={(event) => {
                  // handleTier(event)
                  handleTierMenu(event)
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
               {
                tiers.map((tier, index) => {
                  return (
                    <MenuItem
                      key={index}
                    >
                      {tier.name}
                    </MenuItem>
                  )
                })
               }
              </Menu>
            </Box>
          </Stack>
        {/* </Box> */}
        {/* top division */}
        <Box
          sx={{
            display: 'flex',
            width: '100%'
          }}
        >
          <Divider
            sx={{
              width: '100%',
              color: 'black'
            }}
          />
        </Box>
        {/* description */}
        <Stack
          direction={'row'}
          sx={{
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            flexGrow: landingSections.length,
            flexShrink: landingSections.length
          }}
        >
          <Box
            sx={{
              // display: 'flex'
              width: '33.333%'
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: '.15rem',
                  sm: '.25rem',
                  md: '.55rem',
                  lg: '.75rem',
                  xl: '.85rem'
                }
              }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              // display: 'flex',
              width: '33.333%'
              // height: '100%'
              // border: '1px solid grey'
            }}
          >
            <Divider
              component={'div'}
              orientation={'vertical'}
              flexItem={true}
              style={{
                color: 'grey',
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
          <Box
            sx={{
              width: '33.333%',
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
              flexGrow: landingSections.length,
              flexShrink: landingSections.length
            }}
          >
            <List
                dense={false}
                sx={{
                }}
              >
              {
                tiers.find(t => t.name === tier).features.map((feature, index) => {
                  return (
                    <ListItem
                      component={'div'}
                      disablePadding={true}
                      disableGutters={true}
                      key={
                        `${index}-${feature.name.toLowerCase().replaceAll(' ', '')}`
                      }
                    >
                      <ListItemIcon
                        sx={{
                          color: 'grey'
                        }}
                      >
                        <FontAwesomeIcon icon={faDotCircle} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.name}
                        primaryTypographyProps={{
                          color: 'primary.main',
                          fontSize: {
                            xs: '.15rem',
                            sm: '.25rem',
                            md: '.35rem',
                            lg: '.45rem',
                            xl: '.55rem'
                          }
                        }}
                        sx={{
                          my: 0
                        }}
                      />
                    </ListItem>
                  )
                })
              }
            </List>
          </Box>

        </Stack>

      </Stack>
    </Paper>
  )
}

Section.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  roadmap: PropTypes.bool,
  tiers: PropTypes.array,
  color: PropTypes.string
}

function Sections ({ data = landingSections, ...props }) {
  const sorted = data.sort((a, b) => a.precedence - b.precedence)
  return (
    <Stack
      direction='column'
      spacing={2}
      alignItems='center'
      justifyContent='center'
      alignContent='center'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexGrow: data.length,
        flexShrink: data.length
      }}
    >
      {sorted
        .map((section, index) => {
          return (
            <Box
              style={{
                display: 'flex',
                flexGrow: data.length - index,
                flexShrink: data.length - index
              }}
              key={`landing-parallax-section-${index}`}
            >
              <Section
                key={`landing-section-${index}`}
                title={section.data.name}
                description={section.data.description.join('. ')}
                roadmap={section.data.roadmap}
                tiers={section.data.tiers}
              />
              <Divider />
            </Box>
          )
        })}
    </Stack>
  )
}

Sections.propTypes = {
  data: PropTypes.array
}

function Landing ({ theme = {}, ...props }) {
  const [services, setServices] = React.useState([])
  React.useEffect(() => {
    const fetchServices = async () => {
      fetch('http://localhost:3001/services', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
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
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()

  return (
    <ThemeProvider theme={{ ...theme, ...localTheme }}>
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
          alignContent={'start'}
          style={{
            borderRadius: 15,
            // border: '15px solid #123',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center'
            // width: '100%',
            // height: '100%'
          }}
        >
          <Grid
            item
            id={'landing-content-item'}
            className={'landing-content-item'}
            alignContent={'center'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Title
              id={'landing-title-component'}
              className={'landing-title-component'}
              color={'#12B70FAB'}
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
              color={'#FFFFFF'}
            />
          </Grid>
          <Grid
            item
            // id={'landing-sections-item'}
            className={'landing-sections-item'}
            alignContent={'center'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Sections data={services} />
          </Grid>
        </Grid>
      </MemoryRouter>
    </ThemeProvider>
  )
}

Landing.propTypes = {
  theme: PropTypes.object
}

export default animated(withRouter(Landing))
