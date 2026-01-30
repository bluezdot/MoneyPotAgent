import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  PiggyBank,
  Target,
  Receipt,
} from 'lucide-react'
import { useUserStore } from '@/stores/user-store'
import { usePotsStore } from '@/stores/pots-store'
import { useGoalsStore } from '@/stores/goals-store'
import { useExpensesStore } from '@/stores/expenses-store'
import { useCoachStore } from '@/stores/coach-store'

export default function Dashboard() {
  const { user } = useUserStore()
  const { pots } = usePotsStore()
  const { goals } = useGoalsStore()
  const { expenses } = useExpensesStore()
  const { insights } = useCoachStore()

  const totalAllocated = pots.reduce((sum, pot) => sum + pot.currentAmount, 0)
  const monthlyExpenses = expenses
    .filter((e) => {
      const now = new Date()
      const expDate = new Date(e.date)
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 2)
  const recentExpenses = expenses.slice(0, 4)
  const latestInsight = insights[0]

  const userName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`Hi, ${userName}`}
        subtitle="Here's your financial snapshot"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <PiggyBank className="h-4 w-4" />
                Total Balance
              </div>
              <div className="text-2xl font-bold">
                ${totalAllocated.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Receipt className="h-4 w-4" />
                Spent this month
              </div>
              <div className="text-2xl font-bold">
                ${monthlyExpenses.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
                <TrendingDown className="h-3 w-3" />
                -8% vs last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight Card */}
        {latestInsight && (
          <Link to="/app/coach">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{latestInsight.title}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        AI Insight
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {latestInsight.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Pots Overview */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Money Pots</CardTitle>
              <Link to="/app/pots">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              {pots.slice(0, 3).map((pot) => {
                const percentage = (pot.currentAmount / pot.targetAmount) * 100
                return (
                  <div key={pot.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: pot.color }}
                        />
                        <span className="font-medium">{pot.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ${pot.currentAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-1.5"
                      style={{ '--progress-color': pot.color } as React.CSSProperties}
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Active Goals</CardTitle>
              <Link to="/app/goals">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{goal.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {daysLeft} days left
                        </p>
                      </div>
                      <Badge
                        variant={goal.priority === 'high' ? 'default' : 'secondary'}
                        className="text-[10px]"
                      >
                        {goal.priority}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${goal.currentAmount.toLocaleString()}</span>
                        <span>${goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Expenses</CardTitle>
              <Link to="/app/expenses">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{expense.description}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {expense.category}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-sm">
                    -${expense.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
