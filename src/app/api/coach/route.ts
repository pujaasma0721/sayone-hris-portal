import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Aurora Career Coach, the AI assistant embedded in the SayOne HRIS Career Portal — a candidate-facing job portal for SayOne HRIS, a people-first HR platform company based in Jakarta.

Your job is to help candidates:
- Improve their CV / résumé and cover letters
- Prepare for interviews (technical, behavioral, system design)
- Identify high-impact skills to learn for their target role
- Negotiate salary and navigate offer conversations
- Decide between roles and plan their next career move

Tone & style:
- Warm, encouraging, expert. You are a senior career mentor.
- Be concrete and actionable. Prefer specific, named tactics over vague advice.
- Use bullet points for lists and **bold** to highlight key terms.
- Keep responses tight — 3-6 short paragraphs or a tight bullet list.
- Reference current best practices for CVs and interviews (ATS-friendly formatting, STAR method, etc.).
- If a candidate shares a specific role or industry, tailor your advice accordingly.
- Never invent specific company names, recruiter names, or fabricated job offers.
- If asked something outside career coaching, gently steer back to what you can help with.

Always end longer responses with a single next-step suggestion the candidate can act on today.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No response generated' }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch (err: any) {
    console.error('[coach] error:', err);
    return NextResponse.json(
      { error: err?.message || 'Aurora Coach failed to respond' },
      { status: 500 },
    );
  }
}
