import type {
    PurchaseImpactRequest,
    PurchaseImpactResult,
    PotImpact,
    GoalImpact,
    Pot,
    Goal,
    UserProfile,
    ExpenseCategory,
} from '@/types'

/**
 * Maps expense categories to pot categories for automatic pot selection
 */
const CATEGORY_TO_POT_MAP: Record<ExpenseCategory, string[]> = {
    food: ['necessities', 'wants'],
    transport: ['necessities'],
    utilities: ['necessities'],
    entertainment: ['wants'],
    shopping: ['wants'],
    health: ['necessities'],
    education: ['savings', 'necessities'],
    other: ['wants', 'necessities'],
}

/**
 * Find the best pot to deduct from based on purchase category and available balance
 */
function findBestPot(
    category: ExpenseCategory | undefined,
    pots: Pot[]
): Pot | null {
    if (!pots.length) return null

    // Filter pots based on category mapping
    let candidatePots = pots
    if (category && CATEGORY_TO_POT_MAP[category]) {
        candidatePots = pots.filter((pot) =>
            CATEGORY_TO_POT_MAP[category].includes(pot.category)
        )
    }

    // If no matching pots, use all pots
    if (candidatePots.length === 0) {
        candidatePots = pots
    }

    // Sort by current amount (descending) to prefer pots with more money
    candidatePots.sort((a, b) => b.currentAmount - a.currentAmount)

    // Return pot with highest balance
    return candidatePots[0] || null
}

/**
 * Calculate pot impact from a purchase
 */
function calculatePotImpact(
    purchase: PurchaseImpactRequest,
    pot: Pot
): PotImpact {
    const projectedAmount = pot.currentAmount - purchase.amount
    const change = -purchase.amount
    const percentageChange = pot.currentAmount > 0
        ? (change / pot.currentAmount) * 100
        : 0

    return {
        potId: pot.id,
        potName: pot.name,
        currentAmount: pot.currentAmount,
        projectedAmount,
        change,
        percentageChange,
    }
}

/**
 * Calculate monthly contribution to a goal based on pot allocation
 */
function calculateMonthlyContribution(
    goal: Goal,
    pot: Pot,
    monthlyIncome: number
): number {
    // Monthly contribution = (pot percentage * monthly income) allocated to this goal
    // For simplicity, assume all of pot's allocation goes to its linked goal
    return (pot.percentage / 100) * monthlyIncome
}

/**
 * Calculate goal impact from a purchase
 */
function calculateGoalImpact(
    purchase: PurchaseImpactRequest,
    goal: Goal,
    pot: Pot,
    monthlyIncome: number
): GoalImpact | null {
    // Only calculate if goal is linked to affected pot
    if (goal.potId !== pot.id) return null

    const monthlyContribution = calculateMonthlyContribution(goal, pot, monthlyIncome)

    // If no monthly contribution, can't calculate delay
    if (monthlyContribution <= 0) {
        return {
            goalId: goal.id,
            goalTitle: goal.title,
            currentProgress: (goal.currentAmount / goal.targetAmount) * 100,
            projectedProgress: (goal.currentAmount / goal.targetAmount) * 100,
            delayDays: 0,
            delayWeeks: 0,
        }
    }

    // Calculate how many months the purchase amount represents
    const delayMonths = purchase.amount / monthlyContribution
    const delayDays = Math.ceil(delayMonths * 30)
    const delayWeeks = Math.ceil(delayDays / 7)

    // Current progress
    const currentProgress = (goal.currentAmount / goal.targetAmount) * 100

    // Projected progress (doesn't change the current amount, just delays timeline)
    const projectedProgress = currentProgress

    return {
        goalId: goal.id,
        goalTitle: goal.title,
        currentProgress,
        projectedProgress,
        delayDays,
        delayWeeks,
    }
}

/**
 * Assess risk level based on remaining balance and user context
 */
function assessRisk(
    projectedBalance: number,
    pot: Pot,
    totalPotBalance: number
): 'low' | 'medium' | 'high' {
    // Calculate percentage of pot remaining
    const remainingPercentage = pot.currentAmount > 0
        ? (projectedBalance / pot.currentAmount) * 100
        : 0

    // Calculate percentage of total balance
    const percentageOfTotal = totalPotBalance > 0
        ? (projectedBalance / totalPotBalance) * 100
        : 0

    // High risk if:
    // - Goes negative
    // - Less than 20% of pot remaining
    // - Less than 10% of total balance
    if (projectedBalance < 0 || remainingPercentage < 20 || percentageOfTotal < 10) {
        return 'high'
    }

    // Medium risk if:
    // - Less than 50% of pot remaining
    // - Less than 30% of total balance
    if (remainingPercentage < 50 || percentageOfTotal < 30) {
        return 'medium'
    }

    // Otherwise low risk
    return 'low'
}

/**
 * Generate recommendation message based on analysis
 */
function generateRecommendation(
    request: PurchaseImpactRequest,
    riskLevel: 'low' | 'medium' | 'high',
    potImpacts: PotImpact[],
    goalImpacts: GoalImpact[]
): string {
    const maxDelay = Math.max(...goalImpacts.map((g) => g.delayDays), 0)

    if (riskLevel === 'high') {
        return `⚠️ High Risk: This purchase would significantly impact your budget. Consider waiting or finding a cheaper alternative.`
    }

    if (riskLevel === 'medium') {
        if (maxDelay > 7) {
            return `⚠️ Medium Risk: This purchase will delay your goals by ${maxDelay} days. Make sure it's worth it!`
        }
        return `⚠️ Medium Risk: This will impact your budget. Consider if this purchase aligns with your goals.`
    }

    // Low risk
    if (maxDelay > 0) {
        return `✅ Low Risk: You can afford this! It will delay your goals by ${maxDelay} days, which is manageable.`
    }

    return `✅ Low Risk: You can comfortably afford this purchase. Go ahead!`
}

/**
 * Main function: Analyze purchase impact
 */
export function analyzePurchaseImpact(
    request: PurchaseImpactRequest,
    pots: Pot[],
    goals: Goal[],
    user: UserProfile
): PurchaseImpactResult {
    // Find which pot to deduct from
    const targetPot = findBestPot(request.category, pots)

    if (!targetPot) {
        return {
            id: `analysis-${Date.now()}`,
            request,
            canAfford: false,
            riskLevel: 'high',
            potImpacts: [],
            goalImpacts: [],
            recommendation: 'No available pots to fund this purchase.',
            timestamp: new Date(),
        }
    }

    // Calculate pot impact
    const potImpact = calculatePotImpact(request, targetPot)
    const potImpacts = [potImpact]

    // Calculate goal impacts for goals linked to this pot
    const goalImpacts: GoalImpact[] = goals
        .map((goal) => calculateGoalImpact(request, goal, targetPot, user.monthlyIncome))
        .filter((impact): impact is GoalImpact => impact !== null)

    // Calculate total pot balance
    const totalPotBalance = pots.reduce((sum, pot) => sum + pot.currentAmount, 0)

    // Assess risk
    const riskLevel = assessRisk(potImpact.projectedAmount, targetPot, totalPotBalance)

    // Can afford if projected amount >= 0
    const canAfford = potImpact.projectedAmount >= 0

    // Generate recommendation
    const recommendation = generateRecommendation(
        request,
        riskLevel,
        potImpacts,
        goalImpacts
    )

    return {
        id: `analysis-${Date.now()}`,
        request,
        canAfford,
        riskLevel,
        potImpacts,
        goalImpacts,
        recommendation,
        timestamp: new Date(),
    }
}
