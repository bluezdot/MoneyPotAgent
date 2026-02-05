import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Mic, MicOff, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExpenseCategory } from '@/types'

interface VoiceInputDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onExpenseDetected: (data: {
        description: string
        amount: number
        category: ExpenseCategory
    }) => void
}

export function VoiceInputDialog({ open, onOpenChange, onExpenseDetected }: VoiceInputDialogProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'done'>('idle')
    const [detectedExpense, setDetectedExpense] = useState<{
        description: string
        amount: number
        category: ExpenseCategory
    } | null>(null)

    // Simulate voice recording animation
    const [waveAnimation, setWaveAnimation] = useState(0)

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>
        if (isListening) {
            interval = setInterval(() => {
                setWaveAnimation((prev) => (prev + 1) % 4)
            }, 300)
        }
        return () => clearInterval(interval)
    }, [isListening])

    const startListening = () => {
        setIsListening(true)
        setStatus('listening')
        setTranscript('')
        setDetectedExpense(null)

        // Simulate voice recognition (in real app, use Web Speech API or backend)
        setTimeout(() => {
            simulateVoiceRecognition()
        }, 2000)
    }

    const stopListening = () => {
        setIsListening(false)
        if (status === 'listening') {
            setStatus('processing')
            processTranscript()
        }
    }

    const simulateVoiceRecognition = () => {
        // Demo transcripts
        const demoTranscripts = [
            "I spent $45 on groceries at Whole Foods",
            "Lunch at the Italian restaurant cost me $32.50",
            "Uber ride to downtown was $18",
            "Coffee at Starbucks, $5.75",
            "Movie tickets for two, $28",
            "Gym membership monthly fee, $49.99"
        ]

        const randomTranscript = demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)]
        setTranscript(randomTranscript)
        setIsListening(false)
        setStatus('processing')

        // Process after showing transcript
        setTimeout(() => {
            processTranscript(randomTranscript)
        }, 1000)
    }

    const processTranscript = (text?: string) => {
        const transcriptText = text || transcript

        // Simple AI parsing simulation (in real app, use NLP/LLM)
        const amountMatch = transcriptText.match(/\$?(\d+(?:\.\d{2})?)/)
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 0

        // Detect category based on keywords
        let category: ExpenseCategory = 'other'
        const lowerText = transcriptText.toLowerCase()

        if (lowerText.includes('food') || lowerText.includes('lunch') || lowerText.includes('dinner') ||
            lowerText.includes('coffee') || lowerText.includes('restaurant') || lowerText.includes('groceries')) {
            category = 'food'
        } else if (lowerText.includes('uber') || lowerText.includes('taxi') || lowerText.includes('bus') ||
            lowerText.includes('ride')) {
            category = 'transport'
        } else if (lowerText.includes('movie') || lowerText.includes('theater') || lowerText.includes('concert')) {
            category = 'entertainment'
        } else if (lowerText.includes('gym') || lowerText.includes('health') || lowerText.includes('doctor')) {
            category = 'health'
        }

        // Extract description (remove amount)
        let description = transcriptText.replace(/\$?(\d+(?:\.\d{2})?)/, '').trim()
        description = description.replace(/^(I spent|cost me|was|for)/, '').trim()
        description = description.charAt(0).toUpperCase() + description.slice(1)

        const expense = {
            description: description || 'Voice expense',
            amount,
            category,
        }

        setDetectedExpense(expense)
        setStatus('done')
    }

    const handleConfirm = () => {
        if (detectedExpense) {
            onExpenseDetected(detectedExpense)
            onOpenChange(false)
            resetDialog()
        }
    }

    const handleRetry = () => {
        resetDialog()
        startListening()
    }

    const resetDialog = () => {
        setIsListening(false)
        setTranscript('')
        setStatus('idle')
        setDetectedExpense(null)
    }

    const handleClose = () => {
        onOpenChange(false)
        resetDialog()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Voice Expense Input
                    </DialogTitle>
                    <DialogDescription>
                        Speak naturally about your expense, we'll extract the details automatically
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Voice Recording Area */}
                    <div className="flex flex-col items-center justify-center py-8">
                        {/* Microphone Button */}
                        <div className="relative mb-6">
                            {/* Animated waves when listening */}
                            {isListening && (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "absolute inset-0 rounded-full border-4 border-primary/30",
                                                "animate-ping",
                                                waveAnimation === i % 4 && "opacity-100",
                                                waveAnimation !== i % 4 && "opacity-0"
                                            )}
                                            style={{
                                                animationDuration: '2s',
                                                animationDelay: `${i * 0.3}s`,
                                                transform: `scale(${1 + i * 0.3})`
                                            }}
                                        />
                                    ))}
                                </>
                            )}

                            <button
                                onClick={isListening ? stopListening : startListening}
                                disabled={status === 'processing'}
                                className={cn(
                                    "relative w-24 h-24 rounded-full flex items-center justify-center transition-all",
                                    "focus:outline-none focus:ring-4 focus:ring-primary/20",
                                    isListening
                                        ? "bg-red-500 hover:bg-red-600 scale-110"
                                        : status === 'processing'
                                            ? "bg-muted cursor-not-allowed"
                                            : "bg-primary hover:bg-primary/90 hover:scale-105"
                                )}
                            >
                                {status === 'processing' ? (
                                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                                ) : isListening ? (
                                    <MicOff className="h-10 w-10 text-white" />
                                ) : (
                                    <Mic className="h-10 w-10 text-white" />
                                )}
                            </button>
                        </div>

                        {/* Status Text */}
                        <div className="text-center mb-4">
                            {status === 'idle' && (
                                <p className="text-sm text-muted-foreground">
                                    Tap the microphone to start recording
                                </p>
                            )}
                            {status === 'listening' && (
                                <div className="space-y-2">
                                    <Badge variant="destructive" className="gap-1 animate-pulse">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        Listening...
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Try: "I spent $45 on groceries"
                                    </p>
                                </div>
                            )}
                            {status === 'processing' && (
                                <Badge className="gap-2">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Processing...
                                </Badge>
                            )}
                            {status === 'done' && (
                                <Badge className="gap-1 bg-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Ready to save
                                </Badge>
                            )}
                        </div>

                        {/* Transcript */}
                        {transcript && (
                            <div className="w-full p-4 rounded-lg bg-muted border border-border mb-4">
                                <p className="text-sm font-medium mb-1 text-muted-foreground">Transcript:</p>
                                <p className="text-sm italic">"{transcript}"</p>
                            </div>
                        )}

                        {/* Detected Expense */}
                        {detectedExpense && (
                            <div className="w-full p-4 rounded-lg bg-primary/10 border-2 border-primary space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-semibold">Detected Expense</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Description:</span>
                                        <span className="text-sm font-medium">{detectedExpense.description}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Amount:</span>
                                        <span className="text-sm font-bold text-primary">${detectedExpense.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Category:</span>
                                        <Badge variant="secondary" className="capitalize">
                                            {detectedExpense.category}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {status === 'done' ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleRetry}
                                    className="flex-1"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Confirm
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="w-full"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>

                    {/* Hint */}
                    <div className="text-center text-xs text-muted-foreground">
                        <p>Examples: "Coffee at Starbucks for $5" • "Uber to downtown, $18"</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
