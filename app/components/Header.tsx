import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="fixed top-[48px] left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Wave Tracker</h1>
          <p className="text-sm opacity-90">Mobile Network Analysis Tool</p>
        </div>
        <a
          href="https://github.com/your-github-repo-url"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          <FaGithub className="text-xl" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
} 