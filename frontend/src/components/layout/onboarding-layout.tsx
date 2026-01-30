import { Outlet } from 'react-router'
import { PiggyBank } from 'lucide-react'

export function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">MoneyPot</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
