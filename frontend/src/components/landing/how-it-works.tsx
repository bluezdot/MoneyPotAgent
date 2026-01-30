import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { MilestoneBadge } from './progress-badge'
import { CheckCircle2, Users, PiggyBank, MessageCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    label: 'Get Started',
    title: 'Create your account',
    description: 'Sign up and tell us about yourself. We just need your name, email, and monthly income to get started.',
    icon: Users,
    color: '#c8ff00',
  },
  {
    id: 2,
    label: 'Set Goals',
    title: 'Define your financial goals',
    description: 'Choose what matters to you - emergency fund, vacation, new car, or anything else. We\'ll help you create a plan.',
    icon: Sparkles,
    color: '#8b5cf6',
  },
  {
    id: 3,
    label: 'Smart Pots',
    title: 'Set up your money pots',
    description: 'Allocate your income across different pots automatically. We suggest smart defaults you can customize.',
    icon: PiggyBank,
    color: '#3b82f6',
  },
  {
    id: 4,
    label: 'Start Growing',
    title: 'Meet your AI Coach',
    description: 'Get personalized advice, see the impact of spending decisions, and celebrate wins together!',
    icon: MessageCircle,
    color: '#10b981',
  },
]

interface HowItWorksProps {
  className?: string
}

export function HowItWorks({ className }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()

  const step = steps[activeStep]
  const StepIcon = step.icon

  return (
    <section className={cn('py-20 md:py-32 bg-muted/30', className)}>
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get started in
            <span className="text-[#c8ff00]"> 4 simple steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No complex setup. No financial degree required. Just you and your
            AI money coach, building a better financial future together.
          </p>
        </motion.div>

        {/* Interactive stepper */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Step badges */}
          <div className="space-y-3">
            {steps.map((s, index) => (
              <MilestoneBadge
                key={s.id}
                step={s.id}
                label={s.label}
                completed={index < activeStep}
                current={index === activeStep}
                delay={index * 0.1}
                onClick={() => setActiveStep(index)}
                className="w-full"
              />
            ))}
          </div>

          {/* Step detail card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-8 md:p-10 border-2">
                  {/* Icon */}
                  <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${step.color}20` }}
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <StepIcon className="w-10 h-10" style={{ color: step.color }} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: step.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {activeStep + 1}/{steps.length}
                    </span>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className="flex-1"
                    >
                      Previous
                    </Button>
                    {activeStep < steps.length - 1 ? (
                      <Button
                        size="lg"
                        onClick={() => setActiveStep(activeStep + 1)}
                        className="flex-1 bg-[#c8ff00] text-black hover:bg-[#d4ff33]"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={() => navigate('/onboarding/welcome')}
                        className="flex-1 bg-[#c8ff00] text-black hover:bg-[#d4ff33]"
                      >
                        Get Started
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Background decoration */}
            <motion.div
              className="absolute -inset-4 rounded-3xl opacity-30 blur-3xl -z-10"
              style={{ backgroundColor: step.color }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
