"""Trade-off analysis prompt template."""

TRADE_OFF_PROMPT = """The user is considering this purchase and wants to understand their options:

**Purchase**: {description}
**Amount**: {currency}{amount:.2f}

Generate creative but practical trade-off options. Consider:
1. Delaying the purchase
2. Finding a cheaper alternative
3. Splitting the cost over time
4. Using a different pot
5. Offsetting with reduced spending elsewhere

For each option, explain:
- What the user would do
- The financial impact
- Pros and cons

Be creative but realistic. Focus on options that work with the user's current situation.
"""
