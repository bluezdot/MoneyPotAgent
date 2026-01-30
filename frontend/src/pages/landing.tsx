import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { NarrativeHero } from '@/components/landing/narrative-hero'
import { FeatureShowcase } from '@/components/landing/feature-showcase'
import { HowItWorks } from '@/components/landing/how-it-works'
import { ProgressBadge, AchievementBadge } from '@/components/landing/progress-badge'
import { Confetti, ConfettiBurst } from '@/components/ui/confetti'
import {
  PiggyBank,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  { icon: Users, label: 'Happy Users', value: '50K+' },
  { icon: TrendingUp, label: 'Savings Rate', value: '89%' },
  { icon: Target, label: 'Goals Achieved', value: '12M+' },
  { icon: Star, label: 'User Rating', value: '4.9/5' },
]

const testimonials = [
  {
    quote: 'Finally saved my first $10k emergency fund! The AI coach kept me accountable and made it feel like a game.',
    author: 'Sarah Chen',
    role: 'Software Engineer',
    avatar: 'SC',
  },
  {
    quote: "The pot system changed how I think about money. Budgeting actually makes sense now, and I don't feel restricted.",
    author: 'Marcus Webb',
    role: 'Freelance Designer',
    avatar: 'MW',
  },
  {
    quote: 'Saved for my dream vacation in 8 months. The milestone tracking kept me motivated every step of the way!',
    author: 'Elena Ruiz',
    role: 'Marketing Manager',
    avatar: 'ER',
  },
]

const achievements = [
  {
    icon: Target,
    title: 'First Goal Set',
    description: 'Create your first financial goal and start your journey to financial freedom.',
  },
  {
    icon: PiggyBank,
    title: 'Pot Master',
    description: 'Set up all 5 money pots and automate your savings like a pro.',
  },
  {
    icon: TrendingUp,
    title: 'Savings Streak',
    description: 'Maintain positive savings for 3 consecutive months.',
  },
  {
    icon: MessageCircle,
    title: 'Coach Buddy',
    description: 'Have 10 conversations with your AI money coach.',
  },
]

function Navigation() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 bg-[#c8ff00] rounded-lg flex items-center justify-center"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <PiggyBank className="w-5 h-5 text-black" />
          </motion.div>
          <span className="font-bold text-lg">MoneyPot</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Stories
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/onboarding/welcome">
            <Button
              size="sm"
              className="bg-[#c8ff00] text-black hover:bg-[#d4ff33] font-semibold"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

function StatsSection() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <ProgressBadge
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Loved by
            <span className="text-[#c8ff00]"> thousands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who transformed their relationship with money
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-full bg-card border-2 border-border rounded-2xl p-6 hover:border-[#c8ff00]/30 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#c8ff00] text-[#c8ff00]"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8ff00] to-[#96ff00] flex items-center justify-center text-black font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AchievementsPreview() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c8ff00]/10 border border-[#c8ff00]/20 mb-4">
            <Sparkles className="w-4 h-4 text-[#c8ff00]" />
            <span className="text-sm font-medium">Gamified Savings</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Achievements that
            <span className="text-[#c8ff00]"> motivate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Earn badges, hit milestones, and celebrate your financial wins with your coach
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={achievement.title}
              {...achievement}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {showConfetti && <Confetti count={60} />}

      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          className="relative rounded-3xl bg-gradient-to-br from-[#c8ff00]/10 via-background to-[#c8ff00]/5 border-2 border-[#c8ff00]/20 p-8 md:p-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Confetti burst on hover */}
          <ConfettiBurst x={20} y={30} size={60} colors={['#c8ff00', '#8b5cf6']} />
          <ConfettiBurst x={80} y={20} size={80} colors={['#3b82f6', '#10b981']} />
          <ConfettiBurst x={50} y={70} size={70} colors={['#f59e0b', '#ef4444']} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to meet your
              <span className="text-[#c8ff00]"> money coach</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join 50,000+ people already building better financial habits. Start free
              today, no credit card required.
            </p>

            <Link to="/onboarding/welcome">
              <Button
                size="lg"
                className="bg-[#c8ff00] text-black hover:bg-[#d4ff33] font-semibold h-14 px-8 text-base group"
                onMouseEnter={() => setShowConfetti(true)}
              >
                Start Free Today
                <CheckCircle2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground mt-4">
              Takes 2 minutes • No credit card required • Cancel anytime
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8ff00] rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold">MoneyPot</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 MoneyPot. Your AI-powered financial health coach.
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="#" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Landing() {
  return (
    <motion.div 
      className="min-h-screen bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navigation />
      <NarrativeHero />
      <StatsSection />
      <FeatureShowcase />
      <HowItWorks />
      <AchievementsPreview />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </motion.div>
  )
}

export default Landing
