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

// Mock AI response generator - DEPRECATED, use analyzePurchase instead
export const generateMockResponse = (_userMessage: string): ChatMessage => {
  const responses = [
    "That's a great question! Based on your current spending patterns, I'd recommend allocating more to your savings pot this month.",
    "I've analyzed your expenses and noticed some opportunities to optimize. Would you like me to create a detailed breakdown?",
    "Your financial health is looking good! You're on track to meet your emergency fund goal by the projected date.",
    "I can help you with that. Let me run some numbers and show you how this decision might impact your goals.",
    "Based on your goals and current progress, here's what I suggest focusing on this month...",
  ]

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: responses[Math.floor(Math.random() * responses.length)],
    type: 'text',
    timestamp: new Date(),
  }
}
