import React from 'react';
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
      <div className="px-4 py-3">
        {/* Simple mobile-first layout */}
        <div className="flex items-center justify-center">
          {/* Center: Navigation Tabs Only */}
          <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            {tabs.map(tab => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`
                  relative px-6 py-2 text-sm font-medium rounded-md transition-all duration-150
                  ${activeTab === tab.id ? 'text-white bg-blue-600' : 'text-slate-400'}
                `} aria-label={tab.label}>
                {tab.label}
              </button>)}
          </div>
        </div>
      </div>
    </header>;
};