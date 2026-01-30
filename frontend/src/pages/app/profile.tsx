import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PageHeader } from '@/components/layout/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Globe,
  DollarSign,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  FileText,
  Trash2,
} from 'lucide-react'
import { useUserStore } from '@/stores/user-store'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
]

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description?: string
  children?: React.ReactNode
  onClick?: () => void
}) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      className={cn(
        'flex items-center justify-between py-3 w-full text-left',
        onClick && 'hover:bg-muted/50 -mx-4 px-4 rounded-lg transition-colors'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children || (onClick && <ChevronRight className="h-4 w-4 text-muted-foreground" />)}
    </Wrapper>
  )
}

export default function Profile() {
  const { user, updateUser, reset: resetUser } = useUserStore()
  const { settings, updateSettings } = useAppStore()
  const { theme, setTheme } = useTheme()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U'

  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency })
    if (user) {
      updateUser({ currency })
    }
  }

  const handleNotificationsToggle = (enabled: boolean) => {
    updateSettings({ notifications: enabled })
  }

  const handleLogout = () => {
    resetUser()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <PageHeader title="Profile" subtitle="Manage your account" />

      <div className="p-4 md:p-6 space-y-6">
        {/* User Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || 'No email'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since{' '}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Theme</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className="h-auto py-3 flex-col gap-2"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs">Light</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className="h-auto py-3 flex-col gap-2"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs">Dark</span>
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  className="h-auto py-3 flex-col gap-2"
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-xs">System</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingRow
              icon={DollarSign}
              label="Currency"
              description="Set your preferred currency"
            >
              <Select
                value={settings.currency}
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>

            <Separator />

            <SettingRow
              icon={Bell}
              label="Notifications"
              description="Receive tips and alerts"
            >
              <Switch
                checked={settings.notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </SettingRow>

            <Separator />

            <SettingRow
              icon={Globe}
              label="Language"
              description="English (US)"
            >
              <Select defaultValue="en">
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Support</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow
              icon={HelpCircle}
              label="Help Center"
              description="FAQs and guides"
              onClick={() => {}}
            />
            <Separator />
            <SettingRow
              icon={FileText}
              label="Terms & Privacy"
              description="Legal information"
              onClick={() => {}}
            />
            <Separator />
            <SettingRow
              icon={Shield}
              label="Security"
              description="Manage your security settings"
              onClick={() => {}}
            />
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow
              icon={Trash2}
              label="Delete Account"
              description="Permanently delete your account and data"
              onClick={() => {}}
            />
            <Separator />
            <SettingRow
              icon={LogOut}
              label="Sign Out"
              description="Sign out of your account"
              onClick={handleLogout}
            />
          </CardContent>
        </Card>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          MoneyPot v1.0.0
        </p>
      </div>
    </div>
  )
}
