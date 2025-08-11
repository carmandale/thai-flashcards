import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, Check, SkipForward } from 'lucide-react';
import { speakThai as speakThaiUtil } from '@/lib/tts';
interface FlashcardsViewProps {
  onWordMastered: (word: string) => void;
  masteredWords: Set<string>;
}
interface Flashcard {
  id: string;
  thai: string;
  transliteration: string;
  english: string;
}
const flashcards: Flashcard[] = [{
  id: '1',
  thai: 'สวัสดี',
  transliteration: 'sà-wàt-dii',
  english: 'Hello'
}, {
  id: '2',
  thai: 'ขอบคุณ',
  transliteration: 'kɔ̀ɔp-kun',
  english: 'Thank you'
}, {
  id: '3',
  thai: 'ขอโทษ',
  transliteration: 'kɔ̌ɔ-tôot',
  english: 'Sorry'
}, {
  id: '4',
  thai: 'ไม่เป็นไร',
  transliteration: 'mâi-pen-rai',
  english: 'No problem'
}, {
  id: '5',
  thai: 'อร่อย',
  transliteration: 'à-ròoi',
  english: 'Delicious'
}, {
  id: '6',
  thai: 'น้ำ',
  transliteration: 'náam',
  english: 'Water'
}, {
  id: '7',
  thai: 'ข้าว',
  transliteration: 'kâao',
  english: 'Rice'
}, {
  id: '8',
  thai: 'บ้าน',
  transliteration: 'bâan',
  english: 'House'
}, {
  id: '9',
  thai: 'รถ',
  transliteration: 'rót',
  english: 'Car'
}, {
  id: '10',
  thai: 'หนังสือ',
  transliteration: 'nǎng-sɯ̌ɯ',
  english: 'Book'
}];
export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  onWordMastered,
  masteredWords
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const currentCard = flashcards[currentIndex];
  const isCurrentMastered = masteredWords.has(currentCard.id);

  // Reset reveal state when card changes
  useEffect(() => {
    setIsRevealed(false);
  }, [currentIndex]);
  const speakThai = () => { try { speakThaiUtil(currentCard.thai, 0.9); } catch {} };
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
    if (!isCurrentMastered) {
      onWordMastered(currentCard.id);
    }
    nextCard();
  };
  const nextCard = () => {
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
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
        nextCard();
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
  }, [isRevealed, currentCard.id, isCurrentMastered]);
  return <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm text-slate-400">
            {Array.from(masteredWords).length} mastered
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{
          width: `${(currentIndex + 1) / flashcards.length * 100}%`
        }} />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-8">
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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {currentCard.thai}
              </h2>
              
              <p className="text-lg md:text-xl text-slate-300 font-medium">
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
        <button onClick={speakThai} className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Hear Thai pronunciation (Press S)">
          <Volume2 className="w-5 h-5" />
          <span>Hear Thai</span>
          <span className="text-xs opacity-75 hidden sm:inline">(S)</span>
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

        <button onClick={nextCard} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Skip to next card (Press N or Right Arrow)">
          <SkipForward className="w-5 h-5" />
          <span>Next</span>
          <span className="text-xs opacity-75 hidden sm:inline">(N)</span>
        </button>
      </div>
    </div>;
};