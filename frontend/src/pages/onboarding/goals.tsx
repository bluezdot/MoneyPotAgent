import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const goalOptions = [
  {
    id: 'emergency',
    title: 'Build Emergency Fund',
    description: 'Save 3-6 months of expenses',
    icon: '🛡️',
  },
  {
    id: 'debt',
    title: 'Pay Off Debt',
    description: 'Become debt-free faster',
    icon: '💳',
  },
  {
    id: 'save',
    title: 'Save for Something Big',
    description: 'Vacation, car, or major purchase',
    icon: '🎯',
  },
  {
    id: 'invest',
    title: 'Start Investing',
    description: 'Grow wealth for the future',
    icon: '📈',
  },
  {
    id: 'budget',
    title: 'Better Budgeting',
    description: 'Track and control spending',
    icon: '📊',
  },
  {
    id: 'retire',
    title: 'Plan for Retirement',
    description: 'Build long-term security',
    icon: '🏖️',
  },
]

export default function OnboardingGoals() {
  const navigate = useNavigate()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    )
  }

  const isValid = selectedGoals.length > 0

  return (
    <div className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <div className="mb-6">
        <Progress value={66} className="h-1" />
        <p className="text-xs text-muted-foreground mt-2">Step 2 of 3</p>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          What are your goals?
        </h1>
        <p className="text-muted-foreground">
          Select all that apply. We'll help you prioritize.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {goalOptions.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id)
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                'relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              <span className="text-2xl mb-2">{goal.icon}</span>
              <h3 className="font-medium text-sm leading-tight">{goal.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {goal.description}
              </p>
            </button>
          )
        })}
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          size="lg"
          className="h-12"
          onClick={() => navigate('/onboarding/profile')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12"
          onClick={() => navigate('/onboarding/complete')}
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
