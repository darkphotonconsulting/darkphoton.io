import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import { Node } from '../lib/Node.js'
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

import {
  // eslint-disable-next-line no-unused-vars
  Grid,
  Box
  // Typography
} from '@mui/material'
About.propTypes = {
  limit: PropTypes.number
}
function About ({
  limit = 3,
  ...props
}) {
  React.useEffect(async () => {
    const node = new Node({
      pk: 'person#Aaron Samuel',
      sk: 'profile'
    })
    const data = await node.query({
      pk: 'person#Aaron Samuel',
      sk: 'profile'
    })
    console.log(data)
  }, [])
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
              <h1>About</h1>
            </Box>
          </Grid>
        </Grid>
      </div>
    </MemoryRouter>
  )
}

export default withRouter(About)
