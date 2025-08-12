import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Target, Flame, Calendar } from 'lucide-react';
import type { Tab, UserProgress } from './ThaiLearningApp';
interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  progress: UserProgress;
  onReset: () => void;
}
const tabs = [{
  id: 'flashcards' as Tab,
  label: 'Flashcards',
  hotkey: '1'
}, {
  id: 'quiz' as Tab,
  label: 'Quiz',
  hotkey: '2'
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
  return <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 pt-safe">
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Branding */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Thai Learning</h1>
            <p className="text-sm text-slate-400 hidden sm:block">Master Thai vocabulary</p>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
              {tabs.map(tab => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`
                    relative flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900
                    ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}
                  `} aria-label={`${tab.label} (Press ${tab.hotkey})`}>
                  {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-blue-600 rounded-md" transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.4
              }} />}
                  <span className="relative z-10 truncate">
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </span>
                </button>)}
            </div>
          </nav>

          {/* Right: Stats and Reset */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Goal Progress */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
              <Target className="w-3 h-3 text-green-400" />
              <span className="text-xs font-medium text-white">
                {progress.xp}/{progress.dailyGoal}
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-medium text-white">{progress.streak}</span>
            </div>

            {/* Date */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-medium text-white">{today}</span>
            </div>

            {/* Reset Button */}
            <button onClick={onReset} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-slate-900" aria-label="Reset all progress" title="Reset all progress">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>;
};