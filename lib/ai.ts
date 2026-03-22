import { AiInsight } from '@/lib/types';

// ==============================
// ✅ FALLBACK (SAFE)
// ==============================
function fallbackInsights(payload: {
  total_cost: number;
  services: { name: string; cost: number }[];
}): AiInsight[] {
  const sorted = [...payload.services].sort((a, b) => b.cost - a.cost);

  const topService = sorted[0];
  const secondService = sorted[1];

  return [
    {
      title: `Optimize ${topService?.name ?? 'compute'} usage`,
      reasoning:
        'This service contributes the largest share of your cloud spend. Consider rightsizing, reserved instances, or autoscaling strategies.',
      estimatedSavings: '10%–30%',
      anomaly: secondService
        ? `${secondService.name} is the second highest cost driver — check for inefficient scaling.`
        : 'Monitor cost spikes and irregular usage patterns.',
      priority: 'High',
    },
    {
      title: 'Schedule non-production resources',
      reasoning:
        'Development and testing environments often run continuously. Scheduling shutdown during idle hours reduces unnecessary cost.',
      estimatedSavings: '5%–15%',
      anomaly:
        'Flat usage patterns may indicate resources running continuously without need.',
      priority: 'Medium',
    },
    {
      title: 'Improve storage lifecycle policies',
      reasoning:
        'Unused logs, backups, and snapshots accumulate over time. Implement lifecycle rules to archive or delete stale data.',
      estimatedSavings: '5%–12%',
      anomaly:
        'High storage usage may indicate redundant backups or long retention settings.',
      priority: 'Medium',
    },
  ];
}

// ==============================
// ✅ SAFE JSON EXTRACTION
// ==============================
function extractJson(text: string): AiInsight[] | null {
  try {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1) return null;

    const jsonString = text.slice(start, end + 1);
    return JSON.parse(jsonString) as AiInsight[];
  } catch {
    return null;
  }
}

// ==============================
// ✅ OPENAI CALL
// ==============================
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

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.output_text ?? '';
}

// ==============================
// ✅ GEMINI CALL
// ==============================
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

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? '')
      .join('') ?? ''
  );
}

// ==============================
// ✅ MAIN FUNCTION
// ==============================
export async function generateAiInsights(payload: {
  total_cost: number;
  services: { name: string; cost: number }[];
}) {
  const sortedServices = [...payload.services]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const cleanPayload = {
    total_cost: payload.total_cost,
    services: sortedServices,
  };

  const prompt = `
You are a FinOps expert.

Analyze this cloud cost data and return ONLY a JSON array (no explanation).

Each object must contain:
- title
- reasoning
- estimatedSavings
- anomaly
- priority (High | Medium | Low)

Focus on:
- cost optimization
- anomaly detection
- actionable recommendations

DATA:
${JSON.stringify(cleanPayload, null, 2)}
`;

  // 🔹 Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      const text = await callOpenAi(prompt);
      const parsed = extractJson(text);
      if (parsed?.length) return parsed;
    } catch (err) {
      console.warn('OpenAI failed → fallback to Gemini', err);
    }
  }

  // 🔹 Then Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await callGemini(prompt);
      const parsed = extractJson(text);
      if (parsed?.length) return parsed;
    } catch (err) {
      console.warn('Gemini failed → fallback to rules', err);
    }
  }

  // 🔹 Final fallback
  return fallbackInsights(cleanPayload);
}