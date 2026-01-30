import type {
  UserProfile,
  Pot,
  Goal,
  Expense,
  ChatMessage,
  AIInsight,
} from '@/types'

// User Profile
export const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: undefined,
  monthlyIncome: 5000,
  currency: 'USD',
  onboardingCompleted: true,
  createdAt: new Date('2024-01-15'),
}

// Money Pots
export const mockPots: Pot[] = [
  {
    id: 'pot-1',
    name: 'Necessities',
    category: 'necessities',
    percentage: 50,
    currentAmount: 2500,
    targetAmount: 2500,
    color: '#3b82f6',
    icon: 'Home',
  },
  {
    id: 'pot-2',
    name: 'Wants',
    category: 'wants',
    percentage: 20,
    currentAmount: 850,
    targetAmount: 1000,
    color: '#8b5cf6',
    icon: 'Heart',
  },
  {
    id: 'pot-3',
    name: 'Savings',
    category: 'savings',
    percentage: 15,
    currentAmount: 680,
    targetAmount: 750,
    color: '#10b981',
    icon: 'PiggyBank',
  },
  {
    id: 'pot-4',
    name: 'Investments',
    category: 'investments',
    percentage: 10,
    currentAmount: 500,
    targetAmount: 500,
    color: '#f59e0b',
    icon: 'TrendingUp',
  },
  {
    id: 'pot-5',
    name: 'Emergency',
    category: 'emergency',
    percentage: 5,
    currentAmount: 250,
    targetAmount: 250,
    color: '#ef4444',
    icon: 'Shield',
  },
]

// Financial Goals
export const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    description: '6 months of living expenses for unexpected situations',
    targetAmount: 15000,
    currentAmount: 8500,
    deadline: new Date('2025-06-30'),
    priority: 'high',
    status: 'active',
    potId: 'pot-5',
    milestones: [
      { id: 'm1', title: '1 month expenses', targetAmount: 2500, completed: true, completedAt: new Date('2024-03-15') },
      { id: 'm2', title: '3 months expenses', targetAmount: 7500, completed: true, completedAt: new Date('2024-09-01') },
      { id: 'm3', title: '6 months expenses', targetAmount: 15000, completed: false },
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'goal-2',
    title: 'Vacation to Japan',
    description: 'Two-week trip to Japan including flights and accommodation',
    targetAmount: 4000,
    currentAmount: 1200,
    deadline: new Date('2025-10-01'),
    priority: 'medium',
    status: 'active',
    potId: 'pot-2',
    milestones: [
      { id: 'm4', title: 'Book flights', targetAmount: 1500, completed: false },
      { id: 'm5', title: 'Book hotels', targetAmount: 2500, completed: false },
      { id: 'm6', title: 'Full budget', targetAmount: 4000, completed: false },
    ],
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'goal-3',
    title: 'New Laptop',
    description: 'MacBook Pro for work and personal projects',
    targetAmount: 2500,
    currentAmount: 2100,
    deadline: new Date('2025-03-01'),
    priority: 'low',
    status: 'active',
    potId: 'pot-2',
    milestones: [
      { id: 'm7', title: '50% saved', targetAmount: 1250, completed: true, completedAt: new Date('2024-11-01') },
      { id: 'm8', title: 'Full amount', targetAmount: 2500, completed: false },
    ],
    createdAt: new Date('2024-08-15'),
  },
  {
    id: 'goal-4',
    title: 'Investment Portfolio',
    description: 'Build a diversified investment portfolio',
    targetAmount: 10000,
    currentAmount: 3200,
    deadline: new Date('2026-01-01'),
    priority: 'high',
    status: 'active',
    potId: 'pot-4',
    milestones: [
      { id: 'm9', title: 'First $1000', targetAmount: 1000, completed: true, completedAt: new Date('2024-05-01') },
      { id: 'm10', title: '$5000 milestone', targetAmount: 5000, completed: false },
      { id: 'm11', title: 'Target reached', targetAmount: 10000, completed: false },
    ],
    createdAt: new Date('2024-02-01'),
  },
]

