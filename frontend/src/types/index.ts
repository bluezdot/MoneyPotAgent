// User Profile
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  monthlyIncome: number
  currency: string
  onboardingCompleted: boolean
  createdAt: Date
}

// Money Pots
export type PotCategory = 'necessities' | 'wants' | 'savings' | 'investments' | 'emergency'

export interface Pot {
  id: string
  name: string
  category: PotCategory
  percentage: number
  currentAmount: number
  targetAmount: number
  color: string
  icon: string
}

// Financial Goals
export type GoalPriority = 'high' | 'medium' | 'low'
export type GoalStatus = 'active' | 'completed' | 'paused'

export interface Milestone {
  id: string
  title: string
  targetAmount: number
  completed: boolean
  completedAt?: Date
}

export interface Goal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  priority: GoalPriority
  status: GoalStatus
  potId: string
  milestones: Milestone[]
  createdAt: Date
}

// Expenses
export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'education'
  | 'other'

export interface Expense {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  potId: string
  date: Date
  recurring?: boolean
  notes?: string
}

// AI Coach
export type MessageRole = 'user' | 'assistant'
export type MessageType = 'text' | 'impact-analysis' | 'trade-off' | 'recommendation' | 'quick-actions'

export interface ImpactAnalysis {
  action: string
  potImpacts: {
    potId: string
    potName: string
    currentAmount: number
    projectedAmount: number
    change: number
  }[]
  goalImpacts: {
    goalId: string
    goalTitle: string
    currentProgress: number
    projectedProgress: number
    delayDays?: number
  }[]
  recommendation: string
}

export interface TradeOff {
  id: string
  title: string
  description: string
  options: {
    id: string
    label: string
    impact: string
    recommended?: boolean
  }[]
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  action: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  type: MessageType
  timestamp: Date
  impactAnalysis?: ImpactAnalysis
  tradeOff?: TradeOff
  quickActions?: QuickAction[]
}

// AI Insights
export interface AIInsight {
  id: string
  title: string
  description: string
  type: 'tip' | 'warning' | 'achievement'
  createdAt: Date
}

// App State
export type Theme = 'light' | 'dark' | 'system'

export interface AppSettings {
  theme: Theme
  notifications: boolean
  currency: string
  language: string
}

// Chart Data Types
export interface ChartDataPoint {
  name: string
  value: number
  fill?: string
}

export interface TimeSeriesDataPoint {
  date: string
  amount: number
}
