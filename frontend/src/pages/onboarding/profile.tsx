import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useUserStore } from '@/stores/user-store'
import { Progress } from '@/components/ui/progress'

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'CAD', label: 'CAD ($)' },
]

export default function OnboardingProfile() {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [currency, setCurrency] = useState('USD')

  const isValid = name.trim() && email.trim() && monthlyIncome

  const handleContinue = () => {
    if (!isValid) return

    setUser({
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      monthlyIncome: parseFloat(monthlyIncome),
      currency,
      onboardingCompleted: false,
      createdAt: new Date(),
    })

    navigate('/onboarding/goals')
  }

  return (
    <div className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <div className="mb-6">
        <Progress value={33} className="h-1" />
        <p className="text-xs text-muted-foreground mt-2">Step 1 of 3</p>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Tell us about yourself
        </h1>
        <p className="text-muted-foreground">
          We'll use this to personalize your experience
        </p>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="income">Monthly income</Label>
          <div className="flex gap-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="income"
              type="number"
              placeholder="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This helps us suggest appropriate pot allocations
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          size="lg"
          className="h-12"
          onClick={() => navigate('/onboarding/welcome')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12"
          onClick={handleContinue}
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
