import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Target, TrendingUp, Shield, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Feature {
  id: string
  icon: typeof Sparkles
  title: string
  description: string
  color: string
  highlight: string
  badge?: string
}

const features: Feature[] = [
  {
    id: 'ai-coach',
    icon: Sparkles,
    title: 'AI Money Coach',
    description: 'Your personal financial advisor that helps you make smarter decisions every day. See the impact of purchases before you make them.',
    color: 'from-[#c8ff00]/20 to-[#c8ff00]/5',
    highlight: 'border-[#c8ff00]/30',
    badge: 'NEW',
  },
  {
    id: 'pots',
    icon: Target,
    title: 'Smart Pots',
    description: 'Automatically allocate your income across needs, wants, savings & investments. Customizable percentages that work for your lifestyle.',
    color: 'from-blue-500/20 to-blue-500/5',
    highlight: 'border-blue-500/30',
  },
  {
    id: 'goals',
    icon: TrendingUp,
    title: 'Visual Goals',
    description: 'Set financial goals with milestone tracking. Watch your progress grow and get motivated by how close you are to achieving your dreams.',
    color: 'from-purple-500/20 to-purple-500/5',
    highlight: 'border-purple-500/30',
  },
  {
    id: 'insights',
    icon: Shield,
    title: 'Smart Insights',
    description: 'Understand your spending patterns with intelligent categorization. Get tips tailored to your behavior and goals.',
    color: 'from-green-500/20 to-green-500/5',
    highlight: 'border-green-500/30',
  },
]

interface FeatureShowcaseProps {
  className?: string
}

export function FeatureShowcase({ className }: FeatureShowcaseProps) {
  return (
    <section
      id="features"
      className={cn(
        'relative py-20 md:py-32 bg-background overflow-hidden',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#c8ff00]/5 via-transparent to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Badge className="mb-4 bg-[#c8ff00]/10 text-[#c8ff00] border-[#c8ff00]/20">
              <Zap className="w-3 h-3 mr-1" />
              Everything you need
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Features that make
            <span className="text-[#c8ff00]"> saving fun</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            No more boring spreadsheets. MoneyPot makes financial management
            interactive, visual, and actually enjoyable.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Highlight banner */}
        <motion.div
          className="relative rounded-2xl bg-gradient-to-r from-[#c8ff00]/10 via-[#c8ff00]/5 to-transparent border border-[#c8ff00]/20 p-6 md:p-8 text-center overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-[#c8ff00]/5 to-transparent rounded-2xl"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative z-10">
            <motion.p 
              className="text-sm font-semibold text-[#c8ff00] mb-2 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              What makes us different
            </motion.p>
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              We're not another budgeting app
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              MoneyPot is your personal financial coach that helps you understand the
              impact of every decision, negotiate trade-offs, and achieve your goals faster.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  feature: Feature
  index: number
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          'border-2',
          feature.highlight,
          isHovered && 'shadow-lg scale-[1.02]'
        )}
      >
        <CardContent className="p-6 relative z-10">
          <div
            className={cn(
              'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4',
              feature.color
            )}
          >
            <Icon className="w-7 h-7 text-foreground" />
          </div>

          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold">{feature.title}</h3>
            {feature.badge && (
              <Badge
                variant="secondary"
                className="shrink-0 bg-[#c8ff00]/10 text-[#c8ff00] text-xs"
              >
                {feature.badge}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>

        {/* Hover effect overlay */}
        <motion.div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 pointer-events-none',
            feature.color
          )}
          animate={{ opacity: isHovered ? 0.5 : 0 }}
        />

        {/* Floating decoration */}
        <motion.div
          className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-white/50 to-white/10 blur-xl"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.5, 0.8, 0.5] : 0,
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
      </Card>
    </motion.div>
  )
}
