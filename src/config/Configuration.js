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
export const Configuration = {
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
          tooltip: 'About Us'
        },
        {
          icon: faFluxCapacitor,
          name: 'Services',
          tooltip: 'Discover Services'
        },
        {
          icon: faTwitter,
          name: 'Twitter',
          tooltip: 'Follow us on Twitter'
        },
        {
          icon: faGithub,
          name: 'GitHub',
          tooltip: 'View our code repositories'
        },
        {
          icon: faHeadSideBrain,
          name: 'Philosophy',
          tooltip: 'Our Philosophy'
        }
      ]
    }
  }
}
