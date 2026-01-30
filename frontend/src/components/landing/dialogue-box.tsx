import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface DialogueMessage {
  id: string
  text: string
  speaker: 'coach' | 'user'
  delay?: number
}

interface DialogueBoxProps {
  messages: DialogueMessage[]
  onComplete?: () => void
  typingSpeed?: number
  autoAdvance?: boolean
  autoAdvanceDelay?: number
  className?: string
}

export function DialogueBox({
  messages,
  onComplete,
  typingSpeed = 30,
  autoAdvance = true,
  autoAdvanceDelay = 2000,
  className,
}: DialogueBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showContinue, setShowContinue] = useState(false)

  const currentMessage = messages[currentIndex]
  const isLastMessage = currentIndex === messages.length - 1
  const isCoach = currentMessage?.speaker === 'coach'

  // Typewriter effect
  useEffect(() => {
    if (!currentMessage) return

    setIsTyping(true)
    setShowContinue(false)
    setDisplayText('')

    let index = 0
    const text = currentMessage.text

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)

        if (!isLastMessage && autoAdvance) {
          setShowContinue(true)
          setTimeout(() => {
            setCurrentIndex((i) => i + 1)
          }, autoAdvanceDelay)
        } else if (isLastMessage) {
          onComplete?.()
        }
      }
    }, typingSpeed)

    return () => clearInterval(timer)
  }, [currentMessage, typingSpeed, autoAdvance, autoAdvanceDelay, isLastMessage, onComplete])

  const handleClick = useCallback(() => {
    if (isTyping) return
    if (!isLastMessage) {
      setCurrentIndex((i) => i + 1)
    } else {
      onComplete?.()
    }
  }, [isTyping, isLastMessage, onComplete])

  return (
    <motion.div
      className={cn(
        'dialogue-box relative',
        'rounded-2xl p-4 md:p-6',
        'max-w-md mx-auto',
        isCoach ? 'bg-gradient-to-br from-[#c8ff00]/20 to-[#c8ff00]/5' : 'bg-muted',
        'border-2',
        isCoach ? 'border-[#c8ff00]/30' : 'border-border',
        className
      )}
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      onClick={handleClick}
      style={{ cursor: isTyping ? 'default' : 'pointer' }}
    >
      {/* Speaker indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            'w-3 h-3 rounded-full',
            isCoach ? 'bg-[#c8ff00]' : 'bg-muted-foreground'
          )}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isCoach ? 'Coach' : 'You'}
        </span>
      </div>

      {/* Message text with cursor */}
      <p className="text-base md:text-lg leading-relaxed min-h-[3rem]">
        {displayText}
        {isTyping && (
          <motion.span
            className="inline-block w-0.5 h-5 bg-foreground ml-0.5"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </p>

      {/* Continue indicator */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            className="absolute bottom-2 right-4 flex items-center gap-1 text-xs text-muted-foreground"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <span>Tap to continue</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-3">
        {messages.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              idx === currentIndex
                ? 'flex-1 bg-foreground'
                : idx < currentIndex
                  ? 'w-2 bg-muted-foreground/50'
                  : 'w-2 bg-muted-foreground/20'
            )}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Compact version for inline use
interface InlineDialogueProps {
  message: string
  speaker: 'coach' | 'user'
  onComplete?: () => void
  className?: string
}

export function InlineDialogue({ message, speaker, onComplete, className }: InlineDialogueProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const isCoach = speaker === 'coach'

  useEffect(() => {
    setIsTyping(true)
    setDisplayText('')

    let index = 0
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayText(message.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        setTimeout(() => onComplete?.(), 1000)
      }
    }, 25)

    return () => clearInterval(timer)
  }, [message, onComplete])

  return (
    <motion.div
      className={cn(
        'inline-flex items-start gap-2',
        isCoach && 'flex-row-reverse',
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div
        className={cn(
          'px-3 py-2 rounded-2xl max-w-xs text-sm',
          isCoach
            ? 'bg-[#c8ff00] text-black rounded-br-sm'
            : 'bg-muted rounded-bl-sm'
        )}
      >
        {displayText}
        {isTyping && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="ml-0.5"
          >
            ▊
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}
