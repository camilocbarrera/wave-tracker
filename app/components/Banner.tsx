import React from 'react';
import Image from 'next/image';

export default function Banner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-100 p-3">
      <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap">
        <Image 
          src="/lablab_ai_logo.png" 
          alt="LabLab.ai Logo" 
          width={120} 
          height={40}
          className="h-8 w-auto object-contain"
          priority
        />
        <div className="text-center text-sm text-yellow-800">
          Built by <span className="font-semibold">AI Ninjas</span> for the{' '}
          <a 
            href="https://lablab.ai/event/ai-for-connectivity-hackathon/ai-ninjas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            LabLab AI for Connectivity Hackathon
          </a> 🚀
        </div>
      </div>
    </div>
  );
} 