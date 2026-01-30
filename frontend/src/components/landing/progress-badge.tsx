import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressBadgeProps {
  icon: LucideIcon
  label: string
  value: string
  color?: string
  delay?: number
  className?: string
}

export function ProgressBadge({
  icon: Icon,
  label,
  value,
  color = '#c8ff00',
  delay = 0,
  className,
}: ProgressBadgeProps) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl bg-card border-2 border-border transition-all duration-300',
        'hover:border-[#c8ff00]/30 hover:shadow-lg',
        className
      )}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  )
}

interface AchievementBadgeProps {
  icon: LucideIcon
  title: string
  description: string
  unlocked?: boolean
  delay?: number
  className?: string
}

export function AchievementBadge({
  icon: Icon,
  title,
  description,
  unlocked = true,
  delay = 0,
  className,
}: AchievementBadgeProps) {
  return (
    <motion.div
      className={cn(
        'relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300',
        unlocked
          ? 'bg-gradient-to-br from-[#c8ff00]/10 to-transparent border border-[#c8ff00]/20'
          : 'bg-muted/50 border border-border opacity-60',
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          unlocked ? 'bg-[#c8ff00]' : 'bg-muted'
        )}
      >
        <Icon className={cn('w-6 h-6', unlocked ? 'text-black' : 'text-muted-foreground')} />
      </div>

      {/* Lock icon for locked achievements */}
      {!unlocked && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="w-3 h-3 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      </div>

      {/* Shine effect for unlocked */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          initial={false}
          whileHover={{
            background: [
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            ],
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  )
}

interface MilestoneBadgeProps {
  step: number
  label: string
  completed?: boolean
  current?: boolean
  delay?: number
  onClick?: () => void
  className?: string
}

export function MilestoneBadge({
  step,
  label,
  completed = false,
  current = false,
  delay = 0,
  onClick,
  className,
}: MilestoneBadgeProps) {
  return (
    <motion.button
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 min-w-[200px]',
        completed && 'bg-[#c8ff00] border-[#c8ff00] text-black',
        current && 'bg-[#c8ff00]/10 border-[#c8ff00]',
        !completed && !current && 'bg-card border-border hover:border-[#c8ff00]/30',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
          completed && 'bg-black text-white',
          current && 'bg-[#c8ff00] text-black',
          !completed && !current && 'bg-muted'
        )}
      >
        {completed ? '✓' : step}
      </div>
      <span className={cn('font-medium text-sm', !completed && !current && 'text-muted-foreground')}>
        {label}
      </span>

      {/* Pulse animation for current */}
      {current && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-[#c8ff00]/20"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  )
}
