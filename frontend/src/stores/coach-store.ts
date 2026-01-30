import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { ChatMessage, AIInsight, QuickAction } from '@/types'
import { mockChatMessages, mockInsights, mockQuickActions } from '@/mocks/data'

interface CoachState {
  messages: ChatMessage[]
  insights: AIInsight[]
  quickActions: QuickAction[]
  isTyping: boolean
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setTyping: (typing: boolean) => void
  addInsight: (insight: AIInsight) => void
  clearChat: () => void
  reset: () => void
}

export const useCoachStore = create<CoachState>()(
  persist(
    immer((set) => ({
      messages: mockChatMessages,
      insights: mockInsights,
      quickActions: mockQuickActions,
      isTyping: false,
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
      }),
    })),
    {
      name: 'coach-storage',
      partialize: (state) => ({
        messages: state.messages,
        insights: state.insights,
      }),
    }
  )
)

// Mock AI response generator
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
