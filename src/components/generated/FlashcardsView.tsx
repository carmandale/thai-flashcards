import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, Check, SkipForward, Settings } from 'lucide-react';
import { speakThai as speakThaiUtil } from '@/lib/tts';
import { ensureAudioUnlocked } from '@/lib/audioUnlock';
import { useWordProgression } from '@/hooks/useWordProgression';
interface FlashcardsViewProps {
  onWordMastered: (word: string) => void;
  masteredWords: Set<string>;
}
export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  onWordMastered,
  masteredWords
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    currentWord,
    currentIndex,
    totalWords,
    nextWord,
    markCurrentWordSeen,
    settings,
    updateSettings,
    getProgressStats,
  } = useWordProgression(masteredWords);

  const currentCard = currentWord;
  const isCurrentMastered = currentCard ? masteredWords.has(currentCard.id) : false;
  const progressStats = getProgressStats();

  // Reset reveal state when card changes
  useEffect(() => {
    setIsRevealed(false);
  }, [currentCard?.id]);
  
  const speakThai = () => { 
    if (!currentCard) return;
    try { 
      ensureAudioUnlocked(); 
      speakThaiUtil(currentCard.thai, 0.9); 
    } catch {} 
  };
  const handleReveal = () => {
    if (!isRevealed) {
      setIsFlipping(true);
      setTimeout(() => {
        setIsRevealed(true);
        setIsFlipping(false);
      }, 150);
    }
  };
  const handleKnowIt = () => {
    if (!currentCard) return;
    if (!isCurrentMastered) {
      onWordMastered(currentCard.id);
    }
    markCurrentWordSeen();
    nextWord();
  };
  
  const handleNextCard = () => {
    if (currentCard) {
      markCurrentWordSeen();
    }
    nextWord();
  };
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (!isRevealed) {
          handleReveal();
        } else {
          handleKnowIt();
        }
        break;
      case 'ArrowRight':
      case 'n':
        e.preventDefault();
        handleNextCard();
        break;
      case 's':
        e.preventDefault();
        speakThai();
        break;
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRevealed, currentCard?.id, isCurrentMastered]);
  if (!currentCard) {
    return <div className="max-w-2xl mx-auto text-center py-16">
      <h2 className="text-2xl font-bold mb-4">No words available</h2>
      <p className="text-slate-400">Please check your vocabulary settings.</p>
    </div>;
  }

  return <div className="max-w-2xl mx-auto">
      {/* Progress indicator with fun elements */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              Word {currentIndex + 1} of {totalWords}
            </span>
            {progressStats.seenWords > 0 && progressStats.seenWords % 10 === 0 && (
              <span className="text-xl animate-bounce">🎉</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-green-400 flex items-center gap-1">
              <span>✅</span> {progressStats.masteredWords} mastered
            </span>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
          <span>{progressStats.seenWords} seen</span>
          <span>•</span>
          <span className="text-slate-300">{progressStats.unseenWords} remaining</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{
          width: `${progressStats.progressPercentage}%`
        }} />
          {progressStats.progressPercentage > 0 && (
            <div className="absolute top-0 left-0 h-full w-full bg-white/10 animate-pulse" />
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
        >
          <h3 className="text-lg font-semibold mb-3">Vocabulary Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty Level</label>
              <select
                value={settings.difficulty}
                onChange={(e) => updateSettings({ difficulty: e.target.value as any })}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shuffle"
                checked={settings.shuffleWords}
                onChange={(e) => updateSettings({ shuffleWords: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="shuffle" className="text-sm">Shuffle words</label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Flashcard */}
      <div className="relative mb-8 no-select">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${currentCard.id}-${isRevealed}`} initial={{
          rotateY: isFlipping ? -90 : 0,
          opacity: isFlipping ? 0 : 1
        }} animate={{
          rotateY: 0,
          opacity: 1
        }} exit={{
          rotateY: isFlipping ? 90 : 0,
          opacity: isFlipping ? 0 : 1
        }} transition={{
          duration: 0.15
        }} className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 md:p-12 border border-slate-600/50 shadow-2xl min-h-[300px] flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-blue-500/10 transition-shadow duration-300" onClick={handleReveal} role="button" tabIndex={0} aria-label={isRevealed ? 'Flashcard revealed' : 'Click to reveal translation'} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleReveal();
          }
        }}>
            {isCurrentMastered && <div className="absolute top-4 right-4">
                <div className="bg-green-600 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>}

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 no-select" aria-label="Thai word">
                {currentCard.thai}
              </h2>
              
              <p className="text-lg md:text-xl text-slate-300 font-medium no-select" aria-label="Transliteration">
                {currentCard.transliteration}
              </p>

              <AnimatePresence initial={false}>
                {isRevealed ? <motion.div key="eng" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.1
              }}>
                    <p className="text-2xl md:text-3xl font-semibold text-blue-300 mt-6">
                      {currentCard.english}
                    </p>
                  </motion.div> : <motion.p key="hint" initial={{opacity:0}} animate={{opacity:1}} className="text-slate-500 text-sm mt-4">Click to reveal translation</motion.p>}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={speakThai} 
          disabled={isPlaying}
          className={`flex items-center justify-center gap-2 px-6 py-3 ${
            isPlaying 
              ? 'bg-purple-500 animate-pulse' 
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px] disabled:cursor-not-allowed`}
          aria-label={isPlaying ? "Playing audio..." : "Hear Thai pronunciation (Press S)"}
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span>{isPlaying ? 'Playing...' : 'Hear Thai'}</span>
          {!isPlaying && <span className="text-xs opacity-75 hidden sm:inline">(S)</span>}
        </button>

        {!isRevealed ? <button onClick={handleReveal} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Reveal translation (Press Space or Enter)">
            <Eye className="w-5 h-5" />
            <span>Reveal</span>
            <span className="text-xs opacity-75 hidden sm:inline">(Space)</span>
          </button> : <button onClick={handleKnowIt} className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Mark as known (Press Space or Enter)">
            <Check className="w-5 h-5" />
            <span>Know it ✓</span>
            <span className="text-xs opacity-75 hidden sm:inline">(Space)</span>
          </button>}

        <button onClick={handleNextCard} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Skip to next word (Press N or Right Arrow)">
          <SkipForward className="w-5 h-5" />
          <span>Next</span>
          <span className="text-xs opacity-75 hidden sm:inline">(N)</span>
        </button>
      </div>
    </div>;
};
