import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHeader } from '@/components/layout/page-header'
import {
  Send,
  Sparkles,
  PieChart,
  Plus,
  Target,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Bot,
  User,
} from 'lucide-react'
import { useCoachStore, generateMockResponse } from '@/stores/coach-store'
import { cn } from '@/lib/utils'
import type { ChatMessage, ImpactAnalysis, TradeOff, QuickAction } from '@/types'

const quickActionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PieChart,
  Plus,
  Target,
  Lightbulb,
}

function ImpactAnalysisCard({ analysis }: { analysis: ImpactAnalysis }) {
  return (
    <Card className="mt-3 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-sm">Impact Analysis</span>
        </div>

        {/* Pot Impacts */}
        {analysis.potImpacts.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-medium text-muted-foreground">Pot Impact</p>
            {analysis.potImpacts.map((impact) => (
              <div key={impact.potId} className="flex items-center justify-between text-sm">
                <span>{impact.potName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    ${impact.currentAmount.toLocaleString()}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className={cn(
                    'font-medium',
                    impact.change < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  )}>
                    ${impact.projectedAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Goal Impacts */}
        {analysis.goalImpacts.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-medium text-muted-foreground">Goal Impact</p>
            {analysis.goalImpacts.map((impact) => (
              <div key={impact.goalId} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span>{impact.goalTitle}</span>
                  {impact.delayDays && (
                    <Badge variant="secondary" className="text-[10px]">
                      +{impact.delayDays} days delay
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{impact.currentProgress}%</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className={cn(
                    impact.projectedProgress < impact.currentProgress ? 'text-red-600' : 'text-green-600'
                  )}>
                    {impact.projectedProgress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendation */}
        <div className="pt-3 border-t border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm">{analysis.recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TradeOffCard({ tradeOff, onSelect }: { tradeOff: TradeOff; onSelect: (optionId: string) => void }) {
  return (
    <Card className="mt-3 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="font-medium text-sm">{tradeOff.title}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{tradeOff.description}</p>

        <div className="space-y-2">
          {tradeOff.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                'w-full p-3 rounded-lg border text-left transition-all hover:border-purple-400',
                option.recommended
                  ? 'border-purple-400 bg-purple-100/50 dark:bg-purple-900/30'
                  : 'border-border bg-background'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{option.label}</span>
                {option.recommended && (
                  <Badge className="bg-purple-600 text-white text-[10px]">
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{option.impact}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MessageBubble({ message, onTradeOffSelect }: { message: ChatMessage; onTradeOffSelect: (optionId: string) => void }) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={cn('flex gap-3 mb-4', !isAssistant && 'flex-row-reverse')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
        isAssistant ? 'bg-primary/10' : 'bg-muted'
      )}>
        {isAssistant ? (
          <Bot className="h-4 w-4 text-primary" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className={cn('max-w-[85%] space-y-2', !isAssistant && 'items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5',
          isAssistant
            ? 'bg-muted rounded-tl-sm'
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.impactAnalysis && (
          <ImpactAnalysisCard analysis={message.impactAnalysis} />
        )}

        {message.tradeOff && (
          <TradeOffCard tradeOff={message.tradeOff} onSelect={onTradeOffSelect} />
        )}

        <p className="text-[10px] text-muted-foreground px-2">
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function Coach() {
  const { messages, isTyping, quickActions, addMessage, setTyping } = useCoachStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      type: 'text',
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput('')
    setTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateMockResponse(userMessage.content)
      addMessage(response)
      setTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: QuickAction) => {
    const prompts: Record<string, string> = {
      'review-budget': 'Can you review my current budget and pot allocation?',
      'log-expense': "I'd like to log a new expense.",
      'check-goals': 'How am I doing on my financial goals?',
      'savings-tip': 'Give me a tip to save more money this month.',
    }

    setInput(prompts[action.action] || action.label)
    inputRef.current?.focus()
  }

  const handleTradeOffSelect = (optionId: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: `I'll go with option: ${optionId}`,
      type: 'text',
      timestamp: new Date(),
    }
    addMessage(userMessage)
    setTyping(true)

    setTimeout(() => {
      addMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "Great choice! I'll help you implement this plan. I've noted your preference and will adjust your budget recommendations accordingly. Is there anything else you'd like me to help with?",
        type: 'text',
        timestamp: new Date(),
      })
      setTyping(false)
    }, 1000)
  }

  return (
    <div className="h-screen flex flex-col">
      <PageHeader
        title="AI Coach"
        subtitle="Your financial advisor"
        action={
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI Powered
          </Badge>
        }
      />

      {/* Chat Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onTradeOffSelect={handleTradeOffSelect}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="border-t border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 pb-1 overflow-x-auto">
              {quickActions.map((action) => {
                const Icon = quickActionIcons[action.icon] || Lightbulb
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-8 text-xs"
                    onClick={() => handleQuickAction(action)}
                  >
                    <Icon className="h-3 w-3 mr-1.5" />
                    {action.label}
                  </Button>
                )
              })}
            </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4 pb-20 md:pb-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask your AI coach anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
