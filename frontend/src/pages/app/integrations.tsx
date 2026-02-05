import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/layout/page-header'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Mail,
    MessageSquare,
    Calendar as CalendarIcon,
    Check,
    Shield,
    AlertTriangle,
    Info,
    RefreshCw,
    Trash2,
    ChevronRight,
} from 'lucide-react'
import { useMCPStore } from '@/stores/mcp-store'
import { cn } from '@/lib/utils'
import type { MCPIntegrationType } from '@/types/mcp'

const integrationConfig = {
    email: {
        icon: Mail,
        title: 'Email Integration',
        description: 'Automatically import transactions from your email receipts',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        features: [
            'Auto-detect purchases from email receipts',
            'Bank statement parsing',
            'Categorize transactions automatically',
            'Secure read-only access',
        ],
        providers: ['gmail', 'outlook', 'yahoo', 'other'],
    },
    sms: {
        icon: MessageSquare,
        title: 'SMS Reminders',
        description: 'Receive text message reminders for important financial events',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        features: [
            'Milestone reminders',
            'Goal deadline alerts',
            'Risky spending notifications',
            'Customizable reminder times',
        ],
    },
    calendar: {
        icon: CalendarIcon,
        title: 'Calendar Sync',
        description: 'Sync financial events to your calendar app',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        features: [
            'Goal deadline events',
            'Milestone checkpoints',
            'Payment reminders',
            'Sync with Google/Outlook/Apple',
        ],
        providers: ['google', 'outlook', 'apple', 'other'],
    },
}

type IntegrationConfig = typeof integrationConfig
type ConfigWithProviders = IntegrationConfig['email'] | IntegrationConfig['calendar']

function IntegrationCard({ type }: { type: MCPIntegrationType }) {
    const {
        integrations,
        enableIntegration,
        disableIntegration,
        updateIntegration,
        updatePermissions,
        syncEmailTransactions,
        syncCalendarEvents,
    } = useMCPStore()

    const integration = integrations[type]
    const config = integrationConfig[type]
    const Icon = config.icon
    const [isSyncing, setIsSyncing] = useState(false)

    const handleToggle = (enabled: boolean) => {
        if (enabled) {
            // In production, this would trigger OAuth flow
            enableIntegration(type)

            // Simulate authentication (replace with actual OAuth)
            setTimeout(() => {
                updateIntegration(type, {
                    authenticated: true,
                    lastSync: new Date(),
                })

                // Grant permissions
                if (type === 'email') updatePermissions({ emailRead: true })
                if (type === 'sms') updatePermissions({ smsWrite: true })
                if (type === 'calendar') updatePermissions({ calendarWrite: true })
            }, 1000)
        } else {
            disableIntegration(type)

            // Revoke permissions
            if (type === 'email') updatePermissions({ emailRead: false })
            if (type === 'sms') updatePermissions({ smsWrite: false })
            if (type === 'calendar') updatePermissions({ calendarWrite: false })
        }
    }

    const handleSync = async () => {
        setIsSyncing(true)
        if (type === 'email') await syncEmailTransactions()
        if (type === 'calendar') await syncCalendarEvents()

        // Update last sync time
        updateIntegration(type, { lastSync: new Date() })
        setIsSyncing(false)
    }

    return (
        <Card className={cn('transition-all', integration.enabled && 'border-2 border-primary/20')}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', config.bgColor)}>
                            <Icon className={cn('h-6 w-6', config.color)} />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{config.title}</CardTitle>
                            <CardDescription className="text-xs">{config.description}</CardDescription>
                        </div>
                    </div>
                    <Switch
                        checked={integration.enabled}
                        onCheckedChange={handleToggle}
                    />
                </div>
            </CardHeader>

            {integration.enabled && (
                <CardContent className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                            {integration.authenticated ? (
                                <>
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">Connected</span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                    <span className="text-sm font-medium">Connecting...</span>
                                </>
                            )}
                        </div>
                        {integration.lastSync && (
                            <span className="text-xs text-muted-foreground">
                                Last sync: {new Date(integration.lastSync).toLocaleTimeString()}
                            </span>
                        )}
                    </div>

                    {/* Features */}
                    <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Features</Label>
                        <div className="space-y-1">
                            {config.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm">
                                    <Check className="h-3 w-3 text-green-600 shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Provider Selection (for email & calendar) */}
                    {(type === 'email' || type === 'calendar') && (
                        <div className="space-y-2">
                            <Label className="text-xs">Provider</Label>
                            <Select
                                value={
                                    type === 'email' ? integration.emailProvider :
                                        type === 'calendar' ? integration.calendarProvider : undefined
                                }
                                onValueChange={(value) => {
                                    if (type === 'email') {
                                        updateIntegration(type, { emailProvider: value as any })
                                    } else if (type === 'calendar') {
                                        updateIntegration(type, { calendarProvider: value as any })
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(config as ConfigWithProviders).providers?.map((provider: string) => (
                                        <SelectItem key={provider} value={provider} className="capitalize">
                                            {provider}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Phone Number (for SMS) */}
                    {type === 'sms' && (
                        <div className="space-y-2">
                            <Label className="text-xs">Phone Number</Label>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="font-mono">
                                    {integration.phoneNumber || '+1 (555) 123-4567'}
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    Change
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                        {(type === 'email' || type === 'calendar') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSync}
                                disabled={isSyncing || !integration.authenticated}
                            >
                                <RefreshCw className={cn('h-3 w-3 mr-2', isSyncing && 'animate-spin')} />
                                Sync Now
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggle(false)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Disconnect
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default function Integrations() {
    const { permissions, updatePermissions, emailTransactions } = useMCPStore()

    return (
        <div className="min-h-screen pb-20 md:pb-0">
            <PageHeader
                title="Integrations"
                subtitle="Connect external services to enhance your experience"
            />

            <div className="p-4 md:p-6 space-y-6">
                {/* Info Banner */}
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Secure & Private</p>
                                <p className="text-xs text-muted-foreground">
                                    All integrations use secure OAuth authentication. We never store your passwords.
                                    You can revoke access at any time.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Integration Cards */}
                <div className="space-y-4">
                    <IntegrationCard type="email" />
                    <IntegrationCard type="sms" />
                    <IntegrationCard type="calendar" />
                </div>

                {/* Privacy Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <CardTitle className="text-base">Privacy & Permissions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium">Auto-sync</Label>
                                <p className="text-xs text-muted-foreground">
                                    Automatically sync data in the background
                                </p>
                            </div>
                            <Switch
                                checked={permissions.autoSync}
                                onCheckedChange={(checked) => updatePermissions({ autoSync: checked })}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Data Retention</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                How long to keep synced data
                            </p>
                            <Select
                                value={permissions.dataRetention.toString()}
                                onValueChange={(value) => updatePermissions({ dataRetention: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 days</SelectItem>
                                    <SelectItem value="60">60 days</SelectItem>
                                    <SelectItem value="90">90 days</SelectItem>
                                    <SelectItem value="180">180 days</SelectItem>
                                    <SelectItem value="365">1 year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Email Transactions Count */}
                        {emailTransactions.length > 0 && (
                            <>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-sm font-medium">Email Transactions</Label>
                                        <p className="text-xs text-muted-foreground">
                                            {emailTransactions.filter(t => !t.processed).length} unprocessed transactions
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Review
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Help */}
                <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-3">
                            Need help setting up integrations?
                        </p>
                        <Button variant="link" size="sm">
                            View Setup Guide
                            <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
