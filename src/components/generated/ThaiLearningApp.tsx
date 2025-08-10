import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { FlashcardsView } from './FlashcardsView';
import { QuizView } from './QuizView';
import { Footer } from './Footer';
export type Tab = 'flashcards' | 'quiz' | 'game';
export interface UserProgress {
  xp: number;
  streak: number;
  dailyGoal: number;
  wordsLearnedToday: number;
  lastActiveDate: string;
  history: Array<{
    date: string;
    xp: number;
    wordsLearned: number;
  }>;
  masteredWords: Set<string>;
}
const STORAGE_KEY = 'thai-learning-progress';
const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  dailyGoal: 50,
  wordsLearnedToday: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  history: [],
  masteredWords: new Set()
};
export const ThaiLearningApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('flashcards');
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress({
          ...parsed,
          masteredWords: new Set(parsed.masteredWords || [])
        });
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const toSave = {
      ...progress,
      masteredWords: Array.from(progress.masteredWords)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [progress]);

  // Check for new day and update streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      setProgress(prev => ({
        ...prev,
        lastActiveDate: today,
        wordsLearnedToday: 0,
        streak: prev.lastActiveDate === yesterdayStr ? prev.streak : 0
      }));
    }
  }, [progress.lastActiveDate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      switch (e.key) {
        case '1':
          setActiveTab('flashcards');
          break;
        case '2':
          setActiveTab('quiz');
          break;
        case '3':
          setActiveTab('game');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  const addXP = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newWordsToday = prev.wordsLearnedToday + 1;

      // Update history
      const existingHistoryIndex = prev.history.findIndex(h => h.date === today);
      const newHistory = [...prev.history];
      if (existingHistoryIndex >= 0) {
        newHistory[existingHistoryIndex] = {
          date: today,
          xp: newHistory[existingHistoryIndex].xp + amount,
          wordsLearned: newWordsToday
        };
      } else {
        newHistory.push({
          date: today,
          xp: amount,
          wordsLearned: newWordsToday
        });
      }

      // Update streak if daily goal is met
      const newStreak = newXP >= prev.dailyGoal && prev.streak === 0 ? 1 : prev.streak;
      return {
        ...prev,
        xp: newXP,
        wordsLearnedToday: newWordsToday,
        streak: newStreak,
        history: newHistory.slice(-14) // Keep last 14 days
      };
    });
  };
  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setProgress(defaultProgress);
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  const markWordMastered = (word: string) => {
    setProgress(prev => ({
      ...prev,
      masteredWords: new Set([...prev.masteredWords, word])
    }));
    addXP(10);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Subtle background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-indigo-400/25 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header activeTab={activeTab} onTabChange={setActiveTab} progress={progress} onReset={resetProgress} />

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.15
            }}>
                {activeTab === 'flashcards' && <FlashcardsView onWordMastered={markWordMastered} masteredWords={progress.masteredWords} />}
                {activeTab === 'quiz' && <QuizView onCorrectAnswer={() => addXP(5)} masteredWords={progress.masteredWords} />}
                {activeTab === 'game' && <div className="text-center py-16">
                    <h2 className="text-2xl font-bold mb-4">Mouse & Cheese</h2>
                    <p className="text-slate-400 mb-8">Mini-game coming soon!</p>
                    <div className="w-64 h-40 mx-auto bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-center">
                      <span className="text-slate-500">Game UI Shell</span>
                    </div>
                  </div>}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <Footer wordsLearnedToday={progress.wordsLearnedToday} />
      </div>
    </div>;
};