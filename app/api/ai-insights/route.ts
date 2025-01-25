import { NextResponse } from 'next/server';

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
    `;
  }

  return `You are an expert in mobile network analysis and optimization. Based on the following network data, ${question.toLowerCase()}

${context}

Please provide a detailed, professional analysis focusing on the specific question. Include technical insights and practical recommendations where relevant.`;
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

    // Make API call to your preferred AI model (e.g., OpenAI, Anthropic, etc.)
    // For now, let's return a mock response
    const mockInsights = `Based on the provided network data, here's my analysis:

${data.towerData ? 
  `The cell tower shows ${Number(data.towerData.signalStrength) > -85 ? 'good' : 'suboptimal'} signal strength at ${data.towerData.signalStrength}dBm. This indicates ${Number(data.towerData.signalStrength) > -85 ? 'reliable' : 'potentially unstable'} connectivity.` :
  `The area shows ${data.cells.length > 5 ? 'good' : 'limited'} coverage with ${data.cells.length} towers. The cell density of ${data.coverageMetrics.cellDensity.toFixed(2)} cells/km² suggests ${data.coverageMetrics.cellDensity > 2 ? 'robust' : 'potentially sparse'} network coverage.`}

Recommendations:
1. ${data.towerData ? 
    'Monitor signal strength variations throughout the day' : 
    'Consider tower placement optimization in areas with lower density'}
2. ${data.towerData ?
    'Ensure line of sight to the tower when possible' :
    'Evaluate the distribution of different network technologies (GSM/UMTS/LTE)'}
3. ${data.towerData ?
    'Consider external antenna if signal strength is consistently low' :
    'Plan for capacity expansion in high-traffic areas'}`;

    return NextResponse.json({ insights: mockInsights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 