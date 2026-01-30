import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

interface CountState {
    count: number
    increment: () => void
    decrement: () => void
    reset: () => void
}

export const useCountStore = create<CountState>()(
    persist(
        immer((set) => ({
            count: 0,
            increment: () => set((state) => { state.count += 1 }),
            decrement: () => set((state) => { state.count -= 1 }),
            reset: () => set((state) => { state.count = 0 }),
        })),
        {
            name: 'count-storage',
            partialize: (state) => ({ count: state.count }),
        }
    )
)
