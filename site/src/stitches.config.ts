import { createStitches, globalCss } from '@stitches/react'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: '$darkerGrotesque',
  },
  button: {
    cursor: 'pointer',
  },
  'button, input, select, textarea': {
    border: 0,
    outline: 0,
    background: 'inherit',
    color: 'inherit',
  },
  a: {
    cursor: 'pointer',
    color: 'inherit',
    textDecoration: 'none',
  },
  ul: {
    listStyle: 'none',
  },
  body: {
    background: '$grayDarkest',
    color: '$grayLightest',
    fontFamily: '$darkerGrotesque',
    fontSize: '$fontSize100',
  },
  '.mobile-menu-overlay': {
    '&:after': {
      content: '',

      width: '100%',
      height: '100%',

      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      background: 'rgba(0, 0, 0, 0.50)',
      zIndex: 10,
    },
  },
})

export const { styled, createTheme, theme, keyframes, getCssText } =
  createStitches({
    theme: {
      fonts: {
        darkerGrotesque: 'Darker Grotesque',
      },

      fontSizes: {
        // min font size 18, step 6px
        small: '14px',
        paragraph: '20px',
        h6: '26px',
        h5: '32px',
        h4: '38px',
        h3: '44px',
        h2: '50px',
        h1: '56px',
      },

      fontWeights: {
        semibold: '600',
        light: '300',
      },

      sizes: {
        50: '0.25rem',
        100: '0.5rem',
        200: '1rem',
        300: '1.5rem',
        400: '2rem',
        500: '2.5rem',
        600: '3rem',
        700: '3.5rem',
        800: '4rem',
        900: '4.5rem',
        1000: '5rem',
      },

      colors: {
        grayDarkest: 'hsl(234, 20%, 6%)',
        grayDarker: 'hsl(234, 20%, 12%)',
        grayNormal: 'hsl(234, 20%, 20%)',
        grayLighter: 'hsl(234, 20%, 55%)',
        grayLightest: 'hsl(234, 20%, 90%)',

        primaryDarkest: 'hsl(280, 60%, 10%)',
        primaryDarker: 'hsl(280, 60%, 20%)',
        primaryNormal: 'hsl(280, 60%, 55%)',
        primaryLighter: 'hsl(280, 60%, 90%)',

        dangerDarkest: 'hsl(360, 60%, 10%)',
        dangerDarker: 'hsl(360, 60%, 20%)',
        dangerNormal: 'hsl(360, 60%, 55%)',
        dangerLighter: 'hsl(360, 60%, 90%)',

        warningDarkest: 'hsl(55, 60%, 10%)',
        warningDarker: 'hsl(55, 60%, 20%)',
        warningNormal: 'hsl(55, 60%, 55%)',
        warningLighter: 'hsl(55, 60%, 90%)',

        successDarkest: 'hsl(100, 60%, 10%)',
        successDarker: 'hsl(100, 60%, 20%)',
        successNormal: 'hsl(100, 60%, 55%)',
        successLighter: 'hsl(100, 60%, 90%)',
      },
    },
    media: {
      mobile: '(max-width: 640px)',
      tablet: '(min-width: 640px)',
      desktop: '(min-width: 1024px)',
    },
  })

export const waterLightning = createTheme({
  colors: {
    grayDarkest: 'hsl(234, 20%, 90%)',
    grayDarker: 'hsl(234, 20%, 95%)',
    grayNormal: 'hsl(234, 20%, 80%)',
    grayLighter: 'hsl(234, 20%, 10%)',
    grayLightest: 'hsl(234, 20%, 60%)',
  },
})

export const evoAvenger = createTheme({})
