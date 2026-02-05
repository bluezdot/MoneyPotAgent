import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, ChevronRight, AlertTriangle, Target, TrendingUp } from 'lucide-react'
import { useReminderStore } from '@/stores/reminder-store'
import { cn } from '@/lib/utils'
import type { ReminderType } from '@/types'

const reminderTypeIcons: Record<ReminderType, React.ComponentType<{ className?: string }>> = {
    'milestone': Target,
    'missed-milestone': AlertTriangle,
    'risky-spending': AlertTriangle,
    'opportunity': TrendingUp,
    'custom': Bell
}

const reminderTypeColors: Record<ReminderType, string> = {
    'milestone': 'text-blue-600 dark:text-blue-400',
    'missed-milestone': 'text-red-600 dark:text-red-400',
    'risky-spending': 'text-orange-600 dark:text-orange-400',
    'opportunity': 'text-green-600 dark:text-green-400',
    'custom': 'text-purple-600 dark:text-purple-400'
}

export function ReminderWidget() {
    const navigate = useNavigate()
    const { reminders, unreadCount } = useReminderStore()

    const activeReminders = reminders
        .filter(r => r.status === 'pending' || r.status === 'sent')
        .sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
        .slice(0, 3)

    if (activeReminders.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Reminders
                    {unreadCount > 0 && (
                        <Badge variant="default" className="h-5 px-1.5 text-xs">
                            {unreadCount}
                        </Badge>
                    )}
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/app/reminders')}
                    className="h-7 text-xs"
                >
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                {activeReminders.map((reminder) => {
                    const Icon = reminderTypeIcons[reminder.type]
                    const iconColor = reminderTypeColors[reminder.type]

                    return (
                        <button
                            key={reminder.id}
                            onClick={() => navigate('/app/reminders')}
                            className="w-full p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors text-left"
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn('mt-0.5', iconColor)}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-sm line-clamp-1">{reminder.title}</p>
                                        {reminder.priority === 'urgent' && (
                                            <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">
                                                Urgent
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {reminder.message}
                                    </p>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </CardContent>
        </Card>
    )
}
