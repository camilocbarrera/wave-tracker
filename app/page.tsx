import { AnalysisProvider } from './context/AnalysisContext'
import ChatSection from './components/ChatSection'
import CanvasSection from './components/CanvasSection'

export default function Home() {
  return (
    <AnalysisProvider>
      <main className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Left side - Chat */}
          <div className="w-1/3 border-r border-gray-200 bg-white">
            <ChatSection />
            </div>

          {/* Right side - Canvas */}
          <div className="w-2/3 bg-gray-50 overflow-auto">
            <CanvasSection />
            </div>
        </div>
      </main>
    </AnalysisProvider>
  );
}
