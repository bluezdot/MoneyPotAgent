"""Impact analysis service."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.goal import Goal
from app.models.pot import Pot
from app.schemas.chat import GoalImpact, ImpactAnalysis, PotImpact, TradeOff, TradeOffOption


class ImpactService:
    """Service for impact analysis operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def analyze_purchase(
        self,
        user_id: uuid.UUID,
        amount: float,
        pot_id: uuid.UUID | None = None,
        description: str = "Purchase",
    ) -> ImpactAnalysis:
        """Analyze the impact of a potential purchase on pots and goals."""
        # Get all pots for the user
        pots_result = await self.db.execute(
            select(Pot)
            .where(Pot.user_id == user_id)
            .options(selectinload(Pot.goals))
        )
        pots = list(pots_result.scalars().all())

        pot_impacts: list[PotImpact] = []
        goal_impacts: list[GoalImpact] = []

        # Analyze impact on pots
        for pot in pots:
            current_amount = float(pot.current_amount)

            # Check if this pot would be affected
            if pot_id is None or pot.id == pot_id:
                projected_amount = current_amount - amount
                change = -amount

                pot_impacts.append(
                    PotImpact(
                        pot_id=pot.id,
                        pot_name=pot.name,
                        current_amount=current_amount,
                        projected_amount=max(0, projected_amount),
                        change=change,
                    )
                )

                # Analyze impact on goals within this pot
                for goal in pot.goals:
                    if goal.status.value != "active":
                        continue

                    target = float(goal.target_amount)
                    current_goal = float(goal.current_amount)
                    current_progress = (current_goal / target * 100) if target > 0 else 0

                    # Calculate delay if applicable
                    delay_days = None
                    if goal.deadline:
                        now = datetime.now(timezone.utc)
                        remaining_days = (goal.deadline - now).days
                        if remaining_days > 0:
                            remaining_amount = target - current_goal
                            daily_rate = remaining_amount / remaining_days
                            if daily_rate > 0:
                                delay_days = int(amount / daily_rate)

                    goal_impacts.append(
                        GoalImpact(
                            goal_id=goal.id,
                            goal_title=goal.title,
                            current_progress=current_progress,
                            projected_progress=current_progress,  # No change to current
                            delay_days=delay_days,
                        )
                    )
            else:
                pot_impacts.append(
                    PotImpact(
                        pot_id=pot.id,
                        pot_name=pot.name,
                        current_amount=current_amount,
                        projected_amount=current_amount,
                        change=0,
                    )
                )

        # Generate recommendation
        recommendation = self._generate_recommendation(
            amount, pot_impacts, goal_impacts
        )

        return ImpactAnalysis(
            action=description,
            pot_impacts=pot_impacts,
            goal_impacts=goal_impacts,
            recommendation=recommendation,
        )

    def _generate_recommendation(
        self,
        amount: float,
        pot_impacts: list[PotImpact],
        goal_impacts: list[GoalImpact],
    ) -> str:
        """Generate a recommendation based on impact analysis."""
        # Check for insufficient funds
        for impact in pot_impacts:
            if impact.change < 0 and impact.projected_amount < 0:
                return (
                    f"This purchase would overdraw your {impact.pot_name} pot. "
                    "Consider reducing the amount or using a different pot."
                )

        # Check for goal delays
        delayed_goals = [g for g in goal_impacts if g.delay_days and g.delay_days > 7]
        if delayed_goals:
            goal_names = ", ".join(g.goal_title for g in delayed_goals[:2])
            return (
                f"This purchase may delay your goals ({goal_names}) by "
                f"approximately {delayed_goals[0].delay_days} days. "
                "Consider if this purchase is worth the delay."
            )

        # Check for low pot balance after purchase
        low_pots = [
            p for p in pot_impacts
            if p.change < 0 and p.projected_amount < (p.current_amount * 0.2)
        ]
        if low_pots:
            return (
                f"After this purchase, your {low_pots[0].pot_name} pot will be "
                "below 20% of its current balance. Make sure you have enough "
                "for upcoming expenses."
            )

        return "This purchase looks reasonable given your current financial state."

    async def generate_trade_offs(
        self,
        user_id: uuid.UUID,
        amount: float,
        description: str = "Purchase",
    ) -> TradeOff:
        """Generate trade-off options for a purchase."""
        # Get user's pots
        pots_result = await self.db.execute(
            select(Pot).where(Pot.user_id == user_id)
        )
        pots = list(pots_result.scalars().all())

        options: list[TradeOffOption] = []

        # Option 1: Skip the purchase
        options.append(
            TradeOffOption(
                id="skip",
                label="Skip this purchase",
                impact=f"Save ${amount:.2f} and keep your goals on track",
                recommended=False,
            )
        )

        # Option 2: Find alternatives from different pots
        for pot in pots:
            if float(pot.current_amount) >= amount:
                pot_percentage = (amount / float(pot.current_amount)) * 100
                options.append(
                    TradeOffOption(
                        id=f"use_{pot.id}",
                        label=f"Use {pot.name} pot",
                        impact=f"Uses {pot_percentage:.1f}% of {pot.name} funds",
                        recommended=pot.category.value == "wants",
                    )
                )

        # Option 3: Split across pots
        if len([p for p in pots if float(p.current_amount) > 0]) > 1:
            options.append(
                TradeOffOption(
                    id="split",
                    label="Split across pots",
                    impact="Distribute the impact across multiple pots",
                    recommended=False,
                )
            )

        # Option 4: Delay the purchase
        options.append(
            TradeOffOption(
                id="delay",
                label="Delay by 2 weeks",
                impact="Wait until next income to afford this comfortably",
                recommended=True,
            )
        )

        return TradeOff(
            id=f"trade_off_{uuid.uuid4().hex[:8]}",
            title=f"Options for {description}",
            description=f"Here are some alternatives for your ${amount:.2f} {description}",
            options=options[:4],  # Limit to 4 options
        )
