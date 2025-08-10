import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Target, Flame, Calendar } from 'lucide-react';
import type { Tab, UserProgress } from './ThaiLearningApp';
interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  progress: UserProgress;
  onReset: () => void;
  mpid?: string;
}
const tabs = [{
  id: 'flashcards' as Tab,
  label: 'Flashcards',
  hotkey: '1',
  mpid: "9573895c-23e3-4ab5-9a43-1a22fda2a74c"
}, {
  id: 'quiz' as Tab,
  label: 'Quiz',
  hotkey: '2',
  mpid: "a6c8b5a6-d227-48d2-bef5-a5fe1d9a45d1"
}, {
  id: 'game' as Tab,
  label: 'Mouse & Cheese',
  hotkey: '3',
  mpid: "94b6af57-be75-45f4-bf9f-2bfd4d660928"
}] as any[];
export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  progress,
  onReset
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  return <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50" data-magicpath-id="0" data-magicpath-path="Header.tsx">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8" data-magicpath-id="1" data-magicpath-path="Header.tsx">
        <div className="flex items-center justify-between" data-magicpath-id="2" data-magicpath-path="Header.tsx">
          {/* Left: Branding */}
          <div className="flex-shrink-0" data-magicpath-id="3" data-magicpath-path="Header.tsx">
            <h1 className="text-xl font-bold text-white" data-magicpath-id="4" data-magicpath-path="Header.tsx">Thai Learning</h1>
            <p className="text-sm text-slate-400 hidden sm:block" data-magicpath-id="5" data-magicpath-path="Header.tsx">Master Thai vocabulary</p>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="flex-1 max-w-md mx-4 md:mx-8" data-magicpath-id="6" data-magicpath-path="Header.tsx">
            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50" data-magicpath-id="7" data-magicpath-path="Header.tsx">
              {tabs.map(tab => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`
                    relative flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900
                    ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}
                  `} aria-label={`${tab.label} (Press ${tab.hotkey})`} data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-id="8" data-magicpath-path="Header.tsx">
                  {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-blue-600 rounded-md" transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.4
              }} data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-id="9" data-magicpath-path="Header.tsx" />}
                  <span className="relative z-10 truncate" data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-id="10" data-magicpath-path="Header.tsx">
                    <span className="hidden sm:inline" data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="11" data-magicpath-path="Header.tsx">{tab.label}</span>
                    <span className="sm:hidden" data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-id="12" data-magicpath-path="Header.tsx">{tab.label.split(' ')[0]}</span>
                  </span>
                </button>)}
            </div>
          </nav>

          {/* Right: Stats and Reset */}
          <div className="flex items-center gap-2 md:gap-3" data-magicpath-id="13" data-magicpath-path="Header.tsx">
            {/* Goal Progress */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50" data-magicpath-id="14" data-magicpath-path="Header.tsx">
              <Target className="w-3 h-3 text-green-400" data-magicpath-id="15" data-magicpath-path="Header.tsx" />
              <span className="text-xs font-medium text-white" data-magicpath-id="16" data-magicpath-path="Header.tsx">
                {progress.xp}/{progress.dailyGoal}
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50" data-magicpath-id="17" data-magicpath-path="Header.tsx">
              <Flame className="w-3 h-3 text-orange-400" data-magicpath-id="18" data-magicpath-path="Header.tsx" />
              <span className="text-xs font-medium text-white" data-magicpath-id="19" data-magicpath-path="Header.tsx">{progress.streak}</span>
            </div>

            {/* Date */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50" data-magicpath-id="20" data-magicpath-path="Header.tsx">
              <Calendar className="w-3 h-3 text-blue-400" data-magicpath-id="21" data-magicpath-path="Header.tsx" />
              <span className="text-xs font-medium text-white" data-magicpath-id="22" data-magicpath-path="Header.tsx">{today}</span>
            </div>

            {/* Reset Button */}
            <button onClick={onReset} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-slate-900" aria-label="Reset all progress" title="Reset all progress" data-magicpath-id="23" data-magicpath-path="Header.tsx">
              <RotateCcw className="w-4 h-4" data-magicpath-id="24" data-magicpath-path="Header.tsx" />
            </button>
          </div>
        </div>
      </div>
    </header>;
};