import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHeader } from '@/components/layout/page-header'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    Bell,
    BellOff,
    CheckCircle2,
    X,
    Calendar,
    MessageSquare,
    Mail,
    Target,
    AlertTriangle,
    TrendingUp,
    Sparkles,
    Settings,
    ChevronRight,
    Clock,
} from 'lucide-react'
import { useReminderStore } from '@/stores/reminder-store'
import type { Reminder, ReminderChannel, ReminderType } from '@/types'
import { cn } from '@/lib/utils'

const reminderTypeConfig: Record<ReminderType, {
    icon: React.ComponentType<{ className?: string }>,
    color: string,
    bgColor: string,
    borderColor: string
}> = {
    'milestone': {
        icon: Target,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800'
    },
    'missed-milestone': {
        icon: AlertTriangle,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800'
    },
    'risky-spending': {
        icon: AlertTriangle,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800'
    },
    'opportunity': {
        icon: TrendingUp,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800'
    },
    'custom': {
        icon: Bell,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-200 dark:border-purple-800'
    }
}

const priorityConfig = {
    urgent: { label: 'Urgent', color: 'bg-red-600 text-white' },
    high: { label: 'High', color: 'bg-orange-600 text-white' },
    medium: { label: 'Medium', color: 'bg-yellow-600 text-white' },
    low: { label: 'Low', color: 'bg-gray-600 text-white' }
}

const channelIcons: Record<ReminderChannel, React.ComponentType<{ className?: string }>> = {
    'in-app': Bell,
    'sms': MessageSquare,
    'calendar': Calendar,
    'email': Mail
}

function ReminderCard({ reminder, onMarkAsRead, onDismiss, onAction }: {
    reminder: Reminder
    onMarkAsRead: () => void
    onDismiss: () => void
    onAction: () => void
}) {
    const config = reminderTypeConfig[reminder.type]
    const Icon = config.icon
    const navigate = useNavigate()

    const handleAction = () => {
        if (reminder.actionUrl) {
            navigate(reminder.actionUrl)
        }
        onAction()
    }

    return (
        <Card className={cn('transition-all hover:shadow-md', config.borderColor, config.bgColor)}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', config.bgColor)}>
                        <Icon className={cn('h-5 w-5', config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{reminder.title}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                                <Badge className={priorityConfig[reminder.priority].color}>
                                    {priorityConfig[reminder.priority].label}
                                </Badge>
                                {(reminder.status === 'pending' || reminder.status === 'sent') && (
                                    <button
                                        onClick={onDismiss}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        title="Dismiss"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{reminder.message}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Channels */}
                                <div className="flex items-center gap-1">
                                    {reminder.channels.map((channel) => {
                                        const ChannelIcon = channelIcons[channel]
                                        return (
                                            <div
                                                key={channel}
                                                className="w-6 h-6 rounded bg-background flex items-center justify-center"
                                                title={channel}
                                            >
                                                <ChannelIcon className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {new Date(reminder.scheduledFor).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {reminder.status === 'sent' && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={onMarkAsRead}
                                        className="h-7 text-xs"
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Mark as Read
                                    </Button>
                                )}
                                {reminder.actionUrl && reminder.actionLabel && (
                                    <Button
                                        size="sm"
                                        onClick={handleAction}
                                        className="h-7 text-xs"
                                    >
                                        {reminder.actionLabel}
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function Reminders() {
    const {
        reminders,
        unreadCount,
        enabledChannels,
        markAsRead,
        dismissReminder,
        setEnabledChannels,
        checkAndCreateReminders,
    } = useReminderStore()

    const [filter, setFilter] = useState<'all' | 'active' | 'dismissed'>('active')
    const [showSettings, setShowSettings] = useState(false)

    useEffect(() => {
        // Check and create reminders on mount
        checkAndCreateReminders()
    }, [checkAndCreateReminders])

    const filteredReminders = reminders.filter(r => {
        if (filter === 'active') return r.status === 'pending' || r.status === 'sent'
        if (filter === 'dismissed') return r.status === 'dismissed'
        return true
    })

    const handleChannelToggle = (channel: ReminderChannel) => {
        if (enabledChannels.includes(channel)) {
            setEnabledChannels(enabledChannels.filter(c => c !== channel))
        } else {
            setEnabledChannels([...enabledChannels, channel])
        }
    }

    return (
        <div className="h-screen flex flex-col">
            <PageHeader
                title="Reminders"
                subtitle="Stay on top of your financial goals"
                action={
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Badge variant="default" className="gap-1">
                                <Bell className="h-3 w-3" />
                                {unreadCount} New
                            </Badge>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                }
            />

            <ScrollArea className="flex-1 p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Settings Panel */}
                    {showSettings && (
                        <Card className="border-2 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-base">Notification Settings</CardTitle>
                                <CardDescription>Choose how you want to receive reminders</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(['in-app', 'sms', 'calendar', 'email'] as ReminderChannel[]).map((channel) => {
                                        const Icon = channelIcons[channel]
                                        const isEnabled = enabledChannels.includes(channel)
                                        return (
                                            <div
                                                key={channel}
                                                className="flex items-center space-x-2 p-3 rounded-lg border"
                                            >
                                                <Switch
                                                    id={channel}
                                                    checked={isEnabled}
                                                    onCheckedChange={() => handleChannelToggle(channel)}
                                                />
                                                <Label htmlFor={channel} className="flex items-center gap-2 cursor-pointer">
                                                    <Icon className="h-4 w-4" />
                                                    <span className="capitalize">{channel.replace('-', ' ')}</span>
                                                </Label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant={filter === 'active' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('active')}
                        >
                            Active ({reminders.filter(r => r.status === 'pending' || r.status === 'sent').length})
                        </Button>
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            All ({reminders.length})
                        </Button>
                        <Button
                            variant={filter === 'dismissed' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('dismissed')}
                        >
                            Dismissed ({reminders.filter(r => r.status === 'dismissed').length})
                        </Button>
                    </div>

                    {/* Reminders List */}
                    {filteredReminders.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-12">
                                {filter === 'active' ? (
                                    <>
                                        <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No active reminders</h3>
                                        <p className="text-sm text-muted-foreground text-center max-w-md">
                                            You're all caught up! We'll notify you when there are important updates about your goals and spending.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
                                        <p className="text-sm text-muted-foreground text-center max-w-md">
                                            As you progress toward your goals, we'll create helpful reminders to keep you on track.
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredReminders.map((reminder) => (
                                <ReminderCard
                                    key={reminder.id}
                                    reminder={reminder}
                                    onMarkAsRead={() => markAsRead(reminder.id)}
                                    onDismiss={() => dismissReminder(reminder.id)}
                                    onAction={() => markAsRead(reminder.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
