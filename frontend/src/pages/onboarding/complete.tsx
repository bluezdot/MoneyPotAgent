import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useUserStore } from '@/stores/user-store'
import { CheckCircle2, Sparkles } from 'lucide-react'

export default function OnboardingComplete() {
  const navigate = useNavigate()
  const { user, completeOnboarding } = useUserStore()

  const handleStart = () => {
    completeOnboarding()
    navigate('/app/dashboard')
  }

  return (
    <div className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <div className="mb-6">
        <Progress value={100} className="h-1" />
        <p className="text-xs text-muted-foreground mt-2">Step 3 of 3</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">
          You're all set, {user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Your personalized financial dashboard is ready. Let's start building better money habits.
        </p>

        <div className="w-full space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <span className="text-xl">🪣</span>
            </div>
            <div>
              <h3 className="font-medium text-sm">5 Smart Pots Created</h3>
              <p className="text-xs text-muted-foreground">Ready to allocate your income</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-sm">AI Coach Activated</h3>
              <p className="text-xs text-muted-foreground">Get personalized advice anytime</p>
            </div>
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full h-12 text-base" onClick={handleStart}>
        Go to Dashboard
      </Button>
    </div>
  )
}
