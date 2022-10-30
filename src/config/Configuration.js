import { DefaultTheme } from './themes/DefaultTheme.js'
export const Configuration = {
  title: 'Dark Photon IT, LLC.',
  subtitle: 'solutions for the stars',
  themes: [
    {
      name: 'default',
      theme: { ...DefaultTheme }
    }
  ]
}
