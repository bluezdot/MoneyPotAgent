/**
 * MCP Integration Types
 */
export type MCPIntegrationType = 'email' | 'sms' | 'calendar'

export interface MCPIntegration {
    type: MCPIntegrationType
    enabled: boolean
    authenticated: boolean
    lastSync?: Date
    emailProvider?: 'gmail' | 'outlook' | 'yahoo' | 'other'
    phoneNumber?: string
    calendarProvider?: 'google' | 'outlook' | 'apple' | 'other'
}

export interface EmailTransaction {
    id: string
    merchant: string
    amount: number
    date: Date
    category?: string
    rawEmail: string
    processed: boolean
    confidence: number // 0-100, AI confidence in extraction
}

export interface SMSReminder {
    id: string
    reminderId: string
    phoneNumber: string
    message: string
    scheduledFor: Date
    status: 'pending' | 'sent' | 'failed'
    sentAt?: Date
    error?: string
}

export interface CalendarEvent {
    id: string
    title: string
    description: string
    startTime: Date
    endTime: Date
    reminderId?: string
    goalId?: string
    milestoneId?: string
    type: 'reminder' | 'milestone' | 'deadline'
}

/**
 * MCP Integration Permissions
 */
export interface MCPPermissions {
    emailRead: boolean
    emailReadScope?: string[] // e.g., ['receipts', 'bank-statements']
    smsWrite: boolean
    calendarWrite: boolean
    dataRetention: number // days
    autoSync: boolean
}

/**
 * MCP Integration Settings Store State
 */
export interface MCPSettings {
    integrations: Record<MCPIntegrationType, MCPIntegration>
    permissions: MCPPermissions
    emailTransactions: EmailTransaction[]
    smsReminders: SMSReminder[]
    calendarEvents: CalendarEvent[]
}
