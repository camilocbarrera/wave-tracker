'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    title: "Welcome to Wave Tracker! 👋",
    description: "Your tool for analyzing mobile network performance and coverage.",
    icon: "🎯"
  },
  {
    title: "Quick Demo",
    description: "Watch how easy it is to analyze network performance and get AI-powered insights.",
    type: "demo"
  },
  {
    title: "Choose Your Analysis",
    description: "Select between single tower analysis or area coverage analysis.",
    icon: "📊"
  },
  {
    title: "Enter Network Details",
    description: "Input tower information like MCC, MNC, Cell ID, and LAC codes.",
    icon: "📱"
  },
  {
    title: "View Results",
    description: "Get instant insights about signal strength, speed predictions, and optimization tips.",
    icon: "✨"
  }
];

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
        >
          <div className="text-center mb-6">
            {currentStepData.type === 'demo' ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100">
                <img
                  src="/assets/demo-web-tracker.gif"
                  alt="Wave Tracker Demo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <span className="text-4xl mb-4 block">{currentStepData.icon}</span>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-6 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 
