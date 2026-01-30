import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ConfettiProps {
  count?: number
  colors?: string[]
  className?: string
}

export function Confetti({
  count = 50,
  colors = ['#c8ff00', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
  className,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string; delay: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 40,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [count, colors])

  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2"
            style={{
              left: `${particle.x}%`,
              backgroundColor: particle.color,
            }}
            initial={{
              y: particle.y,
              rotate: particle.rotation,
              opacity: 1,
            }}
            animate={{
              y: ['120vh'],
              rotate: [particle.rotation, particle.rotation + 720],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Simple confetti burst for celebrations
interface ConfettiBurstProps {
  x?: number
  y?: number
  size?: number
  colors?: string[]
  className?: string
}

export function ConfettiBurst({
  x = 50,
  y = 50,
  size = 100,
  colors = ['#c8ff00', '#8b5cf6', '#3b82f6', '#10b981'],
  className,
}: ConfettiBurstProps) {
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    setBurst(true)
  }, [])

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div
      className={cn('absolute pointer-events-none', className)}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <AnimatePresence>
        {burst && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: particle.color,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(particle.angle) * size,
              y: Math.sin(particle.angle) * size,
              scale: [1, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
