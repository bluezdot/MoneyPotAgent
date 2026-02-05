import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type {
  ChatMessage,
  AIInsight,
  QuickAction,
  PurchaseImpactRequest,
  PurchaseImpactResult,
  NegotiationSession
} from '@/types'
import { mockChatMessages, mockInsights, mockQuickActions } from '@/mocks/data'
import { analyzePurchaseImpact } from '@/lib/purchase-analyzer'
import { usePotsStore } from './pots-store'
import { useGoalsStore } from './goals-store'
import { useUserStore } from './user-store'

interface CoachState {
  messages: ChatMessage[]
  insights: AIInsight[]
  quickActions: QuickAction[]
  isTyping: boolean
  purchaseAnalyses: PurchaseImpactResult[]
  currentNegotiation: NegotiationSession | null

  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setTyping: (typing: boolean) => void
  addInsight: (insight: AIInsight) => void
  clearChat: () => void
  reset: () => void
  analyzePurchase: (request: PurchaseImpactRequest) => PurchaseImpactResult | null
  setNegotiation: (session: NegotiationSession | null) => void
}

export const useCoachStore = create<CoachState>()(
  persist(
    immer((set, get) => ({
      messages: mockChatMessages,
      insights: mockInsights,
      quickActions: mockQuickActions,
      isTyping: false,
      purchaseAnalyses: [],
      currentNegotiation: null,

      setMessages: (messages) => set((state) => { state.messages = messages }),

      addMessage: (message) => set((state) => {
        state.messages.push(message)
      }),

      setTyping: (typing) => set((state) => { state.isTyping = typing }),

      addInsight: (insight) => set((state) => {
        state.insights.unshift(insight)
      }),

      clearChat: () => set((state) => {
        state.messages = [{
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: "Hi! I'm your AI Financial Coach. How can I help you today?",
          type: 'text',
          timestamp: new Date(),
        }]
      }),

      reset: () => set((state) => {
        state.messages = mockChatMessages
        state.insights = mockInsights
        state.purchaseAnalyses = []
        state.currentNegotiation = null
      }),

      analyzePurchase: (request: PurchaseImpactRequest) => {
        // Get current state from other stores
        const pots = usePotsStore.getState().pots
        const goals = useGoalsStore.getState().goals
        const user = useUserStore.getState().user

        if (!user) {
          console.error('No user found for purchase analysis')
          return null
        }

        // Run analysis
        const result = analyzePurchaseImpact(request, pots, goals, user)

        // Store analysis in state
        set((state) => {
          state.purchaseAnalyses.push(result)
        })

        return result
      },

      setNegotiation: (session) => set((state) => {
        state.currentNegotiation = session
      }),
    })),
    {
      name: 'coach-storage',
      partialize: (state) => ({
        messages: state.messages,
        insights: state.insights,
        purchaseAnalyses: state.purchaseAnalyses,
      }),
    }
  )
)

