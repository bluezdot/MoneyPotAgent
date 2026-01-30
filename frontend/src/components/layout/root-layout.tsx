import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      {children}
    </ThemeProvider>
  )
}
