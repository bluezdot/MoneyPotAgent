import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Home, Heart, PiggyBank, TrendingUp, Shield, Settings2 } from 'lucide-react'
import { usePotsStore } from '@/stores/pots-store'
import { useUserStore } from '@/stores/user-store'
import { cn } from '@/lib/utils'
import type { Pot } from '@/types'

const potIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Heart,
  PiggyBank,
  TrendingUp,
  Shield,
}

function PotCard({ pot }: { pot: Pot }) {
  const percentage = (pot.currentAmount / pot.targetAmount) * 100
  const Icon = potIcons[pot.icon] || PiggyBank

  return (
    <Card className="overflow-hidden">
      <div className="h-1" style={{ backgroundColor: pot.color }} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${pot.color}20` }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{pot.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{pot.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">${pot.currentAmount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              of ${pot.targetAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{percentage.toFixed(0)}% filled</span>
            <span className="font-medium">{pot.percentage}% of income</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AllocationEditor() {
  const { pots, updatePotPercentage } = usePotsStore()
  const { user } = useUserStore()
  const [allocations, setAllocations] = useState(
    pots.reduce((acc, pot) => ({ ...acc, [pot.id]: pot.percentage }), {} as Record<string, number>)
  )

  const totalPercentage = Object.values(allocations).reduce((sum, p) => sum + p, 0)
  const monthlyIncome = user?.monthlyIncome || 5000

  const handleChange = (potId: string, value: number[]) => {
    setAllocations((prev) => ({ ...prev, [potId]: value[0] }))
  }

  const handleSave = () => {
    Object.entries(allocations).forEach(([potId, percentage]) => {
      updatePotPercentage(potId, percentage)
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground mb-1">Total Allocation</p>
        <p className={cn(
          'text-3xl font-bold',
          totalPercentage === 100 ? 'text-green-600' : totalPercentage > 100 ? 'text-red-600' : 'text-amber-600'
        )}>
          {totalPercentage}%
        </p>
        {totalPercentage !== 100 && (
          <p className="text-xs text-muted-foreground mt-1">
            {totalPercentage > 100 ? 'Over-allocated' : `${100 - totalPercentage}% unallocated`}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {pots.map((pot) => {
          const Icon = potIcons[pot.icon] || PiggyBank
          const amount = (monthlyIncome * allocations[pot.id]) / 100
          return (
            <div key={pot.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${pot.color}20` }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium text-sm">{pot.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{allocations[pot.id]}%</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (${amount.toLocaleString()}/mo)
                  </span>
                </div>
              </div>
              <Slider
                value={[allocations[pot.id]]}
                onValueChange={(v) => handleChange(pot.id, v)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          )
        })}
      </div>

      <Button onClick={handleSave} className="w-full" disabled={totalPercentage !== 100}>
        Save Allocation
      </Button>
    </div>
  )
}

export default function Pots() {
  const { pots } = usePotsStore()

  const totalAllocated = pots.reduce((sum, pot) => sum + pot.currentAmount, 0)
  const totalPercentage = pots.reduce((sum, pot) => sum + pot.percentage, 0)

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Money Pots"
        subtitle="Manage your allocation"
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings2 className="h-4 w-4 mr-2" />
                Adjust
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adjust Allocation</DialogTitle>
              </DialogHeader>
              <AllocationEditor />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total in Pots</p>
                <p className="text-2xl font-bold">${totalAllocated.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Allocation</p>
                <p className={cn(
                  'text-2xl font-bold',
                  totalPercentage === 100 ? 'text-green-600' : 'text-amber-600'
                )}>
                  {totalPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pots Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 h-8 rounded-lg overflow-hidden">
              {pots.map((pot) => (
                <div
                  key={pot.id}
                  className="h-full transition-all"
                  style={{
                    width: `${pot.percentage}%`,
                    backgroundColor: pot.color,
                  }}
                  title={`${pot.name}: ${pot.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
              {pots.map((pot) => (
                <div key={pot.id} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pot.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {pot.name} ({pot.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pot Cards */}
        <div className="space-y-4">
          {pots.map((pot) => (
            <PotCard
              key={pot.id}
              pot={pot}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