// Smart AI response generator using actual user data
export const generateMockResponse = (userMessage: string): ChatMessage => {
  // Get real data from stores
  const pots = usePotsStore.getState().pots
  const goals = useGoalsStore.getState().goals
  const user = useUserStore.getState().user

  // Analyze user message for intent
  const messageLower = userMessage.toLowerCase()

  // Calculate real metrics
  const totalBalance = pots.reduce((sum, pot) => sum + pot.currentAmount, 0)
  const activeGoals = goals.filter(g => g.status === 'active')
  const goalProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / activeGoals.length * 100
    : 0

  // Emergency fund check
  const emergencyPot = pots.find(p => p.category === 'emergency')
  const emergencyRatio = emergencyPot
    ? (emergencyPot.currentAmount / emergencyPot.targetAmount) * 100
    : 0

  let responseContent = ''

  // Context-aware responses based on actual data
  if (messageLower.includes('goal') || messageLower.includes('progress')) {
    if (activeGoals.length === 0) {
      responseContent = "I notice you don't have any active goals yet. Setting financial goals is a great way to stay motivated! Would you like me to help you create one?"
    } else {
      const closestGoal = activeGoals.reduce((closest, goal) => {
        const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        const closestDays = Math.ceil((new Date(closest.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return daysLeft < closestDays ? goal : closest
      })

      const progress = Math.round((closestGoal.currentAmount / closestGoal.targetAmount) * 100)
      const daysLeft = Math.ceil((new Date(closestGoal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      responseContent = `Great question! Your "${closestGoal.title}" goal is ${progress}% complete with ${daysLeft} days remaining. ${progress >= 75 ? "You're doing amazing! 🎉" :
          progress >= 50 ? "You're making solid progress! Keep it up!" :
            "Let's work together to accelerate your progress!"
        }`
    }
  } else if (messageLower.includes('save') || messageLower.includes('saving')) {
    const savingsPot = pots.find(p => p.category === 'savings')
    if (savingsPot) {
      const percentage = Math.round((savingsPot.currentAmount / totalBalance) * 100)
      responseContent = `Your savings currently make up ${percentage}% of your total balance ($${savingsPot.currentAmount.toFixed(0)}). ${percentage >= 30 ? "Excellent savings rate!" :
          percentage >= 20 ? "Good progress, but there's room to save more!" :
            "I'd recommend increasing your savings allocation to at least 20% of your income."
        }`
    } else {
      responseContent = "I notice you don't have a dedicated savings pot yet. Setting aside even a small percentage each month can make a big difference!"
    }
  } else if (messageLower.includes('emergency') || messageLower.includes('fund')) {
    if (emergencyPot) {
      responseContent = `Your emergency fund is at ${emergencyRatio.toFixed(0)}% of your target ($${emergencyPot.currentAmount.toFixed(0)} / $${emergencyPot.targetAmount.toFixed(0)}). ${emergencyRatio >= 100 ? "Fully funded! Excellent financial security! ✅" :
          emergencyRatio >= 50 ? "You're halfway there! Keep building that safety net." :
            "This should be a priority. I recommend allocating more to reach at least 3-6 months of expenses."
        }`
    } else {
      responseContent = "An emergency fund is crucial for financial security! I recommend setting up an emergency pot with 3-6 months of expenses as your target."
    }
  } else if (messageLower.includes('spend') || messageLower.includes('expenses')) {
    const wantsPot = pots.find(p => p.category === 'wants')
    const needsPot = pots.find(p => p.category === 'necessities')

    if (wantsPot && needsPot) {
      const wantsRatio = Math.round((wantsPot.percentage / (wantsPot.percentage + needsPot.percentage)) * 100)
      responseContent = `Your spending is split ${wantsRatio}% wants vs ${100 - wantsRatio}% necessities. ${wantsRatio > 40 ? "You're spending quite a bit on wants. Consider reducing this to save more!" :
          wantsRatio > 30 ? "Balanced spending! You're doing well." :
            "You're very disciplined with discretionary spending!"
        }`
    } else {
      responseContent = "I can help you analyze your spending patterns. Would you like to see a breakdown of your expenses?"
    }
  } else if (messageLower.includes('budget') || messageLower.includes('allocation')) {
    const totalAllocation = pots.reduce((sum, pot) => sum + pot.percentage, 0)
    responseContent = `Your current pot allocation totals ${totalAllocation}%. ${totalAllocation === 100 ? "Perfect! Your budget is fully allocated." :
        totalAllocation > 100 ? "⚠️ You're over 100%! Let's rebalance your pots." :
          `You have ${100 - totalAllocation}% unallocated. Consider distributing this to your goals or emergency fund.`
      } Here's the breakdown:\n\n${pots.map(p => `• ${p.name}: ${p.percentage}% ($${p.currentAmount.toFixed(0)})`).join('\n')}`
  } else if (messageLower.includes('help') || messageLower.includes('what can')) {
    responseContent = `I'm here to help you make smart financial decisions! I can:\n\n✨ Analyze purchase impacts before you buy\n📊 Track your progress toward goals\n💰 Optimize your pot allocations\n🎯 Suggest ways to accelerate your goals\n⚠️ Alert you about risky spending\n\nWhat would you like to explore?`
  } else {
    // Generic contextual response
    const responses = [
      `Based on your current balance of $${totalBalance.toFixed(0)} across ${pots.length} pots, ${totalBalance > (user?.monthlyIncome || 5000) * 2 ? "you're in great financial shape!" :
        "let's work on building up your savings."
      }`,
      `I see you're ${Math.round(goalProgress)}% of the way to your active goals. ${goalProgress >= 70 ? "Fantastic progress!" : "Let me help you accelerate that!"
      }`,
      `Your financial health is ${emergencyRatio >= 100 && goalProgress >= 50 ? "excellent" :
        emergencyRatio >= 50 || goalProgress >= 30 ? "good" :
          "showing potential for improvement"
      }. ${activeGoals.length > 0 ? `Keep focusing on "${activeGoals[0].title}"!` :
        "Setting clear goals will help you stay motivated."
      }`,
    ]

    responseContent = responses[Math.floor(Math.random() * responses.length)]
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: responseContent,
    type: 'text',
    timestamp: new Date(),
  }
}
