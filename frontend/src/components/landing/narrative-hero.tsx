import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Character, type CharacterEmotion } from './character'
import { DialogueBox, type DialogueMessage } from './dialogue-box'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'

interface Scenario {
  id: string
  title: string
  description: string
  steps: {
    userEmotion: CharacterEmotion
    coachEmotion: CharacterEmotion
    dialogue: string
  }[]
}

const scenarios: Scenario[] = [
  {
    id: 'vacation',
    title: 'Dream Vacation',
    description: 'See how Coach helps you save for your goals',
    steps: [
      {
        userEmotion: 'curious',
        coachEmotion: 'happy',
        dialogue: "I really want to go on that Japan trip, but I'm not sure if I can afford it...",
      },
      {
        userEmotion: 'thoughtful',
        coachEmotion: 'excited',
        dialogue: "Great news! If you save $300/month, you'll be there in 11 months! I can show you exactly how to adjust your spending.",
      },
      {
        userEmotion: 'happy',
        coachEmotion: 'proud',
        dialogue: "That sounds doable! Let's start planning!",
      },
    ],
  },
  {
    id: 'impulse',
    title: 'Smart Spending',
    description: 'Understand the impact of every purchase',
    steps: [
      {
        userEmotion: 'excited',
        coachEmotion: 'curious',
        dialogue: "This new gaming console looks amazing! Should I get it?",
      },
      {
        userEmotion: 'thoughtful',
        coachEmotion: 'thoughtful',
        dialogue: "Before you decide... this would delay your vacation goal by 3 weeks. But I found a way to get both! Spread the cost over 3 months?",
      },
      {
        userEmotion: 'happy',
        coachEmotion: 'happy',
        dialogue: "That's a great compromise! Thanks, Coach!",
      },
    ],
  },
  {
    id: 'goals',
    title: 'Goal Achievement',
    description: 'Celebrate your wins together',
    steps: [
      {
        userEmotion: 'proud',
        coachEmotion: 'excited',
        dialogue: "I did it! My emergency fund is fully funded!",
      },
      {
        userEmotion: 'happy',
        coachEmotion: 'proud',
        dialogue: "AMAZING work! You're 57% ahead of schedule! What's next? Maybe that down payment fund?",
      },
      {
        userEmotion: 'excited',
        coachEmotion: 'happy',
        dialogue: "Let's do it! I'm feeling unstoppable!",
      },
    ],
  },
]

export function NarrativeHero() {
  const navigate = useNavigate()
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showDialogue, setShowDialogue] = useState(true)

  const scenario = scenarios[currentScenario]

  const messages: DialogueMessage[] = scenario.steps.map((s, i) => ({
    id: `${scenario.id}-${i}`,
    text: s.dialogue,
    speaker: i % 2 === 0 ? 'user' : 'coach',
  }))

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      // Move to next scenario
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario((s) => s + 1)
        setCurrentStep(0)
      } else {
        // Loop back
        setCurrentScenario(0)
        setCurrentStep(0)
      }
    }
    setShowDialogue(true)
  }

  const handleGetStarted = () => {
    navigate('/onboarding/welcome')
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background via-[#c8ff00]/5 to-background overflow-hidden pt-16">
      {/* Background decoration with improved animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-[#c8ff00]/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1.2, 1, 1.2],
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Additional floating particles */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header with staggered animations */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c8ff00]/10 border border-[#c8ff00]/20 mb-4"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(200, 255, 0, 0.15)' }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Sparkles className="w-4 h-4 text-[#c8ff00]" />
            </motion.div>
            <span className="text-sm font-medium">Meet your AI Money Coach</span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.span 
              className="inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Your money,
            </motion.span>{' '}
            <motion.span 
              className="inline-block text-[#c8ff00]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              reimagined.
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Watch how Coach helps you make smarter financial decisions every day
          </motion.p>
        </motion.div>

        {/* Comic Panel Scene */}
        <div className="relative">
          {/* Scene container with improved entrance */}
          <motion.div
            className="relative bg-gradient-to-br from-muted/50 to-muted border-2 border-border rounded-3xl p-6 md:p-12 min-h-[400px] md:min-h-[500px] shadow-2xl shadow-[#c8ff00]/5"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {/* Scene label */}
            <motion.div
              className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div 
                className="px-3 py-1 rounded-full bg-[#c8ff00] text-black text-xs font-bold uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Scenario {currentScenario + 1}/{scenarios.length}
              </motion.div>
              <span className="text-sm text-muted-foreground font-medium">
                {scenario.title}
              </span>
            </motion.div>

            {/* Characters with improved animations */}
            <div className="flex items-center justify-center gap-4 md:gap-20 mb-8 md:mb-12 pt-12 md:pt-8">
              {/* User */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -5 }}
              >
                <Character
                  name="user"
                  emotion={scenario.steps[currentStep]?.userEmotion || 'happy'}
                  size={100}
                />
                <motion.span 
                  className="text-sm font-medium text-muted-foreground mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  You
                </motion.span>
              </motion.div>

              {/* VS divider */}
              <motion.div
                className="text-2xl font-bold text-muted-foreground/30"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.1, type: 'spring' }}
              >
                ✦
              </motion.div>

              {/* Coach */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -5 }}
              >
                <Character
                  name="coach"
                  emotion={scenario.steps[currentStep]?.coachEmotion || 'happy'}
                  size={120}
                />
                <motion.span 
                  className="text-sm font-medium text-[#c8ff00] mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Coach
                </motion.span>
              </motion.div>
            </div>

            {/* Dialogue */}
            <AnimatePresence mode="wait">
              {showDialogue && (
                <motion.div
                  key={`${currentScenario}-${currentStep}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="max-w-lg mx-auto"
                >
                  <DialogueBox
                    messages={messages.slice(0, currentStep + 1)}
                    onComplete={handleNext}
                    typingSpeed={25}
                    autoAdvanceDelay={2500}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Scenario selector with enhanced animations */}
          <motion.div 
            className="flex justify-center gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            {scenarios.map((s, idx) => (
              <motion.button
                key={s.id}
                onClick={() => {
                  setCurrentScenario(idx)
                  setCurrentStep(0)
                  setShowDialogue(true)
                }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === currentScenario
                    ? 'bg-[#c8ff00] w-16'
                    : 'bg-muted-foreground/20 hover:bg-muted-foreground/40 w-12'
                )}
                aria-label={s.title}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-[#c8ff00] text-black hover:bg-[#d4ff33] font-semibold h-14 px-8 text-base group shadow-lg shadow-[#c8ff00]/20"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base hover:bg-muted/50"
              onClick={() => {
                setCurrentScenario((currentScenario + 1) % scenarios.length)
                setCurrentStep(0)
                setShowDialogue(true)
              }}
            >
              See More Scenarios
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
