import React from 'react'
import PropTypes from 'prop-types'
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
Services.propTypes = {
  limit: PropTypes.number
}
function Services ({
  limit = 3,
  ...props
}) {
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
              <h1>Services</h1>
            </Box>
          </Grid>
        </Grid>
      </div>
    </MemoryRouter>
  )
}

export default withRouter(Services)
