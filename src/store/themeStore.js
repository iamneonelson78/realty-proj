import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system', // 'light' | 'dark' | 'system'
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      initTheme: () => {
        const { theme } = get()
        applyTheme(theme)
        // Watch system changes only when set to 'system'
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        mq.addEventListener('change', () => {
          if (get().theme === 'system') applyTheme('system')
        })
      },
    }),
    { name: 'rental-crm-theme' }
  )
)
