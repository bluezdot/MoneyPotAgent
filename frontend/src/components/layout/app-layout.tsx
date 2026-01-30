import { Outlet } from 'react-router'
import { BottomNav, DesktopNav } from './bottom-nav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopNav />
      <main className="pb-20 md:pb-0 md:pl-64">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
