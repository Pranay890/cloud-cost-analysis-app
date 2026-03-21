import { AiInsight } from '@/lib/types';

function fallbackInsights(payload: { total_cost: number; services: { name: string; cost: number }[] }): AiInsight[] {
  const topService = payload.services[0];
  const secondService = payload.services[1];

  return [
    {
      title: `Focus on ${topService?.name ?? 'compute'} commitments`,
      reasoning:
        'Your highest-cost service dominates the monthly spend profile. Converting stable workloads to commitments or rightsized instances can immediately improve unit economics.',
      estimatedSavings: '12% to 28% of the primary service spend',
      anomaly: secondService
        ? `${secondService.name} is your second largest cost center and should be reviewed for bursty utilization.`
        : 'Review sudden cost spikes against release dates and scheduled jobs.',
      priority: 'High',
    },
    {
      title: 'Review non-production scheduling windows',
      reasoning:
        'Development and QA resources often run overnight and on weekends. Scheduling shutdowns is a low-risk optimization with fast payback.',
      estimatedSavings: '8% to 15% of total monthly spend',
      anomaly: 'Look for flat daily spend patterns, which can indicate always-on environments.',
      priority: 'Medium',
    },
    {
      title: 'Improve data retention and lifecycle management',
      reasoning:
        'Storage and analytics services accumulate stale backups, logs, and snapshots over time. Enforcing tiering and retention policies reduces silent cost drift.',
      estimatedSavings: '5% to 12% of total storage-related spend',
      anomaly: 'Storage-heavy workloads should be checked for backup duplication and long retention defaults.',
      priority: 'Medium',
    },
  ];
}

function extractJson(text: string): AiInsight[] | null {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]) as AiInsight[];
  } catch {
    return null;
  }
}

async function callOpenAi(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: prompt,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const data = (await response.json()) as { output_text?: string };
  return data.output_text ?? '';
}

async function callGemini(prompt: string) {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
}

export async function generateAiInsights(payload: {
  total_cost: number;
  services: { name: string; cost: number }[];
}) {
  const prompt = `You are a FinOps expert. Given cloud billing summary data, return a JSON array of 3 objects. Each object must have keys: title, reasoning, estimatedSavings, anomaly, priority. Priorities must be High, Medium, or Low. Focus on cost optimization, anomaly detection, and concrete actions. Data: ${JSON.stringify(
    payload
  )}`;

  if (process.env.OPENAI_API_KEY) {
    try {
      const text = await callOpenAi(prompt);
      const parsed = extractJson(text);
      if (parsed?.length) return parsed;
    } catch (error) {
      console.warn('OpenAI insight generation failed. Falling back.', error);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await callGemini(prompt);
      const parsed = extractJson(text);
      if (parsed?.length) return parsed;
    } catch (error) {
      console.warn('Gemini insight generation failed. Falling back.', error);
    }
  }

  return fallbackInsights(payload);
}
