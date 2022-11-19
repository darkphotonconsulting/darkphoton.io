import React from 'react'
import PropTypes from 'prop-types'
import {
  useLocation,
  useHistory,
  MemoryRouter,
  withRouter,
  Link as RouterLink
} from 'react-router-dom'
import {
  Grid,
  Box,
  Link,
  Chip
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse
} from '@fortawesome/pro-duotone-svg-icons'

Crumb.propTypes = {
  theme: PropTypes.object,
  icon: PropTypes.object
}
function Crumb ({
  theme = {},
  icon = (<FontAwesomeIcon icon={faHouse}/>),
  ...props
}) {
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()
  const pathnames = location.pathname.split('/').filter((x) => x)
  return (
    <MemoryRouter
      className={'memory-router'}
      id={'crumb-memory-router'}
      initialEntries={['/']}
      initialIndex={0}
    >
      <div
        className={'crumb-container'}
        style={{
          position: 'absolute',
          display: 'flex',
          top: 5
          // marginLeft: 'auto',
          // marginRight: 'auto',
          // padding: 5
        }}
      >
        <Grid
          className={'crumb-grid'}
          container
          spacing={2}
        >
          {/*
            TODO: refactor such that each crumb is a grid item element
            currently all crumbs are "smooshed" as boxes within a single grid item
          */}
          <Grid
            className={'crumb-grid-item'}
            item
          >
            <Box
              className={'crumb-box'}
            >
              <Link
                className={'crumb-link'}
                to={'/'}
                component={RouterLink}
              >
                <Chip
                  className={'crumb-chip'}
                  id={'application-crumb-chip-home'}
                  label={'Home'}
                  variant='outlined'
                  size='medium'
                  icon={
                    <FontAwesomeIcon
                      icon={faHouse}
                    />
                  }
                />
              </Link>
            </Box>
          </Grid>
          {
            pathnames.map((value, index) => {
              return (
                <Grid
                  key={`crumb-grid-item-${index}`}
                  className={'crumb-grid-item'}
                  id={`crumb-grid-item-${index}`}
                  item
                >
                  <Box
                    key={`crumb-box-${index}`}
                    className={'crumb-box'}
                    id={`crumb-box-${index}`}

                  >
                    <Link
                      key={`crumb-link-${index}`}
                      className={'crumb-link'}
                      id={`crumb-link-${index}`}
                      to={`/${pathnames.slice(0, index + 1).join('/')}`}
                      component={RouterLink}
                    >
                      <Chip
                        label={value}
                        key={`crumb-chip-${index}`}
                        id={`crumb-chip-${index}`}
                        className={'crumb-chip'}
                        variant='outlined'
                        size='medium'
                        icon={icon}
                      />
                    </Link>
                  </Box>
                </Grid>
              )
            })
          }
          {/* {
                pathnames.map((value, index) => {
                  return (
                    <Link
                      className={'application-crumb-link'}
                      key={`breadcrumb-${index}`}
                      to={`/${pathnames.slice(0, index + 1).join('/')}`}
                      component={RouterLink}
                    >
                     <Chip
                        className={'application-crumb-chip'}
                        label={value}
                        variant='outlined'
                     />
                    </Link>
                  )
                })
          } */}
          {/*  */}
        </Grid>
      </div>
    </MemoryRouter>
  )
}

export default withRouter(Crumb)
