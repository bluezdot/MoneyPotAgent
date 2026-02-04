import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import type { PurchaseImpactRequest, ExpenseCategory } from '@/types'
import { Calculator, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const categories: { value: ExpenseCategory; label: string }[] = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transport' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
]

interface PurchaseInputFormProps {
    onSubmit: (request: PurchaseImpactRequest) => void
    onCancel: () => void
    isLoading?: boolean
}

export function PurchaseInputForm({
    onSubmit,
    onCancel,
    isLoading = false,
}: PurchaseInputFormProps) {
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState<ExpenseCategory>('other')
    const [recurring, setRecurring] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!description.trim() || !amount || parseFloat(amount) <= 0) {
            return
        }

        onSubmit({
            description: description.trim(),
            amount: parseFloat(amount),
            category,
            recurring,
        })

        // Reset form
        setDescription('')
        setAmount('')
        setCategory('other')
        setRecurring(false)
    }

    const isValid = description.trim() && amount && parseFloat(amount) > 0

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="border-2 border-[#c8ff00]/30 bg-gradient-to-br from-[#c8ff00]/5 to-transparent">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#c8ff00]/20 flex items-center justify-center">
                                    <Calculator className="h-4 w-4 text-[#c8ff00]" />
                                </div>
                                <h3 className="font-semibold">Check Purchase Impact</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">What do you want to buy?</Label>
                                <Input
                                    id="description"
                                    placeholder="e.g., New headphones"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount ($)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={category}
                                        onValueChange={(v) => setCategory(v as ExpenseCategory)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="space-y-0.5">
                                    <Label htmlFor="recurring" className="cursor-pointer">
                                        Recurring expense
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        This expense repeats monthly
                                    </p>
                                </div>
                                <Switch
                                    id="recurring"
                                    checked={recurring}
                                    onCheckedChange={setRecurring}
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#c8ff00] text-black hover:bg-[#d4ff33]"
                                disabled={!isValid || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Calculator className="h-4 w-4 mr-2" />
                                        Analyze Impact
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
}
