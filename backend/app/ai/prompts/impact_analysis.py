"""Impact analysis prompt template."""

IMPACT_ANALYSIS_PROMPT = """Analyze the financial impact of this potential purchase/action:

**Action**: {action}
**Amount**: {currency}{amount:.2f}

Based on the user's current financial state, provide a detailed impact analysis.

Consider:
1. Which pot would this expense come from?
2. How does it affect the pot's balance?
3. Does it delay any active goals?
4. Is this purchase aligned with the user's priorities?

Provide your analysis in a helpful, non-judgmental way. Include:
- Clear numbers showing before/after
- Any goal delays in days
- A balanced recommendation
"""
