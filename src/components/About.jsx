import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import { Node } from '../../src/lib/Node.js'
import {
  useLocation,
  useHistory,
  MemoryRouter,
  withRouter
} from 'react-router-dom'

import {
  Grid,
  Box,
  Typography
} from '@mui/material'

function About ({
  state = {},
  setState = () => {},
  limit = 3,
  pk = 'person#Aaron Samuel',
  sk = 'profile',
  ...props
}) {
  const [about, setAbout] = React.useState({})
  React.useEffect(() => {
    const fetchServices = async () => {
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
    fetchServices()
  }, [about])

  // eslint-disable-next-line no-unused-vars
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()
  return (
    <MemoryRouter>
      <div>
        <Grid
          container
        >
          <Grid
            item
          >
            <Box>
              <Typography>{about.name}</Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
    </MemoryRouter>
  )
}

About.propTypes = {
  state: PropTypes.object,
  setState: PropTypes.func,
  limit: PropTypes.number,
  pk: PropTypes.string,
  sk: PropTypes.string
}

export default withRouter(About)
