import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  action,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  )
}
