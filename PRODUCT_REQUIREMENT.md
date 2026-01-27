# Product Requirement Document (Simplified)
## Product Name (Working)
### AI Financial Health Coach

1.Problem Statement

Users want to achieve long-term financial goals (e.g., buying a house or car) but struggle with:
- Translating income and expenses into actionable plans
- Staying disciplined over time
- Understanding the real impact of daily spending on long-term goals

Current budgeting apps focus on tracking, not coaching, negotiation, or adaptive planning.

2. Product Objective

Build an AI-powered Financial Health Coach that:
- Creates a personalized financial roadmap toward user goals
- Actively monitors progress
- Negotiates and nudges users toward better decisions
- Adapts plans dynamically based on real behavior

3. Target Users

- Salaried individuals with medium to long-term financial goals
- Users who already track expenses or are willing to input basic financial data
- Users open to AI guidance and behavioral nudges

4.Core Inputs (User-Provided)

4.1. Financial Profile

- Monthly salary
- Tax information
- Living expenses (fixed + variable)
- Risk appetite (low / medium / high)

4.2 Financial Goals

- Goal type (e.g., buy a house, buy a car)
- Target amount
- Desired timeline (optional)

4.3 Expense Tracking

- Manual input (like traditional expense-tracking apps)
- Optional voice input
- Optional email access (user-approved) to read card transaction emails

5. Core Outputs
5.1 Financial Roadmap

- A clear roadmap to achieve each goal
- Includes:
  - Milestones (monthly / quarterly)
  - Required savings rate
  - Expected completion date

5.2 Dynamic Updates
- Roadmap automatically updates when:
  - User completes a milestone
  - User fails or delays a milestone
- System generates alerts explaining:
  - Impact on goal timeline
  - Required adjustments

6. Salary Allocation (Pot-Based Model)

The system suggests automatic allocation of income into financial pots, such as:
- Living expenses
- Emergency fund
- Goal-based savings (e.g., “House Fund”)
- Flexible spending / self-reward

Allocation adapts dynamically based on:

- Progress toward goals
- User risk appetite
- Spending behavior

7. AI Coaching & Negotiation Layer (Key Differentiator)

7.1 Purchase Impact Analysis

User can input an intended purchase (manually or via detected expense).
Example output:
“If you buy this item, your goal ‘Buy a house’ will be delayed by 3 weeks.”

7.2 Negotiation & Trade-Offs

The AI agent (Vân / Maisie) can negotiate with the user:

Example:
“If you skip this purchase, I will automatically move X VND into your savings fund and allow you to spend 500,000 VND as a self-reward this Friday.”

This positions the AI as:
- A coach, not an enforcer
- Collaborative, not punitive

8. Reminders & Agent Actions

8.1 Reminder Channels

- Text message (via MCP integration)
- Calendar events

8.2 Trigger Conditions

- Upcoming milestone
- Missed milestone
- Risky spending behavior
- Opportunity to accelerate progress

9. Permissions & Trust
- Email reading (for card expenses) is opt-in only
- Clear transparency on:
    - What data is read
    - How it is used
- User can revoke access at any time

10. Success Metrics (Initial)
- Goal completion rate
- Milestone adherence rate
- Reduction in “unplanned” spending
- User engagement with AI suggestions
- Retention over 3–6 months

11. Non-Goals (Out of Scope for MVP)

- Investment execution (stocks, crypto trading)
- Tax filing or legal financial advice
- Credit scoring or lending decisions

12. Product Positioning Summary

This product is not a budgeting app.

It is:
- A Financial Health Coach
- A Negotiator
- A Goal Guardian
- A Behavioral Change Agent


