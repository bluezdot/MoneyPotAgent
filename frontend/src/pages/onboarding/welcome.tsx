import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, PiggyBank, Target, TrendingUp, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: PiggyBank,
    title: 'Smart Pots',
    description: 'Allocate your income automatically',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Visualize your progress to goals',
  },
  {
    icon: TrendingUp,
    title: 'Expense Insights',
    description: 'Understand your spending patterns',
  },
  {
    icon: MessageCircle,
    title: 'AI Coach',
    description: 'Get personalized financial advice',
  },
]

export default function OnboardingWelcome() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Welcome to MoneyPot
        </h1>
        <p className="text-muted-foreground text-lg">
          Your AI-powered financial health coach
        </p>
      </div>

      <div className="w-full space-y-3 mb-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full h-12 text-base"
        onClick={() => navigate('/onboarding/profile')}
      >
        Get Started
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
