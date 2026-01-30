import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { Goal, GoalStatus, GoalPriority } from '@/types'
import { mockGoals } from '@/mocks/data'

interface GoalsState {
  goals: Goal[]
  isLoading: boolean
  setGoals: (goals: Goal[]) => void
  addGoal: (goal: Goal) => void
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  deleteGoal: (goalId: string) => void
  updateGoalProgress: (goalId: string, amount: number) => void
  completeMilestone: (goalId: string, milestoneId: string) => void
  updateGoalStatus: (goalId: string, status: GoalStatus) => void
  reset: () => void
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    immer((set) => ({
      goals: mockGoals,
      isLoading: false,
      setGoals: (goals) => set((state) => { state.goals = goals }),
      addGoal: (goal) => set((state) => { state.goals.push(goal) }),
      updateGoal: (goalId, updates) => set((state) => {
        const goal = state.goals.find(g => g.id === goalId)
        if (goal) {
          Object.assign(goal, updates)
        }
      }),
      deleteGoal: (goalId) => set((state) => {
        state.goals = state.goals.filter(g => g.id !== goalId)
      }),
      updateGoalProgress: (goalId, amount) => set((state) => {
        const goal = state.goals.find(g => g.id === goalId)
        if (goal) {
          goal.currentAmount = Math.min(amount, goal.targetAmount)
          if (goal.currentAmount >= goal.targetAmount) {
            goal.status = 'completed'
          }
        }
      }),
      completeMilestone: (goalId, milestoneId) => set((state) => {
        const goal = state.goals.find(g => g.id === goalId)
        if (goal) {
          const milestone = goal.milestones.find(m => m.id === milestoneId)
          if (milestone) {
            milestone.completed = true
            milestone.completedAt = new Date()
          }
        }
      }),
      updateGoalStatus: (goalId, status) => set((state) => {
        const goal = state.goals.find(g => g.id === goalId)
        if (goal) {
          goal.status = status
        }
      }),
      reset: () => set((state) => { state.goals = mockGoals }),
    })),
    {
      name: 'goals-storage',
      partialize: (state) => ({ goals: state.goals }),
    }
  )
)

// Selectors
export const selectActiveGoals = (state: GoalsState) =>
  state.goals.filter(g => g.status === 'active')

export const selectCompletedGoals = (state: GoalsState) =>
  state.goals.filter(g => g.status === 'completed')

export const selectGoalsByPriority = (state: GoalsState, priority: GoalPriority) =>
  state.goals.filter(g => g.priority === priority && g.status === 'active')
