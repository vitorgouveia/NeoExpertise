import {
  createContext,
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { waterLightning, evoAvenger } from '@/stitches.config'

type Theme = typeof waterLightning | typeof evoAvenger

const themes: Record<string, Theme> = {
  waterLightning: waterLightning,
  evoAvenger: evoAvenger,
}

type ThemeContextProps = {
  theme: Theme
  themeClass: string
  themes: typeof themes

  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextProps>(
  {} as ThemeContextProps
)

const DEFAULT_THEME_NAME = 'evoAvenger'

export const ThemeProvider: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes[DEFAULT_THEME_NAME]
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const localTheme = localStorage.getItem('@neo-expertise:theme')

    if (!localTheme || !themes[localTheme]) {
      localStorage.setItem('@neo-expertise:theme', DEFAULT_THEME_NAME)

      return
    }

    setCurrentTheme(themes[localTheme])
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const { classList } = document.body

    Object.values(themes).forEach((theme) => {
      classList.remove(theme.className)
    })

    classList.add(currentTheme.className)
  }, [currentTheme])

  const setTheme = useCallback((theme: Theme) => {
    const activatedTheme = Object.entries(themes).find(
      ([, value]) => value.className === theme.className
    )

    if (!activatedTheme) {
      return
    }

    setCurrentTheme(theme)

    if (typeof window === 'undefined') {
      return
    }

    localStorage.setItem('@neo-expertise:theme', activatedTheme[0])
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeClass: currentTheme.className,
        setTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
