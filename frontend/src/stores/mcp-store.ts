import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type {
    MCPIntegrationType,
    MCPIntegration,
    MCPPermissions,
    EmailTransaction,
    SMSReminder,
    CalendarEvent,
} from '@/types/mcp'

interface MCPState {
    integrations: Record<MCPIntegrationType, MCPIntegration>
    permissions: MCPPermissions
    emailTransactions: EmailTransaction[]
    smsReminders: SMSReminder[]
    calendarEvents: CalendarEvent[]

    // Integration management
    enableIntegration: (type: MCPIntegrationType) => void
    disableIntegration: (type: MCPIntegrationType) => void
    updateIntegration: (type: MCPIntegrationType, updates: Partial<MCPIntegration>) => void

    // Permissions
    updatePermissions: (updates: Partial<MCPPermissions>) => void
    grantPermission: (permission: keyof MCPPermissions) => void
    revokePermission: (permission: keyof MCPPermissions) => void

    // Email transactions
    addEmailTransaction: (transaction: Omit<EmailTransaction, 'id'>) => void
    markTransactionProcessed: (id: string) => void
    removeEmailTransaction: (id: string) => void

    // SMS reminders
    scheduleSMS: (reminderId: string, phoneNumber: string, message: string, scheduledFor: Date) => void
    updateSMSStatus: (id: string, status: SMSReminder['status'], error?: string) => void

    // Calendar events
    addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void
    removeCalendarEvent: (id: string) => void

    // Sync
    syncEmailTransactions: () => Promise<void>
    syncCalendarEvents: () => Promise<void>
}

export const useMCPStore = create<MCPState>()(
    persist(
        immer((set) => ({
            integrations: {
                email: {
                    type: 'email',
                    enabled: false,
                    authenticated: false,
                },
                sms: {
                    type: 'sms',
                    enabled: false,
                    authenticated: false,
                },
                calendar: {
                    type: 'calendar',
                    enabled: false,
                    authenticated: false,
                },
            },
            permissions: {
                emailRead: false,
                smsWrite: false,
                calendarWrite: false,
                dataRetention: 90,
                autoSync: false,
            },
            emailTransactions: [],
            smsReminders: [],
            calendarEvents: [],

            enableIntegration: (type) => set((state) => {
                state.integrations[type].enabled = true
            }),

            disableIntegration: (type) => set((state) => {
                state.integrations[type].enabled = false
                state.integrations[type].authenticated = false
            }),

            updateIntegration: (type, updates) => set((state) => {
                state.integrations[type] = { ...state.integrations[type], ...updates }
            }),

            updatePermissions: (updates) => set((state) => {
                state.permissions = { ...state.permissions, ...updates }
            }),

            grantPermission: (permission) => set((state) => {
                if (permission === 'emailRead' || permission === 'smsWrite' || permission === 'calendarWrite' || permission === 'autoSync') {
                    state.permissions[permission] = true
                }
            }),

            revokePermission: (permission) => set((state) => {
                if (permission === 'emailRead' || permission === 'smsWrite' || permission === 'calendarWrite' || permission === 'autoSync') {
                    state.permissions[permission] = false
                }
            }),

            addEmailTransaction: (transaction) => set((state) => {
                state.emailTransactions.unshift({
                    ...transaction,
                    id: `email-tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                })
            }),

            markTransactionProcessed: (id) => set((state) => {
                const tx = state.emailTransactions.find(t => t.id === id)
                if (tx) tx.processed = true
            }),

            removeEmailTransaction: (id) => set((state) => {
                const index = state.emailTransactions.findIndex(t => t.id === id)
                if (index !== -1) state.emailTransactions.splice(index, 1)
            }),

            scheduleSMS: (reminderId, phoneNumber, message, scheduledFor) => set((state) => {
                state.smsReminders.push({
                    id: `sms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    reminderId,
                    phoneNumber,
                    message,
                    scheduledFor,
                    status: 'pending',
                })
            }),

            updateSMSStatus: (id, status, error) => set((state) => {
                const sms = state.smsReminders.find(s => s.id === id)
                if (sms) {
                    sms.status = status
                    if (status === 'sent') sms.sentAt = new Date()
                    if (error) sms.error = error
                }
            }),

            addCalendarEvent: (event) => set((state) => {
                state.calendarEvents.push({
                    ...event,
                    id: `cal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                })
            }),

            removeCalendarEvent: (id) => set((state) => {
                const index = state.calendarEvents.findIndex(e => e.id === id)
                if (index !== -1) state.calendarEvents.splice(index, 1)
            }),

            syncEmailTransactions: async () => {
                // TODO: Implement MCP email sync
                // This would call backend API to fetch new transactions from email
                console.log('Syncing email transactions...')

                // Simulated sync (replace with actual MCP call)
                setTimeout(() => {
                    console.log('Email sync complete')
                }, 1000)
            },

            syncCalendarEvents: async () => {
                // TODO: Implement MCP calendar sync
                // This would call backend API to sync with calendar provider
                console.log('Syncing calendar events...')

                // Simulated sync (replace with actual MCP call)
                setTimeout(() => {
                    console.log('Calendar sync complete')
                }, 1000)
            },
        })),
        {
            name: 'mcp-storage',
            partialize: (state) => ({
                integrations: state.integrations,
                permissions: state.permissions,
                emailTransactions: state.emailTransactions,
                smsReminders: state.smsReminders,
                calendarEvents: state.calendarEvents,
            }),
        }
    )
)
