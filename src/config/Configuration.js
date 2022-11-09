import { DefaultTheme, DarkTheme, LightTheme } from './themes/DefaultTheme.js'
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
      position: 'fixed'
    }
  }
}
