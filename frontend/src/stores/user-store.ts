import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/types'
import { mockUser } from '@/mocks/data'

interface UserState {
  user: UserProfile | null
  isLoading: boolean
  setUser: (user: UserProfile) => void
  updateUser: (updates: Partial<UserProfile>) => void
  completeOnboarding: () => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set((state) => { state.user = user }),
      updateUser: (updates) => set((state) => {
        if (state.user) {
          Object.assign(state.user, updates)
        }
      }),
      completeOnboarding: () => set((state) => {
        if (state.user) {
          state.user.onboardingCompleted = true
        }
      }),
      reset: () => set((state) => { state.user = null }),
    })),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// Initialize with mock data for demo purposes
export const initializeMockUser = () => {
  const { user, setUser } = useUserStore.getState()
  if (!user) {
    setUser({ ...mockUser, onboardingCompleted: false })
  }
}
