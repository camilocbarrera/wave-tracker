import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY
});

function generatePrompt(question: string, data: any): string {
  let context = '';

  if (data.towerData) {
    // Single tower analysis
    context = `
Analysis of a single cell tower:
- Signal Strength: ${data.towerData.signalStrength}dBm
- Range: ${data.towerData.range}m
- Estimated Speed: ${data.speedPrediction}Mbps
- Location: ${data.towerData.latitude}, ${data.towerData.longitude}

Signal Quality Assessment:
- Good signal: > -85 dBm
- Fair signal: -95 to -85 dBm
- Poor signal: < -95 dBm
    `;
  } else if (data.cells) {
    // Area analysis
    const avgSignalStrength = data.cells.reduce((sum: number, cell: any) => 
      sum + (Number(cell.signalStrength) || -95), 0) / data.cells.length;

    context = `
Analysis of an area with ${data.cells.length} cell towers:
- Average Signal Strength: ${avgSignalStrength.toFixed(2)}dBm
- Cell Density: ${data.coverageMetrics.cellDensity.toFixed(2)} cells/km²
- Area Size: ${data.coverageMetrics.areaSizeKm.toFixed(2)}km²
- Average Tower Range: ${data.coverageMetrics.averageRangeKm.toFixed(2)}km

Network Types Distribution:
${Object.entries(data.networkTypes)
  .map(([type, count]) => `- ${type}: ${count} towers`)
  .join('\n')}

Coverage Assessment Guidelines:
- Good density: > 2 cells/km²
- Fair density: 1-2 cells/km²
- Poor density: < 1 cell/km²

Technology Capabilities:
- 5G (NR): Highest speed and lowest latency
- LTE: High speed, good latency
- UMTS: Moderate speed
- GSM: Basic coverage
- CDMA: Legacy technology
    `;
  }

  return `You are an expert in mobile network analysis and optimization. Based on the following network data, ${question.toLowerCase()}

${context}

Please provide a detailed, professional analysis focusing on the specific question. Include technical insights and practical recommendations where relevant. Keep your response concise but informative, using bullet points where appropriate.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, data } = body;

    if (!question || !data) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const prompt = generatePrompt(question, data);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a mobile network expert specializing in signal analysis, coverage optimization, and network performance. Format your response in Markdown with appropriate headers, bullet points, and emphasis where needed."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const insights = completion.choices[0]?.message?.content || '**No insights available**';

    // Ensure the insights are treated as Markdown
    return NextResponse.json({ 
      insights,
      format: 'markdown'
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 