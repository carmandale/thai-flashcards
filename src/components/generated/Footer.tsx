import React from 'react';
import { Keyboard } from 'lucide-react';
interface FooterProps {
  wordsLearnedToday: number;
}
export const Footer: React.FC<FooterProps> = ({
  wordsLearnedToday
}) => {
  return <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Hotkeys hint */}
          <div className="flex items-center gap-2 text-slate-400">
            <Keyboard className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">
              Press 1, 2, 3 to switch tabs
            </span>
            <span className="text-sm sm:hidden">
              1, 2, 3 for tabs
            </span>
          </div>

          {/* Right: Words learned today */}
          <div className="text-sm text-slate-300">
            <span className="hidden sm:inline">Words learned today: </span>
            <span className="sm:hidden">Today: </span>
            <span className="font-semibold text-white">{wordsLearnedToday}</span>
          </div>
        </div>
      </div>
    </footer>;
};