import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/layout/page-header'
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Flag,
} from 'lucide-react'
import { useGoalsStore } from '@/stores/goals-store'
import { usePotsStore } from '@/stores/pots-store'
import { cn } from '@/lib/utils'
import type { Goal, GoalPriority, Milestone } from '@/types'

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

function GoalCard({ goal }: { goal: Goal }) {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100
  const daysLeft = Math.ceil(
    (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const completedMilestones = goal.milestones.filter((m) => m.completed).length

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{goal.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {goal.description}
              </p>
            </div>
          </div>
          <Badge className={cn('text-xs', priorityColors[goal.priority])}>
            {goal.priority}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              ${goal.currentAmount.toLocaleString()}
              <span className="text-muted-foreground font-normal">
                {' '}/ ${goal.targetAmount.toLocaleString()}
              </span>
            </span>
            <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
          </div>
          <div className="flex items-center gap-1">
            <Flag className="h-3 w-3" />
            {completedMilestones}/{goal.milestones.length} milestones
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">Milestones</p>
          <div className="space-y-2">
            {goal.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3">
                {milestone.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm truncate',
                    milestone.completed && 'line-through text-muted-foreground'
                  )}>
                    {milestone.title}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  ${milestone.targetAmount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AddGoalDialog() {
  const { addGoal } = useGoalsStore()
  const { pots } = usePotsStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState<GoalPriority>('medium')
  const [potId, setPotId] = useState('')

  const handleSubmit = () => {
    if (!title || !targetAmount || !deadline || !potId) return

    const target = parseFloat(targetAmount)
    const milestones: Milestone[] = [
      { id: `m-${Date.now()}-1`, title: '25% complete', targetAmount: target * 0.25, completed: false },
      { id: `m-${Date.now()}-2`, title: '50% complete', targetAmount: target * 0.5, completed: false },
      { id: `m-${Date.now()}-3`, title: 'Goal reached!', targetAmount: target, completed: false },
    ]

    addGoal({
      id: `goal-${Date.now()}`,
      title,
      description,
      targetAmount: target,
      currentAmount: 0,
      deadline: new Date(deadline),
      priority,
      status: 'active',
      potId,
      milestones,
      createdAt: new Date(),
    })

    setOpen(false)
    setTitle('')
    setDescription('')
    setTargetAmount('')
    setDeadline('')
    setPriority('medium')
    setPotId('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Vacation to Japan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="What's this goal for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Target Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as GoalPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fund From</Label>
              <Select value={potId} onValueChange={setPotId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pot" />
                </SelectTrigger>
                <SelectContent>
                  {pots.map((pot) => (
                    <SelectItem key={pot.id} value={pot.id}>
                      {pot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Create Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Goals() {
  const { goals } = useGoalsStore()
  const activeGoals = goals.filter((g) => g.status === 'active')
  const completedGoals = goals.filter((g) => g.status === 'completed')

  const totalGoalValue = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalProgress = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallPercentage = totalGoalValue > 0 ? (totalProgress / totalGoalValue) * 100 : 0

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Goals"
        subtitle="Track your financial goals"
        action={<AddGoalDialog />}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">
                  ${totalProgress.toLocaleString()}
                  <span className="text-muted-foreground text-base font-normal">
                    {' '}/ ${totalGoalValue.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{overallPercentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">{activeGoals.length} active goals</p>
              </div>
            </div>
            <Progress value={overallPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Goals Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedGoals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">No active goals</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first goal to start tracking your progress
                  </p>
                  <AddGoalDialog />
                </CardContent>
              </Card>
            ) : (
              activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedGoals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">No completed goals yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep working on your active goals!
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
