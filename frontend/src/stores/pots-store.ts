import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { Pot } from '@/types'
import { mockPots } from '@/mocks/data'

interface PotsState {
  pots: Pot[]
  isLoading: boolean
  setPots: (pots: Pot[]) => void
  updatePotPercentage: (potId: string, percentage: number) => void
  updatePotAmount: (potId: string, amount: number) => void
  addToPot: (potId: string, amount: number) => void
  withdrawFromPot: (potId: string, amount: number) => void
  reset: () => void
}

export const usePotsStore = create<PotsState>()(
  persist(
    immer((set) => ({
      pots: mockPots,
      isLoading: false,
      setPots: (pots) => set((state) => { state.pots = pots }),
      updatePotPercentage: (potId, percentage) => set((state) => {
        const pot = state.pots.find(p => p.id === potId)
        if (pot) {
          pot.percentage = percentage
        }
      }),
      updatePotAmount: (potId, amount) => set((state) => {
        const pot = state.pots.find(p => p.id === potId)
        if (pot) {
          pot.currentAmount = amount
        }
      }),
      addToPot: (potId, amount) => set((state) => {
        const pot = state.pots.find(p => p.id === potId)
        if (pot) {
          pot.currentAmount += amount
        }
      }),
      withdrawFromPot: (potId, amount) => set((state) => {
        const pot = state.pots.find(p => p.id === potId)
        if (pot && pot.currentAmount >= amount) {
          pot.currentAmount -= amount
        }
      }),
      reset: () => set((state) => { state.pots = mockPots }),
    })),
    {
      name: 'pots-storage',
      partialize: (state) => ({ pots: state.pots }),
    }
  )
)

// Selectors
export const selectTotalAllocated = (state: PotsState) =>
  state.pots.reduce((sum, pot) => sum + pot.currentAmount, 0)

export const selectTotalPercentage = (state: PotsState) =>
  state.pots.reduce((sum, pot) => sum + pot.percentage, 0)
