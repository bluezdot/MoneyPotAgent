import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { Theme, AppSettings } from '@/types'

interface AppState {
  settings: AppSettings
  sidebarOpen: boolean
  currentPage: string
  updateSettings: (updates: Partial<AppSettings>) => void
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCurrentPage: (page: string) => void
  reset: () => void
}

const defaultSettings: AppSettings = {
  theme: 'light',
  notifications: true,
  currency: 'USD',
  language: 'en',
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      settings: defaultSettings,
      sidebarOpen: false,
      currentPage: 'dashboard',
      updateSettings: (updates) => set((state) => {
        Object.assign(state.settings, updates)
      }),
      setTheme: (theme) => set((state) => {
        state.settings.theme = theme
      }),
      toggleSidebar: () => set((state) => {
        state.sidebarOpen = !state.sidebarOpen
      }),
      setSidebarOpen: (open) => set((state) => {
        state.sidebarOpen = open
      }),
      setCurrentPage: (page) => set((state) => {
        state.currentPage = page
      }),
      reset: () => set((state) => {
        state.settings = defaultSettings
        state.sidebarOpen = false
        state.currentPage = 'dashboard'
      }),
    })),
    {
      name: 'app-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)
