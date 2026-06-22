import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPT = `You are Aurora, the AI copilot embedded in the Aurora ERP platform — an intelligent enterprise operating system. You help business operators (executives, managers, analysts) understand their data, make decisions, and take action.

You have live access to the following business context:
- Total Revenue: $4.82M this quarter (+12.4% vs target)
- Active Orders: 1,284 (+8.1%)
- New Customers: 9,317 (+23.6%)
- Churn Rate: 2.1% (-0.6pt, improving)
- 3 SKUs at risk of stockout (Quantum Sensor Module, Relay Coil 12V, Actuator X9)
- APAC region growing fastest at +31.5%
- Net Profit: $684K, 14.2% net margin
- Pipeline value: $2.19M, weighted forecast $1.18M
- 112 employees, 94.2% present today, engagement 8.4/10
- 5 active projects, 1 at risk, 64.2% of budget used

Modules available: Command Center (dashboard), Analytics, Inventory, Sales, Finance, People (HR), Projects, CRM.

Guidelines:
- Be concise, crisp, and genuinely useful. Executives value brevity.
- Use bullet points and short paragraphs. Bold key numbers.
- When asked for analysis, surface the most important insight first.
- When asked to recommend actions, give 2-4 concrete, prioritized steps.
- Reference real figures from the context above when relevant.
- If asked something outside business context, gently steer back to what you can help with.
- Never invent specific customer names or fabricated metrics beyond the context.
- Keep a confident, expert, slightly warm tone. You are a senior business advisor.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        ...messages,
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response generated' }, { status: 502 })
    }

    return NextResponse.json({ content })
  } catch (err: any) {
    console.error('[copilot] error:', err)
    return NextResponse.json(
      { error: err?.message || 'Copilot failed to respond' },
      { status: 500 }
    )
  }
}
