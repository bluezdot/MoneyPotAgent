import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  PiggyBank,
  Target,
  Receipt,
  Zap,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { useUserStore } from '@/stores/user-store'
import { usePotsStore } from '@/stores/pots-store'
import { useGoalsStore } from '@/stores/goals-store'
import { useExpensesStore } from '@/stores/expenses-store'
import { useCoachStore } from '@/stores/coach-store'
import { cn } from '@/lib/utils'

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
}

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
  
  // Calculate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <PageHeader
        title={`${getGreeting()}, ${userName} 👋`}
        subtitle="Here's your financial snapshot"
      />

      <motion.div 
        className="p-4 md:p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Summary Cards */}
        <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }}>
            <Card className="relative overflow-hidden border-2 hover:border-[#c8ff00]/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-8 -mt-8" />
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <div className="p-1.5 rounded-lg bg-green-500/10">
                    <PiggyBank className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">Total Balance</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight">
                  ${totalAllocated.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +12% this month
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }}>
            <Card className="relative overflow-hidden border-2 hover:border-red-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-8 -mt-8" />
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <div className="p-1.5 rounded-lg bg-red-500/10">
                    <Receipt className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="font-medium">Spent this month</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight">
                  ${monthlyExpenses.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                  <TrendingDown className="h-3 w-3" />
                  -8% vs last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* AI Insight Card */}
        {latestInsight && (
          <motion.div variants={itemVariants}>
            <Link to="/app/coach">
              <motion.div whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }}>
                <Card className="relative overflow-hidden bg-gradient-to-br from-[#c8ff00]/5 via-background to-purple-500/5 border-2 border-[#c8ff00]/20 hover:border-[#c8ff00]/40 transition-all shadow-lg shadow-[#c8ff00]/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c8ff00]/10 to-transparent rounded-full -mr-16 -mt-16" />
                  <CardContent className="p-4 relative">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c8ff00] to-[#a0cc00] flex items-center justify-center shrink-0 shadow-lg shadow-[#c8ff00]/20"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      >
                        <Sparkles className="h-6 w-6 text-black" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-semibold">{latestInsight.title}</span>
                          <Badge className="bg-[#c8ff00]/10 text-[#c8ff00] border-[#c8ff00]/20 text-[10px] px-2">
                            <Zap className="h-2.5 w-2.5 mr-1" />
                            AI Insight
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {latestInsight.description}
                        </p>
                      </div>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ChevronRight className="h-5 w-5 text-[#c8ff00]" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Pots Overview */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <PiggyBank className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">Money Pots</CardTitle>
                </div>
                <Link to="/app/pots">
                  <Button variant="ghost" size="sm" className="h-8 text-xs group">
                    View All
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-3">
                {pots.slice(0, 3).map((pot, index) => {
                  const percentage = pot.targetAmount > 0 ? (pot.currentAmount / pot.targetAmount) * 100 : 0
                  return (
                    <motion.div 
                      key={pot.id} 
                      className="space-y-2 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-background"
                            style={{ backgroundColor: pot.color, '--tw-ring-color': pot.color } as React.CSSProperties}
                          />
                          <span className="font-medium">{pot.name}</span>
                        </div>
                        <span className="font-semibold">
                          ${pot.currentAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress
                          value={percentage}
                          className="h-2"
                          style={{ '--progress-color': pot.color } as React.CSSProperties}
                        />
                        <span className="absolute right-0 -top-5 text-[10px] text-muted-foreground">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Goals */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10">
                    <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-base font-semibold">Active Goals</CardTitle>
                </div>
                <Link to="/app/goals">
                  <Button variant="ghost" size="sm" className="h-8 text-xs group">
                    View All
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                {activeGoals.map((goal, index) => {
                  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
                  const daysLeft = Math.ceil(
                    (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <motion.div 
                      key={goal.id} 
                      className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{goal.title}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            'text-[10px]',
                            goal.priority === 'high' 
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
                              : goal.priority === 'medium'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                : 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                          )}
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        <Progress value={percentage} className="h-2.5" />
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">${goal.currentAmount.toLocaleString()}</span>
                          <span className="text-muted-foreground">of ${goal.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10">
                    <Receipt className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-base font-semibold">Recent Expenses</CardTitle>
                </div>
                <Link to="/app/expenses">
                  <Button variant="ghost" size="sm" className="h-8 text-xs group">
                    View All
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2">
                {recentExpenses.map((expense, index) => (
                  <motion.div 
                    key={expense.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border/50">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {expense.category}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm text-red-600 dark:text-red-400">
                      -${expense.amount.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
