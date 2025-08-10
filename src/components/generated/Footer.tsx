import React from 'react';
import { Keyboard } from 'lucide-react';
interface FooterProps {
  wordsLearnedToday: number;
  mpid?: string;
}
export const Footer: React.FC<FooterProps> = ({
  wordsLearnedToday
}) => {
  return <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm" data-magicpath-id="0" data-magicpath-path="Footer.tsx">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8" data-magicpath-id="1" data-magicpath-path="Footer.tsx">
        <div className="flex items-center justify-between" data-magicpath-id="2" data-magicpath-path="Footer.tsx">
          {/* Left: Hotkeys hint */}
          <div className="flex items-center gap-2 text-slate-400" data-magicpath-id="3" data-magicpath-path="Footer.tsx">
            <Keyboard className="w-4 h-4" data-magicpath-id="4" data-magicpath-path="Footer.tsx" />
            <span className="text-sm hidden sm:inline" data-magicpath-id="5" data-magicpath-path="Footer.tsx">
              Press 1, 2, 3 to switch tabs
            </span>
            <span className="text-sm sm:hidden" data-magicpath-id="6" data-magicpath-path="Footer.tsx">
              1, 2, 3 for tabs
            </span>
          </div>

          {/* Right: Words learned today */}
          <div className="text-sm text-slate-300" data-magicpath-id="7" data-magicpath-path="Footer.tsx">
            <span className="hidden sm:inline" data-magicpath-id="8" data-magicpath-path="Footer.tsx">Words learned today: </span>
            <span className="sm:hidden" data-magicpath-id="9" data-magicpath-path="Footer.tsx">Today: </span>
            <span className="font-semibold text-white" data-magicpath-id="10" data-magicpath-path="Footer.tsx">{wordsLearnedToday}</span>
          </div>
        </div>
      </div>
    </footer>;
};