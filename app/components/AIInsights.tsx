import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface AIInsightsProps {
  analysisData: any;
}

interface Insight {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
}

const PREDEFINED_QUESTIONS = [
  'Explain the network coverage quality',
  'What can be improved?',
  'Compare with typical values',
  'Suggest optimization strategies',
  'What are the peak usage hours?',
  'How does weather affect the signal?'
];

export default function AIInsights({ analysisData }: AIInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');

  const getInsight = async (question: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          data: analysisData
        }),
      });

      const data = await response.json();
      
      if (data.insights) {
        setInsights(prev => [...prev, {
          title: question,
          content: data.insights,
          type: 'info'
        }]);
      }
    } catch (error) {
      console.error('Error getting AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim()) {
      await getInsight(customQuestion);
      setCustomQuestion('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Insights</h2>
        
        {/* Insights Display */}
        <div className="space-y-4 mb-6">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded-lg"
            >
              <h3 className="font-medium text-gray-800 mb-2">{insight.title}</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <ReactMarkdown>{insight.content}</ReactMarkdown>
              </div>
              
              {/* Show available options after each response */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Ask another question:</p>
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_QUESTIONS.filter(q => q !== insight.title).map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => getInsight(question)}
                      disabled={loading}
                      className="p-2 text-left text-sm bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <span className="text-indigo-600 font-medium">{question}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Initial Predefined Questions (shown only if no insights yet) */}
        {insights.length === 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {PREDEFINED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => getInsight(question)}
                disabled={loading}
                className="p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <span className="text-indigo-600 font-medium">{question}</span>
              </button>
            ))}
          </div>
        )}

        {/* Custom Question Form */}
        <form onSubmit={handleCustomQuestion} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ask a custom question about the network data..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !customQuestion.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              Ask
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
            <span className="ml-2 text-gray-600">Analyzing...</span>
          </div>
        )}
      </div>
    </div>
  );
} 