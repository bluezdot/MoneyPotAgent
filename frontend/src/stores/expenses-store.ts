import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { Expense, ExpenseCategory } from '@/types'
import { mockExpenses } from '@/mocks/data'

interface ExpensesState {
  expenses: Expense[]
  isLoading: boolean
  setExpenses: (expenses: Expense[]) => void
  addExpense: (expense: Expense) => void
  updateExpense: (expenseId: string, updates: Partial<Expense>) => void
  deleteExpense: (expenseId: string) => void
  reset: () => void
}

export const useExpensesStore = create<ExpensesState>()(
  persist(
    immer((set) => ({
      expenses: mockExpenses,
      isLoading: false,
      setExpenses: (expenses) => set((state) => { state.expenses = expenses }),
      addExpense: (expense) => set((state) => {
        state.expenses.unshift(expense)
      }),
      updateExpense: (expenseId, updates) => set((state) => {
        const expense = state.expenses.find(e => e.id === expenseId)
        if (expense) {
          Object.assign(expense, updates)
        }
      }),
      deleteExpense: (expenseId) => set((state) => {
        state.expenses = state.expenses.filter(e => e.id !== expenseId)
      }),
      reset: () => set((state) => { state.expenses = mockExpenses }),
    })),
    {
      name: 'expenses-storage',
      partialize: (state) => ({ expenses: state.expenses }),
    }
  )
)

// Selectors
export const selectExpensesByCategory = (state: ExpensesState, category: ExpenseCategory) =>
  state.expenses.filter(e => e.category === category)

export const selectExpensesByPot = (state: ExpensesState, potId: string) =>
  state.expenses.filter(e => e.potId === potId)

export const selectTotalExpenses = (state: ExpensesState) =>
  state.expenses.reduce((sum, e) => sum + e.amount, 0)

export const selectMonthlyExpenses = (state: ExpensesState, month: number, year: number) =>
  state.expenses.filter(e => {
    const date = new Date(e.date)
    return date.getMonth() === month && date.getFullYear() === year
  })

export const selectRecurringExpenses = (state: ExpensesState) =>
  state.expenses.filter(e => e.recurring)
