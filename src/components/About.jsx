import './About.css'
import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import { Node } from '../../src/lib/Node.js'
import { LoremIpsum } from 'lorem-ipsum'
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

import {
  scaleLog
} from '@visx/scale'

// import {
//   Masonry
// } from '@mui/lab'
// import { Configuration } from '../config/Configuration.js'

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

function WordCloud ({
  text = 'testing 123'
}) {
  const curatedWords = [
    'Engineering',
    'Technology',
    'Software',
    'People'
  ]
  const getWordData = (text) => {
    const words = text.replace(/\./g, '').split(/\s/)
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
        curated: curatedWords.map(word => word.toLowerCase()).includes(word.toLowerCase())
      }
    })
  }
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
      range: [10, 100]
    })
  }

  // eslint-disable-next-line no-unused-vars
  const setFontSize = (word) => {
    return getFontScale(word)
  }

  const words = getWordData(text)
  return (
    <Box>
      <Typography
      >{JSON.stringify(words)}
      </Typography>
    </Box>
  )
}

WordCloud.propTypes = {
  text: PropTypes.string
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
  const [tierLabels, setTierlabels] = React.useState([])
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
            console.log(json)
            const serviceNames = json.map((s) => s.data.name)
            setServiceLabels((serviceLabels) => [...serviceNames])
            const tierNames = json.map((s) =>
              s.data.tiers.map((t) =>
                t.features.map((f) => f.name)
              )
            )
            setTierlabels((tierLabels) => tierNames)
          }
        })
    }

    if (serviceLabels.length === 0) {
      fetchServices()
    }

    if (Object.keys(about).length === 0) {
      fetchAbout()
    }
    // if (company)
    // fetchAbout()
    if (company.length === 0) {
      fetchCompany()
    }
    // fetchCompany()
  }, [])

  // eslint-disable-next-line no-unused-vars
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()
  return (
    <MemoryRouter>
      <Stack
        // columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
        direction='row'
        spacing={2}
        sx={{
          height: '100%',
          border: '1px solid #000'
        }}
      >
        <Paper
            sx={{
              // flex: '1 1 auto',
              // border: '1px solid ',
              padding: 5,
              // height: '35vh',
              width: '100%'
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: 'calc(.5rem + .333vw)',
                    sm: 'calc(.5rem + .333vw)',
                    md: 'calc(.5rem + .5vw)',
                    lg: 'calc(.5rem + 1vw)',
                    xl: 'calc(.5rem + 1vw)'
                  }
                }}
              >{(company && company.name) ? company.name : 'not ready'}</Typography>
            </Box>
            <Box>
              <WordCloud text={loremText}/>
            </Box>
        </Paper>
        <Paper
            sx={{
              // flex: '1 1 auto',
              padding: 5,
              // height: '35vh',
              width: '100%'
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: 'calc(.5rem + .333vw)',
                    sm: 'calc(.5rem + .333vw)',
                    md: 'calc(.5rem + .5vw)',
                    lg: 'calc(.5rem + 1vw)',
                    xl: 'calc(.5rem + 1vw)'
                  }
                }}
              >{(company && company.about) ? company.about.join(' ') : 'not ready'}</Typography>
            </Box>
        </Paper>
      </Stack>
      {/* <Stack
        direction='row'
        spacing={2}
        sx={{
          width: '100%',
          height: '100%',
          flexWrap: 'nowrap'
          // alignItems: 'center',
          // flex: '1 1 auto'
        }}
      >
      </Stack> */}
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
