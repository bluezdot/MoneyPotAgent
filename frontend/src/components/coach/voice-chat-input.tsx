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
import { Mic, MicOff, Send, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceChatInputProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onTranscriptReady: (transcript: string) => void
    onSendDirectly?: (transcript: string) => void
}

export function VoiceChatInput({ open, onOpenChange, onTranscriptReady, onSendDirectly }: VoiceChatInputProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'done'>('idle')
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

        // Simulate voice recognition
        setTimeout(() => {
            simulateVoiceRecognition()
        }, 2500)
    }

    const stopListening = () => {
        setIsListening(false)
        if (status === 'listening') {
            setStatus('done')
        }
    }

    const simulateVoiceRecognition = () => {
        const demoQuestions = [
            "How am I doing on my Japan vacation goal?",
            "Should I buy a new laptop this month?",
            "Can you analyze my spending this week?",
            "What happens if I skip my gym subscription?",
            "How much should I save for my emergency fund?",
            "Show me my budget breakdown for this month",
            "I want to buy new headphones for 150 dollars",
            "How can I reduce my food expenses?",
            "When will I reach my savings goal?",
            "Give me tips to save more money"
        ]

        const randomQuestion = demoQuestions[Math.floor(Math.random() * demoQuestions.length)]
        setTranscript(randomQuestion)
        setIsListening(false)
        setStatus('done')
    }

    const handleUseInInput = () => {
        if (transcript) {
            onTranscriptReady(transcript)
            onOpenChange(false)
            resetDialog()
        }
    }

    const handleSendDirectly = () => {
        if (transcript && onSendDirectly) {
            onSendDirectly(transcript)
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
                        Voice Message
                    </DialogTitle>
                    <DialogDescription>
                        Ask your AI coach anything using your voice
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
                                                "animate-ping"
                                            )}
                                            style={{
                                                animationDuration: '2s',
                                                animationDelay: `${i * 0.3}s`,
                                                transform: `scale(${1 + i * 0.3})`,
                                                opacity: waveAnimation === i % 4 ? 1 : 0
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
                                    Tap the microphone to start speaking
                                </p>
                            )}
                            {status === 'listening' && (
                                <div className="space-y-2">
                                    <Badge variant="destructive" className="gap-1 animate-pulse">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        Listening...
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Ask me anything about your finances
                                    </p>
                                </div>
                            )}
                            {status === 'processing' && (
                                <Badge className="gap-2">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Processing...
                                </Badge>
                            )}
                            {status === 'done' && transcript && (
                                <Badge className="gap-1 bg-green-600">
                                    <Mic className="h-3 w-3" />
                                    Ready to send
                                </Badge>
                            )}
                        </div>

                        {/* Transcript */}
                        {transcript && (
                            <div className="w-full p-4 rounded-lg bg-primary/10 border-2 border-primary">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-semibold">Your Question:</p>
                                </div>
                                <p className="text-sm italic leading-relaxed">
                                    "{transcript}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        {status === 'done' && transcript ? (
                            <>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleRetry}
                                        className="flex-1"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        onClick={handleUseInInput}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Edit First
                                    </Button>
                                </div>
                                <Button
                                    onClick={handleSendDirectly}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Now
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
                    <div className="text-center text-xs text-muted-foreground space-y-1">
                        <p className="font-medium">Try asking:</p>
                        <p>"How am I doing on my savings goal?"</p>
                        <p>"Should I buy a new laptop this month?"</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
