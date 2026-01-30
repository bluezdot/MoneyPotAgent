import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  Utensils,
  Car,
  Home,
  Film,
  ShoppingBag,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Search,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { useExpensesStore } from '@/stores/expenses-store'
import { usePotsStore } from '@/stores/pots-store'
import { expenseCategoryColors } from '@/mocks/data'
import { cn } from '@/lib/utils'
import type { Expense, ExpenseCategory } from '@/types'

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  food: Utensils,
  transport: Car,
  utilities: Home,
  entertainment: Film,
  shopping: ShoppingBag,
  health: Heart,
  education: GraduationCap,
  other: MoreHorizontal,
}

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
]

function ExpenseItem({ expense }: { expense: Expense }) {
  const Icon = categoryIcons[expense.category] || MoreHorizontal
  const colors = expenseCategoryColors[expense.category]
  const date = new Date(expense.date)

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', colors?.bg)}>
          <Icon className={cn('h-4 w-4', colors?.text)} />
        </div>
        <div>
          <p className="font-medium text-sm">{expense.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            {expense.recurring && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Recurring
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">-${expense.amount.toFixed(2)}</p>
        <Badge variant="secondary" className={cn('text-[10px]', colors?.bg, colors?.text)}>
          {expense.category}
        </Badge>
      </div>
    </div>
  )
}

function AddExpenseDialog() {
  const { addExpense } = useExpensesStore()
  const { pots } = usePotsStore()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('food')
  const [potId, setPotId] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = () => {
    if (!description || !amount || !potId) return

    addExpense({
      id: `exp-${Date.now()}`,
      description,
      amount: parseFloat(amount),
      category,
      potId,
      date: new Date(date),
      recurring,
    })

    setOpen(false)
    setDescription('')
    setAmount('')
    setCategory('food')
    setPotId('')
    setRecurring(false)
    setDate(new Date().toISOString().split('T')[0])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Coffee at Starbucks"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Pot</Label>
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="recurring">Recurring Expense</Label>
              <p className="text-xs text-muted-foreground">This expense repeats monthly</p>
            </div>
            <Switch
              id="recurring"
              checked={recurring}
              onCheckedChange={setRecurring}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Add Expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Expenses() {
  const { expenses } = useExpensesStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const now = new Date()
  const currentMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.date)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const recurringTotal = expenses.filter((e) => e.recurring).reduce((sum, e) => sum + e.amount, 0)

  // Group expenses by category for summary
  const categoryTotals = currentMonthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Expenses"
        subtitle="Track your spending"
        action={<AddExpenseDialog />}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold">${totalThisMonth.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentMonthExpenses.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Recurring</p>
              <p className="text-2xl font-bold">${recurringTotal.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly fixed costs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">Top Categories</p>
            <div className="space-y-2">
              {topCategories.map(([category, amount]) => {
                const colors = expenseCategoryColors[category]
                const Icon = categoryIcons[category] || MoreHorizontal
                const percentage = (amount / totalThisMonth) * 100
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', colors?.bg)}>
                      <Icon className={cn('h-3.5 w-3.5', colors?.text)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{category}</span>
                        <span className="text-sm font-medium">${amount.toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expense List */}
        <Card>
          <CardContent className="p-4">
            {filteredExpenses.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-1">No expenses found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || filterCategory !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Start tracking by adding your first expense'}
                </p>
              </div>
            ) : (
              <div>
                {filteredExpenses.map((expense) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
