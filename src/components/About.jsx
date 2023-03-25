import './About.css'
import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import { Node } from '../../src/lib/Node.js'
import { LoremIpsum } from 'lorem-ipsum'
// import * as Colors from '@mui/material/colors'
import {
  useLocation,
  useHistory,
  MemoryRouter,
  withRouter
} from 'react-router-dom'

import {
  // Grid,
  Stack,
  Box,
  Paper,
  Typography
} from '@mui/material'

import ParentSize from '@visx/responsive/lib/components/ParentSize'
import {
  scaleLog
} from '@visx/scale'

import {
  // eslint-disable-next-line no-unused-vars
  Text
} from '@visx/text'

// eslint-disable-next-line no-unused-vars
import WordCloud from '@visx/wordcloud/lib/Wordcloud'

import GoogleMapReact from 'google-map-react'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})
// eslint-disable-next-line no-unused-vars
const loremText = lorem.generateParagraphs(1)

function GoogleMap ({
  center = {
    lat: 40.7128,
    lng: -74.0060
  },
  zoom = 5,
  ...props
}) {
  const [apiKey, setApiKey] = React.useState(null)
  React.useEffect(() => {
    const fetchApiKey = async () => {
      fetch(
        'http://localhost:3001/env/google_maps_key',
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
          setApiKey(json)
        })
    }

    if (!apiKey) {
      fetchApiKey()
    }
  })
  if (!apiKey) {
    return (<Box>location</Box>)
  } else {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: apiKey,
          language: 'en'
        }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
      </GoogleMapReact>
    )
  }
}

GoogleMap.propTypes = {
  center: PropTypes.object,
  zoom: PropTypes.number
}
function CompanyWords ({
  text = 'testing 123',
  colors = [
    '#143059', '#2F6B9A', '#82a6c2'
  ],
  theme = {}
}) {
  const curatedWords = [
    'Engineering',
    'Technology',
    'Software',
    'People'
  ]
  const excludedWords = [
    'The',
    'And',
    '&'
  ]
  const getWordData = (text) => {
    const words = text.replace(/\./g, '').split(/\n/)
    const frequencyMap = {}
    const lengthMap = {}
    for (const word of words) {
      if (!frequencyMap[word]) {
        frequencyMap[word] = 0
      } else {
        frequencyMap[word] += 1
      }
      if (!lengthMap[word]) {
        lengthMap[word] = word.length
      }
    }
    return Object.keys(frequencyMap).map((word) => {
      return {
        text: word,
        frequency: frequencyMap[word],
        length: lengthMap[word],
        curated: curatedWords.map(w => w.toLowerCase()).includes(word.toLowerCase()),
        excluded: excludedWords.map(w => w.toLowerCase()).includes(word.toLowerCase())
      }
    })
  }
  const words = getWordData(text)

  // eslint-disable-next-line no-unused-vars
  const getWordRotation = () => {
    const random = Math.random()
    const degree = random > 0.5 ? 60 : -60
    return random * degree
  }

  // eslint-disable-next-line no-unused-vars
  const getFontScale = (words) => {
    return scaleLog({
      domain: [
        Math.min(...words.map((d) => d.length)),
        Math.max(...words.map((d) => d.length))
      ],
      range: [15, 35]
    })
  }

  // eslint-disable-next-line no-unused-vars
  const setFontSize = (word) => {
    // this should account for the size of the word as well as size of the container
    return getFontScale(words)(word.length)
  }

  return (
    <Box
      className={'word-cloud'}
      sx={{
        height: '85%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10%'
      }}
    >
      <ParentSize
        debounceTime={5}
      >
        {
          ({ width: visWidth, height: visHeight }) => {
            const maxHeight = 500
            return (
                <WordCloud
                  width={
                    visWidth
                  }
                  height={
                    Math.min(visHeight, maxHeight)
                  }
                  words={words}
                  fontSize={setFontSize}
                  padding={10}
                  spiral={'archimedean'}
                  rotate={getWordRotation}
                  random={() => 0.5}
              >
                {
                  (cloud) =>
                    cloud.map((word, i) => {
                      return (
                        <Text
                          key={`word-cloud-${i}`}
                          fill={colors[i % colors.length]}
                          textAnchor={'middle'}
                          transform={ `translate(${word.x}, ${word.y}) rotate(${word.rotate})` }
                          fontSize={word.fontSize}
                          fontFamily={word.font}
                          fontWeight={ i % 2 === 0 ? 'bold' : 'normal' }
                        >
                          {word.text}
                        </Text>
                      )
                    })
                }
              </WordCloud>
            )
          }
        }
      </ParentSize>
      {/* <Typography
      >{JSON.stringify(words)}
      </Typography> */}
    </Box>
  )
}

CompanyWords.propTypes = {
  text: PropTypes.string,
  colors: PropTypes.array,
  theme: PropTypes.object
}

