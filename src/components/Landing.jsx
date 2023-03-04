import './Landing.css'
import './nasalization_regular.otf'
import React from 'react'
import PropTypes from 'prop-types'
// import { randomUUID } from 'crypto'

import {
  // eslint-disable-next-line no-unused-vars
  Configuration
} from '../config/Configuration.js'

import {
  // eslint-disable-next-line no-unused-vars
  ThemeProvider,
  createTheme,
  Paper,
  Stack,
  Box,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery
  // collapseClasses
} from '@mui/material'

import { useSpring, animated } from 'react-spring'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRoad,
  faMapLocationDot,
  faBars,
  faDotCircle,
  faInfoCircle
} from '@fortawesome/pro-duotone-svg-icons'
import {
  useLocation,
  useHistory,
  MemoryRouter,
  withRouter
} from 'react-router-dom'

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
  theme,
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
              xs: '1em',
              sm: '1em',
              md: '1em',
              lg: '1em',
              xl: '1em'
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
  theme,
  // text = 'Solutions for a type 1 civilization',
  text = 'Developing the future',
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
              xs: '.8em',
              sm: '.8em',
              md: '.8em',
              lg: '.8em',
              xl: '.8em'
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
  description = 'Section description',
  color = 'linear-gradient(45deg, #6DFE6B 30%, #FF8E53 90%)',
  roadmap = false,
  tiers = [],
  precedence = 0,
  theme,
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const [tier, setTier] = React.useState('Basic')
  const [tierMenuActive, setTierMenuActive] = React.useState(false)
  const tierMenuRef = React.useRef(null)

  /* govern tier selection */
  const handleTier = (event, index) => {
    setTier(tiers[index].name)
  }

  const handleTierMenu = (event) => {
    setTierMenuActive(!tierMenuActive)
  }

  return (
    <Box
      sx={{
        padding: 2,
        // width: {
        //   xs: '100%',
        //   sm: '100%',
        //   md: '100%',
        //   lg: '50%',
        //   xl: '50%'
        // },
        alignContent: 'center',
        justifyContent: 'center',
        flexGrow: precedence,
        order: precedence
      }}
    >
      <Paper
        elevation={3}

      >
        {/*
          top-level organization stack
        */}
        <Stack
          direction='column'
          spacing={0}
          sx={{
            // border: '1px solid green',
            // boxShadow: '15px',
            flexGrow: landingSections.length,
            flexShrink: landingSections.length
          }}
        >
          {/*
            header stack
          */}
          <Stack
            direction='row'
            sx={{
              flex: '1 1 auto'
            }}
          >
            {/* title */}
            <Box
              sx={{
                padding: 2,
                width: '50%',
                backgroundColor: theme.palette.primary.main,
                justifyContent: 'flex-start',
                alignItems: 'baseline',
                alignContent: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
                flex: '1 1 auto',
                flexWrap: 'nowrap'
              }}
            >
              <Typography
                component={'div'}
                sx={{
                  // justifySelf: 'baseline',
                  flex: '1 1 auto',
                  justifyContent: 'flex-start',
                  alignItems: 'baseline',
                  alignContent: 'center',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  fontWeight: 'bold',
                  fontSize: {
                    xs: '.65rem',
                    sm: '.75rem',
                    md: '.75rem',
                    lg: '1rem',
                    xl: '1rem'
                  }
                }}
              >{title}
              </Typography>
            </Box>
            {/*
              vertically divide the title & toolbar items
            */}
            <Divider
                orientation={'vertical'}
                flexItem={true}
            />
            {/* indicator icons, roadmap, etc. */}
            <Stack
              spacing={2}
              direction='row'
              sx={{
                width: '50%',
                alignContent: 'center',
                alignItems: 'baseline',
                justifyContent: 'flex-start',
                backgroundColor: theme.palette.primary.main,
                textAlign: 'center',
                verticalAlign: 'middle',
                flexWrap: 'nowrap',
                flex: '1 1 auto'
              }}
            >
              {/* tier menu */}
              <Box
                sx={{
                  padding: 1
                }}
              >
                <Tooltip
                  title={'Select your plan'}
                >
                  <IconButton
                    sx={{
                      fontSize: {
                        xs: 'calc(.5rem + .333vw)',
                        sm: 'calc(.5rem + .333vw)',
                        md: 'calc(.5rem + .5vw)',
                        lg: 'calc(.5rem + 1vw)',
                        xl: 'calc(.5rem + 1vw)'
                      },
                      minHeight: {
                        xs: '1vh',
                        sm: '1vh',
                        md: '1vh',
                        lg: '1vh',
                        xl: '1vh'
                      },
                      minWidth: {
                        xs: '1vw',
                        sm: '1vw',
                        md: '1vw',
                        lg: '1vw',
                        xl: '1vw'
                      }
                    }}
                    id={`${title.toLowerCase().replaceAll(' ', '')}-tier-menu-button`}
                    aria-controls={tierMenuActive ? `${title.toLowerCase().replaceAll(' ', '')}-tier-menu` : undefined}
                    aria-haspopup={'true'}
                    aria-expanded={tierMenuActive ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      handleTierMenu(event)
                    }}
                    ref={tierMenuRef}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </IconButton>
                </Tooltip>
                <Menu
                  id={`${title.toLowerCase().replaceAll(' ', '')}-tier-menu`}
                  aria-labelledby={`${title.toLowerCase().replaceAll(' ', '')}-tier-menu`}
                  open={tierMenuActive}
                  anchorEl={tierMenuRef.current}
                  onClose={(event) => {
                    event.preventDefault()
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
                  MenuListProps={{
                    'aria-labelledby': `${title.toLowerCase().replaceAll(' ', '')}-tier-menu`
                  }}
                >
                  {
                  tiers.map((tier, index) => {
                    return (
                      <MenuItem
                        key={`${title.toLowerCase().replaceAll(' ', '')}-tier-menu-item-${index}`}
                        onClick={(event) => {
                          event.preventDefault()
                          handleTier(event, index)
                          handleTierMenu(event)
                        }}
                      >
                        {tier.name}
                      </MenuItem>
                    )
                  })
                  }
                </Menu>
              </Box>
              <Box>
                <Tooltip
                  title={tier}
                >
                  <Chip
                    id={`${title.toLowerCase().replaceAll(' ', '')}-tier-menu-chip`}
                    label={tier}
                  />
                </Tooltip>
              </Box>
              <Box>
                <Tooltip
                  title={'More information'}
                >
                  <IconButton
                    sx={{
                      fontSize: {
                        xs: 'calc(.5rem + .333vw)',
                        sm: 'calc(.5rem + .333vw)',
                        md: 'calc(.5rem + .5vw)',
                        lg: 'calc(.5rem + 1vw)',
                        xl: 'calc(.5rem + 1vw)'
                      },
                      minHeight: {
                        xs: '1vh',
                        sm: '1vh',
                        md: '1vh',
                        lg: '1vh',
                        xl: '1vh'
                      },
                      minWidth: {
                        xs: '1vw',
                        sm: '1vw',
                        md: '1vw',
                        lg: '1vw',
                        xl: '1vw'
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                {roadmap
                  ? (
                    <Tooltip
                      title={'View roadmap'}
                    >
                      <IconButton
                        sx={{
                          fontSize: {
                            xs: 'calc(.5rem + .333vw)',
                            sm: 'calc(.5rem + .333vw)',
                            md: 'calc(.5rem + .5vw)',
                            lg: 'calc(.5rem + 1vw)',
                            xl: 'calc(.5rem + 1vw)'
                          },
                          minHeight: {
                            xs: '1vh',
                            sm: '1vh',
                            md: '1vh',
                            lg: '1vh',
                            xl: '1vh'
                          },
                          minWidth: {
                            xs: '1vw',
                            sm: '1vw',
                            md: '1vw',
                            lg: '1vw',
                            xl: '1vw'
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faRoad} />
                      </IconButton>
                    </Tooltip>

                    )
                  : (
                    <Tooltip
                      title={'Sign up now!'}
                    >
                      <IconButton
                        sx={{
                          fontSize: {
                            xs: 'calc(.5rem + .333vw)',
                            sm: 'calc(.5rem + .333vw)',
                            md: 'calc(.5rem + .5vw)',
                            lg: 'calc(.5rem + 1vw)',
                            xl: 'calc(.5rem + 1vw)'
                          },
                          minHeight: {
                            xs: '1vh',
                            sm: '1vh',
                            md: '1vh',
                            lg: '1vh',
                            xl: '1vh'
                          },
                          minWidth: {
                            xs: '1vw',
                            sm: '1vw',
                            md: '1vw',
                            lg: '1vw',
                            xl: '1vw'
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faMapLocationDot} />
                      </IconButton>
                    </Tooltip>

                    )
                }
              </Box>

            </Stack>
          </Stack>
          {/* horizontal division */}
          <Box
            sx={{
              display: 'flex',
              width: '100%'
            }}
          >
            <Divider
              sx={{
                width: '100%',
                color: theme.palette.primary.main
              }}
              variant={'fullWidth'}
            />
          </Box>
          {/* info stack */}
          <Stack
            direction={'row'}
            sx={{
              alignContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center'
            }}
          >
            {/* service description */}
            <Box
              sx={{
                width: '50%'
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: '.45rem',
                    sm: '.45rem',
                    md: '.55rem',
                    lg: '.75rem',
                    xl: '.85rem'
                  }
                }}
              >
                {description}
              </Typography>
            </Box>

            {/* vertical divider */}
            <Divider
                orientation={'vertical'}
                flexItem={true}
            />

            {/* feature list */}
            <Box
              sx={{
                flexDirection: 'row',
                alignContent: 'flex-start',
                alignItems: 'flex-start',
                textAlign: 'flex-start',
                justifyContent: 'flex-start',
                flexGrow: landingSections.length,
                flexShrink: landingSections.length
              }}
            >
              <List
                  dense={true}
                  disablePadding={true}
                  sx={{
                  }}
                >
                {
                  tiers.find(t => t.name === tier).features.map((feature, index) => {
                    return (
                      <ListItem
                        dense={true}
                        component={'div'}
                        divider={false}
                        key={
                          `${index}-${feature.name.toLowerCase().replaceAll(' ', '')}`
                        }
                      >
                        <ListItemIcon
                          sx={{
                            padding: 1,
                            color: 'info.main',
                            minWidth: {
                              xs: 'auto',
                              sm: 'auto',
                              md: 'auto',
                              lg: 'auto',
                              xl: 'auto'
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faDotCircle} shake/>
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.name}
                          primaryTypographyProps={{
                            color: 'primary.main',
                            fontSize: {
                              xs: '.25rem',
                              sm: '.35rem',
                              md: '.45rem',
                              lg: '.55rem',
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
    </Box>

  )
}

Section.propTypes = {
  theme: PropTypes.object,
  precedence: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  roadmap: PropTypes.bool,
  tiers: PropTypes.array,
  color: PropTypes.string
}

function Sections ({ data = landingSections, theme, ...props }) {
  const sorted = data.sort((a, b) => a.precedence - b.precedence)
  return (
    <Stack
      direction='row'
      alignItems='start'
      sx={{
        padding: 5,
        flexWrap: 'wrap'
      }}
    >
      {sorted
        .map((section, index) => {
          return (
            <Section
            key={`landing-section-${index}`}
            theme={theme}
            title={section.data.name}
            description={section.data.description.join('. ')}
            roadmap={section.data.roadmap}
            tiers={section.data.tiers}
            precedence={section.data.precedence}
            />
          )
        })}
    </Stack>
  )
}

Sections.propTypes = {
  theme: PropTypes.object,
  data: PropTypes.array
}

function Landing ({ theme, ...props }) {
  theme = {
    ...theme,
    typography: {
      fontFamily: 'Nasalization, sans-serif'
    }
  }
  const containerRef = React.useRef(null)
  // eslint-disable-next-line no-unused-vars
  const [width, setWidth] = React.useState(0)
  // eslint-disable-next-line no-unused-vars
  const [height, setHeight] = React.useState(0)
  // eslint-disable-next-line no-unused-vars
  const landScapeQuery = useMediaQuery('screen and (orientation: landscape)')
  // React.useLayoutEffect(() => {
  //   setWidth(containerRef.current.offsetWidth)
  //   setHeight(containerRef.current.offsetHeight)
  // })
  const [services, setServices] = React.useState([])
  // eslint-disable-next-line no-unused-vars
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
        <Stack
          spacing={2}
          ref={containerRef}
          direction={'column'}
          id={'landing-grid'}
          className={'landing-grid'}
          sx={{
          }}
        >
          <Stack
          >
            <Box
            >
              <Title
                id={'landing-title-component'}
                className={'landing-title-component'}
                color={theme.palette.primary.main}
                theme={{ ...theme, ...localTheme }}
              />
            </Box>
            <Box
            >
              <Subtitle
                id={'landing-subtitle-component'}
                className={'landing-subtitle-component'}
                color={theme.palette.secondary.main}
                theme={theme}
              />
            </Box>
          </Stack>
          <Stack
            justifyContent={'center'}
            alignItems={'baseline'}
            spacing={2}
            sx={{
              display: 'flex',
              gap: {
                xs: '3px',
                sm: '3px',
                md: '5px',
                lg: '7px',
                xl: '7px'
              },
              rowGap: {
                xs: '3px',
                sm: '3px',
                md: '5px',
                lg: '7px',
                xl: '7px'
              },
              columnGap: {
                xs: '5px',
                sm: '5px',
                md: '5px',
                lg: '5px',
                xl: '5px'
              }
              // padding: 5
            }}
          >
            <Box
              className={'landing-sections-item'}
              // alignContent={'center'}
              // justifyContent={'center'}
              sx={{
                // border: '1px solid white'
                border: '1px dashed ' + theme.palette.primary.main
              }}
            >
              <Sections
                data={services}
                theme={theme}
              />
            </Box>
          </Stack>
        </Stack>
      </MemoryRouter>
    </ThemeProvider>
  )
}

Landing.propTypes = {
  theme: PropTypes.object
}

export default animated(withRouter(Landing))
