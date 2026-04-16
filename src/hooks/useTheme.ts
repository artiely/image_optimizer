import { useEffect, useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

type Theme = 'light' | 'dark' | 'system'
type EffectiveTheme = 'light' | 'dark'

export function useTheme() {
  const { theme, updateSettings } = useSettingsStore()
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light')

  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setEffectiveTheme(isDark ? 'dark' : 'light')
      } else {
        setEffectiveTheme(theme)
      }
    }

    updateEffectiveTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateEffectiveTheme)

    if (window.electronAPI?.onSystemThemeChanged) {
      window.electronAPI.onSystemThemeChanged((systemTheme) => {
        if (theme === 'system') {
          setEffectiveTheme(systemTheme as EffectiveTheme)
        }
      })
    }

    return () => {
      mediaQuery.removeEventListener('change', updateEffectiveTheme)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    updateSettings({ theme: newTheme })
  }

  return { theme, effectiveTheme, setTheme }
}
