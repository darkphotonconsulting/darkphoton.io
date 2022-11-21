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
  Box
} from '@mui/material'

function About ({
  state = {},
  setState = () => {},
  limit = 3,
  pk = 'person#Aaron Samuel',
  sk = 'profile',
  ...props
}) {
  React.useEffect(() => {
    const fetchData = async () => {
      const node = new Node({
        pk,
        sk
      })
      const data = await node.query({
        pk,
        sk
      })
      console.log(data)
      console.log('env: ', process.env)
    }
    fetchData()
  }, [state])
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
              <h1>Aboutl</h1>
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
