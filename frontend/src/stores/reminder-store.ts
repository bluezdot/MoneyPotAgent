import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { Reminder, ReminderChannel, ReminderType } from '@/types'
import { useGoalsStore } from './goals-store'
import { usePotsStore } from './pots-store'
import { mockReminders } from '@/mocks/data'

interface ReminderState {
    reminders: Reminder[]
    unreadCount: number
    enabledChannels: ReminderChannel[]

    addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void
    updateReminder: (id: string, updates: Partial<Reminder>) => void
    markAsRead: (id: string) => void
    markAsSent: (id: string) => void
    dismissReminder: (id: string) => void
    deleteReminder: (id: string) => void
    setEnabledChannels: (channels: ReminderChannel[]) => void
    checkAndCreateReminders: () => void
    getActiveReminders: () => Reminder[]
    getRemindersByType: (type: ReminderType) => Reminder[]
}

export const useReminderStore = create<ReminderState>()(
    persist(
        immer((set, get) => ({
            reminders: mockReminders,
            unreadCount: mockReminders.filter(r => r.status === 'pending' || r.status === 'sent').length,
            enabledChannels: ['in-app', 'sms', 'calendar'],

            addReminder: (reminder) => set((state) => {
                const newReminder: Reminder = {
                    ...reminder,
                    id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date(),
                }
                state.reminders.push(newReminder)
                state.unreadCount = state.reminders.filter(r => r.status === 'pending' || r.status === 'sent').length
            }),

            updateReminder: (id, updates) => set((state) => {
                const index = state.reminders.findIndex(r => r.id === id)
                if (index !== -1) {
                    state.reminders[index] = { ...state.reminders[index], ...updates }
                }
                state.unreadCount = state.reminders.filter(r => r.status === 'pending' || r.status === 'sent').length
            }),

            markAsRead: (id) => set((state) => {
                const reminder = state.reminders.find(r => r.id === id)
                if (reminder && reminder.status !== 'read') {
                    reminder.status = 'read'
                    reminder.readAt = new Date()
                    state.unreadCount = state.reminders.filter(r => r.status === 'pending' || r.status === 'sent').length
                }
            }),

            markAsSent: (id) => set((state) => {
                const reminder = state.reminders.find(r => r.id === id)
                if (reminder && reminder.status === 'pending') {
                    reminder.status = 'sent'
                    reminder.sentAt = new Date()
                }
            }),

            dismissReminder: (id) => set((state) => {
                const reminder = state.reminders.find(r => r.id === id)
                if (reminder) {
                    reminder.status = 'dismissed'
                    reminder.dismissedAt = new Date()
                    state.unreadCount = state.reminders.filter(r => r.status === 'pending' || r.status === 'sent').length
                }
            }),

            deleteReminder: (id) => set((state) => {
                const index = state.reminders.findIndex(r => r.id === id)
                if (index !== -1) {
                    state.reminders.splice(index, 1)
                    state.unreadCount = state.reminders.filter(r => r.status === 'pending' || r.status === 'sent').length
                }
            }),

            setEnabledChannels: (channels) => set((state) => {
                state.enabledChannels = channels
            }),

            checkAndCreateReminders: () => {
                const goals = useGoalsStore.getState().goals
                const pots = usePotsStore.getState().pots
                const { addReminder, reminders } = get()
                const now = new Date()

                // Check for upcoming milestones (within 7 days)
                goals.forEach(goal => {
                    if (goal.status !== 'active') return

                    goal.milestones?.forEach(milestone => {
                        if (milestone.completed) return

                        // Check if reminder already exists for this milestone
                        const existingReminder = reminders.find(r =>
                            r.relatedMilestoneId === milestone.id &&
                            r.status !== 'dismissed'
                        )
                        if (existingReminder) return

                        // Calculate days until milestone (example logic - you may need to adjust)
                        const progress = goal.currentAmount / goal.targetAmount
                        const milestoneProgress = milestone.targetAmount / goal.targetAmount
                        const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                        if (daysRemaining <= 7 && daysRemaining > 0 && progress < milestoneProgress) {
                            addReminder({
                                type: 'milestone',
                                title: `Upcoming Milestone: ${milestone.title}`,
                                message: `You have ${daysRemaining} days left to reach "${milestone.title}" for your goal "${goal.title}". Current progress: ${Math.round(progress * 100)}%`,
                                priority: daysRemaining <= 3 ? 'high' : 'medium',
                                status: 'pending',
                                channels: ['in-app', 'sms'],
                                trigger: 'upcoming-milestone',
                                scheduledFor: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
                                relatedGoalId: goal.id,
                                relatedMilestoneId: milestone.id,
                                actionUrl: '/app/goals',
                                actionLabel: 'View Goal'
                            })
                        }
                    })
                })

                // Check for missed milestones
                goals.forEach(goal => {
                    if (goal.status !== 'active') return

                    const progress = goal.currentAmount / goal.targetAmount
                    const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                    if (daysRemaining < 0 && progress < 1) {
                        const existingReminder = reminders.find(r =>
                            r.relatedGoalId === goal.id &&
                            r.type === 'missed-milestone' &&
                            r.status !== 'dismissed'
                        )
                        if (!existingReminder) {
                            addReminder({
                                type: 'missed-milestone',
                                title: `Missed Deadline: ${goal.title}`,
                                message: `Your goal "${goal.title}" has passed its deadline. Current progress: ${Math.round(progress * 100)}%. Let's create a new plan to get back on track!`,
                                priority: 'urgent',
                                status: 'pending',
                                channels: ['in-app', 'sms'],
                                trigger: 'missed-milestone',
                                scheduledFor: now,
                                relatedGoalId: goal.id,
                                actionUrl: '/app/goals',
                                actionLabel: 'Update Goal'
                            })
                        }
                    }
                })

                // Check for risky spending (example: pot running low)
                pots.forEach(pot => {
                    if (pot.category === 'emergency' || pot.category === 'necessities') {
                        const utilizationRate = pot.currentAmount / pot.targetAmount

                        if (utilizationRate < 0.2) { // Less than 20% remaining
                            const existingReminder = reminders.find(r =>
                                r.relatedGoalId === pot.id &&
                                r.type === 'risky-spending' &&
                                r.status !== 'dismissed' &&
                                r.createdAt > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Within last 7 days
                            )
                            if (!existingReminder) {
                                addReminder({
                                    type: 'risky-spending',
                                    title: `Low Balance Alert: ${pot.name}`,
                                    message: `Your ${pot.name} pot is running low (${Math.round(utilizationRate * 100)}% remaining). Consider reducing expenses or reallocating funds.`,
                                    priority: 'high',
                                    status: 'pending',
                                    channels: ['in-app'],
                                    trigger: 'risky-spending',
                                    scheduledFor: now,
                                    relatedGoalId: pot.id,
                                    actionUrl: '/app/pots',
                                    actionLabel: 'View Pots'
                                })
                            }
                        }
                    }
                })

                // Check for opportunities to accelerate progress
                goals.forEach(goal => {
                    if (goal.status !== 'active') return

                    const progress = goal.currentAmount / goal.targetAmount
                    const targetDate = new Date(goal.deadline)
                    const daysRemaining = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                    // If user is ahead of schedule
                    if (progress > 0.5 && daysRemaining > 30) {
                        const existingReminder = reminders.find(r =>
                            r.relatedGoalId === goal.id &&
                            r.type === 'opportunity' &&
                            r.status !== 'dismissed' &&
                            r.createdAt > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        )
                        if (!existingReminder) {
                            addReminder({
                                type: 'opportunity',
                                title: `Great Progress on ${goal.title}!`,
                                message: `You're ahead of schedule on "${goal.title}"! You could reach this goal ${Math.floor((daysRemaining - (daysRemaining * (1 - progress))))} days early. Keep it up!`,
                                priority: 'low',
                                status: 'pending',
                                channels: ['in-app'],
                                trigger: 'opportunity',
                                scheduledFor: now,
                                relatedGoalId: goal.id,
                                actionUrl: '/app/goals',
                                actionLabel: 'View Progress'
                            })
                        }
                    }
                })
            },

            getActiveReminders: () => {
                return get().reminders
                    .filter(r => r.status === 'pending' || r.status === 'sent')
                    .sort((a, b) => {
                        // Sort by priority first
                        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
                        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
                        if (priorityDiff !== 0) return priorityDiff

                        // Then by scheduled time
                        return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
                    })
            },

            getRemindersByType: (type) => {
                return get().reminders.filter(r => r.type === type)
            },
        })),
        {
            name: 'reminder-storage',
            partialize: (state) => ({
                reminders: state.reminders,
                enabledChannels: state.enabledChannels,
            }),
        }
    )
)