// Expenses
export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    description: 'Rent',
    amount: 1200,
    category: 'utilities',
    potId: 'pot-1',
    date: new Date('2025-01-01'),
    recurring: true,
  },
  {
    id: 'exp-2',
    description: 'Grocery shopping',
    amount: 156.50,
    category: 'food',
    potId: 'pot-1',
    date: new Date('2025-01-28'),
  },
  {
    id: 'exp-3',
    description: 'Netflix subscription',
    amount: 15.99,
    category: 'entertainment',
    potId: 'pot-2',
    date: new Date('2025-01-15'),
    recurring: true,
  },
  {
    id: 'exp-4',
    description: 'Gym membership',
    amount: 49.99,
    category: 'health',
    potId: 'pot-1',
    date: new Date('2025-01-05'),
    recurring: true,
  },
  {
    id: 'exp-5',
    description: 'Coffee with friends',
    amount: 24.50,
    category: 'food',
    potId: 'pot-2',
    date: new Date('2025-01-27'),
  },
  {
    id: 'exp-6',
    description: 'Uber ride',
    amount: 18.75,
    category: 'transport',
    potId: 'pot-1',
    date: new Date('2025-01-26'),
  },
  {
    id: 'exp-7',
    description: 'New headphones',
    amount: 89.99,
    category: 'shopping',
    potId: 'pot-2',
    date: new Date('2025-01-24'),
  },
  {
    id: 'exp-8',
    description: 'Online course',
    amount: 199.00,
    category: 'education',
    potId: 'pot-3',
    date: new Date('2025-01-20'),
  },
  {
    id: 'exp-9',
    description: 'Electric bill',
    amount: 85.00,
    category: 'utilities',
    potId: 'pot-1',
    date: new Date('2025-01-10'),
    recurring: true,
  },
  {
    id: 'exp-10',
    description: 'Restaurant dinner',
    amount: 67.50,
    category: 'food',
    potId: 'pot-2',
    date: new Date('2025-01-22'),
  },
]

// AI Coach Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: "Hi Alex! I'm your AI Financial Coach. I've noticed some interesting patterns in your spending this month. Would you like to review them together?",
    type: 'text',
    timestamp: new Date('2025-01-28T09:00:00'),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Sure, what did you find?',
    type: 'text',
    timestamp: new Date('2025-01-28T09:01:00'),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: "Great question! Your food expenses are 15% higher than last month. This could delay your Japan vacation goal by about 2 weeks. Here's the breakdown:",
    type: 'impact-analysis',
    timestamp: new Date('2025-01-28T09:01:30'),
    impactAnalysis: {
      action: 'Current spending pattern',
      potImpacts: [
        { potId: 'pot-2', potName: 'Wants', currentAmount: 850, projectedAmount: 720, change: -130 },
      ],
      goalImpacts: [
        { goalId: 'goal-2', goalTitle: 'Vacation to Japan', currentProgress: 30, projectedProgress: 27, delayDays: 14 },
      ],
      recommendation: 'Consider reducing dining out by 1-2 times per week to stay on track.',
    },
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'What if I want to buy a new gaming console this month?',
    type: 'text',
    timestamp: new Date('2025-01-28T09:05:00'),
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: "A gaming console purchase ($499) would significantly impact your current allocation. Here are your options:",
    type: 'trade-off',
    timestamp: new Date('2025-01-28T09:05:30'),
    tradeOff: {
      id: 'trade-1',
      title: 'Gaming Console Purchase',
      description: 'How would you like to fund this purchase?',
      options: [
        {
          id: 'opt-1',
          label: 'Delay Japan trip by 1 month',
          impact: 'Take $499 from Wants pot, delay vacation goal',
        },
        {
          id: 'opt-2',
          label: 'Split across 3 months',
          impact: '$166/month from Wants, minimal goal impact',
          recommended: true,
        },
        {
          id: 'opt-3',
          label: 'Wait until laptop goal is complete',
          impact: 'Buy after March, use freed-up budget',
        },
      ],
    },
  },
]

// AI Insights
export const mockInsights: AIInsight[] = [
  {
    id: 'insight-1',
    title: 'Great saving streak!',
    description: "You've hit your savings target for 3 consecutive months. Keep it up!",
    type: 'achievement',
    createdAt: new Date('2025-01-25'),
  },
  {
    id: 'insight-2',
    title: 'Subscription review',
    description: 'You have 5 active subscriptions totaling $89/month. Review for potential savings.',
    type: 'tip',
    createdAt: new Date('2025-01-20'),
  },
  {
    id: 'insight-3',
    title: 'Emergency fund progress',
    description: "You're 57% toward your emergency fund goal. At this rate, you'll reach it by June!",
    type: 'tip',
    createdAt: new Date('2025-01-15'),
  },
]

// Quick Actions for AI Coach
export const mockQuickActions = [
  { id: 'qa-1', label: 'Review budget', icon: 'PieChart', action: 'review-budget' },
  { id: 'qa-2', label: 'Log expense', icon: 'Plus', action: 'log-expense' },
  { id: 'qa-3', label: 'Check goals', icon: 'Target', action: 'check-goals' },
  { id: 'qa-4', label: 'Get savings tip', icon: 'Lightbulb', action: 'savings-tip' },
]

// Category colors for expenses
export const expenseCategoryColors: Record<string, { bg: string; text: string }> = {
  food: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  transport: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  utilities: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  entertainment: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  shopping: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
  health: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  education: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
  other: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
}

// Category icons
export const expenseCategoryIcons: Record<string, string> = {
  food: 'Utensils',
  transport: 'Car',
  utilities: 'Home',
  entertainment: 'Film',
  shopping: 'ShoppingBag',
  health: 'Heart',
  education: 'GraduationCap',
  other: 'MoreHorizontal',
}
