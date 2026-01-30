import { Route, Routes, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import { AppLayout } from '@/components/layout/app-layout'
import { OnboardingLayout } from '@/components/layout/onboarding-layout'

// Pages
import Landing from '@/pages/landing'

// Onboarding Pages
import OnboardingWelcome from '@/pages/onboarding/welcome'
import OnboardingProfile from '@/pages/onboarding/profile'
import OnboardingGoals from '@/pages/onboarding/goals'
import OnboardingComplete from '@/pages/onboarding/complete'

// App Pages
import Dashboard from '@/pages/app/dashboard'
import Pots from '@/pages/app/pots'
import Goals from '@/pages/app/goals'
import Expenses from '@/pages/app/expenses'
import Coach from '@/pages/app/coach'
import Profile from '@/pages/app/profile'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Onboarding Flow */}
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<Navigate to="/onboarding/welcome" replace />} />
          <Route path="welcome" element={<OnboardingWelcome />} />
          <Route path="profile" element={<OnboardingProfile />} />
          <Route path="goals" element={<OnboardingGoals />} />
          <Route path="complete" element={<OnboardingComplete />} />
        </Route>

        {/* Main App */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pots" element={<Pots />} />
          <Route path="goals" element={<Goals />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="coach" element={<Coach />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
