import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import { useReminderStore } from '@/stores/reminder-store'
import {
  LayoutDashboard,
  PiggyBank,
  Target,
  Receipt,
  MessageCircle,
  User,
  Bell,
} from 'lucide-react'

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/app/pots', icon: PiggyBank, label: 'Pots' },
  { to: '/app/goals', icon: Target, label: 'Goals' },
  { to: '/app/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/app/coach', icon: MessageCircle, label: 'Coach' },
  { to: '/app/reminders', icon: Bell, label: 'Reminders' },
]

export function BottomNav() {
  const unreadCount = useReminderStore(state => state.unreadCount)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px] relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-all',
                      isActive && 'scale-110'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.to === '/app/reminders' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function DesktopNav() {
  const unreadCount = useReminderStore(state => state.unreadCount)

  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background flex-col z-40">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">MoneyPot</span>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
            {item.to === '/app/reminders' && unreadCount > 0 && (
              <span className="ml-auto h-5 min-w-[20px] px-1.5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          }
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  )
}