function About ({
  state = {},
  setState = () => {},
  limit = 3,
  pk = 'person#Aaron Samuel',
  sk = 'profile',
  config = {},
  theme = {},
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const [about, setAbout] = React.useState({})
  const [company, setCompany] = React.useState([])
  const [serviceLabels, setServiceLabels] = React.useState([])
  // eslint-disable-next-line no-unused-vars
  const [featureLabels, setFeatureLabels] = React.useState([])
  React.useEffect(() => {
    const fetchAbout = async () => {
      fetch(
        'http://localhost:3001/about',
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
          setAbout(json)
        })
    }

    const fetchCompany = async () => {
      fetch(
        'http://localhost:3001/companies',
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
          // I should really fix the fetch to get the right thing
          const search = json.find((c) => c._sk === `company#${config.meta.company}`)
          setCompany(JSON.parse(search.data))
        })
    }

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
          if (serviceLabels.length === 0) {
            const serviceNames = json.map((s) => s.data.name)
            setServiceLabels((serviceLabels) => [...serviceNames])
            const tiers = []
            for (const service of json) {
              for (const tier of service.data.tiers) {
                tiers.push(tier)
              }
            }
            const features = []
            for (const tier of tiers) {
              for (const feature of tier.features) {
                features.push(feature.name)
              }
            }
            setFeatureLabels((featureLabels) => Array.from(new Set(features)))
          }
        })
    }

    if (serviceLabels.length === 0) {
      fetchServices()
    }

    if (Object.keys(about).length === 0) {
      fetchAbout()
    }
    if (company.length === 0) {
      fetchCompany()
    }
  }, [])

  // eslint-disable-next-line no-unused-vars
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()
  return (
    <MemoryRouter
      initialEntries={['/about']}
    >
      <Stack
        direction={{
          xs: 'column',
          sm: 'column',
          md: 'row',
          lg: 'row',
          xl: 'row'
        }}
        spacing={{
          xs: 0,
          sm: 2,
          md: 4,
          lg: 6,
          xl: 8
        }}
        sx={{
          flex: '1 1 auto',
          overflow: {
            xs: 'hidden',
            sm: 'hidden',
            md: 'hidden',
            lg: 'hidden',
            xl: 'hidden'
          },
          height: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: '100%',
            xl: '100%'
          },
          width: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: '100%',
            xl: '100%'
          },
          padding: {
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
            xl: 3
          }
        }}
      >
        <Stack
            spacing={5}
            sx={{
              // flex: '1 1 auto',
              backgroundColor: theme.palette.primary.main,
              padding: 5,
              width: {
                xs: '75%',
                sm: '75%',
                md: '75%',
                lg: '50%',
                xl: '50%'
              },
              '&:hover': {
                backgroundColor: theme.palette.secondary.main
              }
            }}
          >
              <Box
                sx={{
                  flex: '1 1 auto'
                  // border: '1px solid black'
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: 'calc(.5rem + .333vw)',
                      sm: 'calc(.5rem + .333vw)',
                      md: 'calc(.5rem + .5vw)',
                      lg: 'calc(.5rem + .75vw)',
                      xl: 'calc(.5rem + .75vw)'
                    }
                  }}
                >{(company && company.name) ? 'Service Cloud' : 'not ready'}</Typography>
              </Box>
              <CompanyWords
                  theme={theme}
                  text={
                    featureLabels.length
                      ? featureLabels.join('\n')
                      : 'blah'
                  }
              />
              <Box
                sx={{
                  flex: '1 1 auto',
                  width: '100%',
                  height: '50vh'
                  // border: '1px solid black',
                  // padding: 5
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: 'calc(.5rem + .333vw)',
                      sm: 'calc(.5rem + .333vw)',
                      md: 'calc(.5rem + .5vw)',
                      lg: 'calc(.5rem + .75vw)',
                      xl: 'calc(.5rem + .75vw)'
                    }
                  }}
                ></Typography>
                <GoogleMap/>
              </Box>
        </Stack>
        <Paper
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: 5,
              width: {
                xs: '100%',
                sm: '100%',
                md: '50%',
                lg: '50%',
                xl: '50%'
              },
              '&:hover': {
                backgroundColor: theme.palette.secondary.main
              }
            }}
          >
            <Box
              sx={{
                flex: '1 1 auto',
                backgroundColor: theme.palette.primary.main
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 'calc(.1rem + 25%)',
                    md: 'calc(.2rem + 30%)',
                    lg: 'calc(.3rem + 35%)',
                    xl: 'calc(.4rem + 45%)'
                  }
                }}
              >{(company && company.about) ? company.about.join(' ') : 'not ready'}</Typography>
            </Box>
        </Paper>
      </Stack>
    </MemoryRouter>
  )
}

About.propTypes = {
  state: PropTypes.object,
  setState: PropTypes.func,
  limit: PropTypes.number,
  pk: PropTypes.string,
  sk: PropTypes.string,
  config: PropTypes.object,
  theme: PropTypes.object
}

export default withRouter(About)
