import { DefaultTheme, DarkTheme, LightTheme } from './themes/DefaultTheme.js'
import {
  faFluxCapacitor,
  faStarship,
  faHeadSideBrain
} from '@fortawesome/pro-duotone-svg-icons'
import {
  faTwitter,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

/**
 * @typedef {Object} Configuration
 * @property {string} title
 * @property {string} subtitle
 * @property {Array} description
 * @property {Object} settings
 */
export const Configuration = {
  meta: {
    person: 'Aaron Samuel',
    company: 'Dark Photon IT Consultation, LLC.'
  },
  title: 'Dark Photon IT, LLC.',
  subtitle: 'solutions for the stars',
  themes: [
    {
      name: 'default',
      theme: { ...DefaultTheme }
    },
    {
      name: 'dark',
      theme: { ...DarkTheme }
    },
    {
      name: 'light',
      theme: { ...LightTheme }
    }
  ],
  settings: {
    appBar: {
      position: 'fixed',
      sections: [
        {
          icon: faStarship,
          name: 'About',
          tooltip: 'About Us',
          path: '/about'
        },
        {
          icon: faFluxCapacitor,
          name: 'Services',
          tooltip: 'Discover Services',
          path: '/services'
        },
        {
          icon: faTwitter,
          name: 'Twitter',
          tooltip: 'Follow us on Twitter',
          path: 'https://twitter.com/darkphotonit'
        },
        {
          icon: faGithub,
          name: 'GitHub',
          tooltip: 'View our code repositories',
          path: 'https://github.com/darkphotonconsulting'
        },
        {
          icon: faHeadSideBrain,
          name: 'Philosophy',
          tooltip: 'Our Philosophy',
          path: '/philosophy'
        }
      ]
    }
  }
}
