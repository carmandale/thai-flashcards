import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, Check, SkipForward } from 'lucide-react';
interface FlashcardsViewProps {
  onWordMastered: (word: string) => void;
  masteredWords: Set<string>;
  mpid?: string;
}
interface Flashcard {
  id: string;
  thai: string;
  transliteration: string;
  english: string;
  mpid?: string;
}
const flashcards: Flashcard[] = [{
  id: '1',
  thai: 'สวัสดี',
  transliteration: 'sà-wàt-dii',
  english: 'Hello',
  mpid: "cb470f00-01d3-445a-a76e-88c12302977e"
}, {
  id: '2',
  thai: 'ขอบคุณ',
  transliteration: 'kɔ̀ɔp-kun',
  english: 'Thank you',
  mpid: "43c7af31-69f3-442e-b973-350b74054649"
}, {
  id: '3',
  thai: 'ขอโทษ',
  transliteration: 'kɔ̌ɔ-tôot',
  english: 'Sorry',
  mpid: "e99f30fe-0368-419c-b2c6-d90c74a3b941"
}, {
  id: '4',
  thai: 'ไม่เป็นไร',
  transliteration: 'mâi-pen-rai',
  english: 'No problem',
  mpid: "a03a3cf0-2ce5-4ceb-91be-ba0b3f42f7ab"
}, {
  id: '5',
  thai: 'อร่อย',
  transliteration: 'à-ròoi',
  english: 'Delicious',
  mpid: "ba49c9ce-8f13-4c19-9308-51127641834c"
}, {
  id: '6',
  thai: 'น้ำ',
  transliteration: 'náam',
  english: 'Water',
  mpid: "455642f0-ad98-4b23-969a-4089bf6774e4"
}, {
  id: '7',
  thai: 'ข้าว',
  transliteration: 'kâao',
  english: 'Rice',
  mpid: "ba9ca85c-b3de-47be-bbe8-340e19b0c7c6"
}, {
  id: '8',
  thai: 'บ้าน',
  transliteration: 'bâan',
  english: 'House',
  mpid: "3df0f7f0-bc47-4779-b76f-cbfabecad355"
}, {
  id: '9',
  thai: 'รถ',
  transliteration: 'rót',
  english: 'Car',
  mpid: "c6573f4d-3bb1-4bad-a1a5-8daaa8b19bcf"
}, {
  id: '10',
  thai: 'หนังสือ',
  transliteration: 'nǎng-sɯ̌ɯ',
  english: 'Book',
  mpid: "fc2e4497-ad83-416b-bf9f-210b2f9ebd2c"
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
  const speakThai = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentCard.thai);
      utterance.lang = 'th-TH';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
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
  return <div className="max-w-2xl mx-auto" data-magicpath-id="0" data-magicpath-path="FlashcardsView.tsx">
      {/* Progress indicator */}
      <div className="mb-8" data-magicpath-id="1" data-magicpath-path="FlashcardsView.tsx">
        <div className="flex justify-between items-center mb-2" data-magicpath-id="2" data-magicpath-path="FlashcardsView.tsx">
          <span className="text-sm text-slate-400" data-magicpath-id="3" data-magicpath-path="FlashcardsView.tsx">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm text-slate-400" data-magicpath-id="4" data-magicpath-path="FlashcardsView.tsx">
            {Array.from(masteredWords).length} mastered
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2" data-magicpath-id="5" data-magicpath-path="FlashcardsView.tsx">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{
          width: `${(currentIndex + 1) / flashcards.length * 100}%`
        }} data-magicpath-id="6" data-magicpath-path="FlashcardsView.tsx" />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-8" data-magicpath-id="7" data-magicpath-path="FlashcardsView.tsx">
        <AnimatePresence mode="wait" data-magicpath-id="8" data-magicpath-path="FlashcardsView.tsx">
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
        }} data-magicpath-id="9" data-magicpath-path="FlashcardsView.tsx">
            {isCurrentMastered && <div className="absolute top-4 right-4" data-magicpath-id="10" data-magicpath-path="FlashcardsView.tsx">
                <div className="bg-green-600 text-white rounded-full p-1" data-magicpath-id="11" data-magicpath-path="FlashcardsView.tsx">
                  <Check className="w-4 h-4" data-magicpath-id="12" data-magicpath-path="FlashcardsView.tsx" />
                </div>
              </div>}

            <div className="space-y-4" data-magicpath-id="13" data-magicpath-path="FlashcardsView.tsx">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2" data-magicpath-id="14" data-magicpath-path="FlashcardsView.tsx">
                {currentCard.thai}
              </h2>
              
              <p className="text-lg md:text-xl text-slate-300 font-medium" data-magicpath-id="15" data-magicpath-path="FlashcardsView.tsx">
                {currentCard.transliteration}
              </p>

              <AnimatePresence data-magicpath-id="16" data-magicpath-path="FlashcardsView.tsx">
                {isRevealed && <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.1
              }} data-magicpath-id="17" data-magicpath-path="FlashcardsView.tsx">
                    <p className="text-2xl md:text-3xl font-semibold text-blue-300 mt-6" data-magicpath-id="18" data-magicpath-path="FlashcardsView.tsx">
                      {currentCard.english}
                    </p>
                  </motion.div>}
              </AnimatePresence>

              {!isRevealed && <p className="text-slate-500 text-sm mt-4" data-magicpath-id="19" data-magicpath-path="FlashcardsView.tsx">
                  Click to reveal translation
                </p>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center" data-magicpath-id="20" data-magicpath-path="FlashcardsView.tsx">
        <button onClick={speakThai} className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Hear Thai pronunciation (Press S)" data-magicpath-id="21" data-magicpath-path="FlashcardsView.tsx">
          <Volume2 className="w-5 h-5" data-magicpath-id="22" data-magicpath-path="FlashcardsView.tsx" />
          <span data-magicpath-id="23" data-magicpath-path="FlashcardsView.tsx">Hear Thai</span>
          <span className="text-xs opacity-75 hidden sm:inline" data-magicpath-id="24" data-magicpath-path="FlashcardsView.tsx">(S)</span>
        </button>

        {!isRevealed ? <button onClick={handleReveal} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Reveal translation (Press Space or Enter)" data-magicpath-id="25" data-magicpath-path="FlashcardsView.tsx">
            <Eye className="w-5 h-5" data-magicpath-id="26" data-magicpath-path="FlashcardsView.tsx" />
            <span data-magicpath-id="27" data-magicpath-path="FlashcardsView.tsx">Reveal</span>
            <span className="text-xs opacity-75 hidden sm:inline" data-magicpath-id="28" data-magicpath-path="FlashcardsView.tsx">(Space)</span>
          </button> : <button onClick={handleKnowIt} className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Mark as known (Press Space or Enter)" data-magicpath-id="29" data-magicpath-path="FlashcardsView.tsx">
            <Check className="w-5 h-5" data-magicpath-id="30" data-magicpath-path="FlashcardsView.tsx" />
            <span data-magicpath-id="31" data-magicpath-path="FlashcardsView.tsx">Know it ✓</span>
            <span className="text-xs opacity-75 hidden sm:inline" data-magicpath-id="32" data-magicpath-path="FlashcardsView.tsx">(Space)</span>
          </button>}

        <button onClick={nextCard} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]" aria-label="Skip to next card (Press N or Right Arrow)" data-magicpath-id="33" data-magicpath-path="FlashcardsView.tsx">
          <SkipForward className="w-5 h-5" data-magicpath-id="34" data-magicpath-path="FlashcardsView.tsx" />
          <span data-magicpath-id="35" data-magicpath-path="FlashcardsView.tsx">Next</span>
          <span className="text-xs opacity-75 hidden sm:inline" data-magicpath-id="36" data-magicpath-path="FlashcardsView.tsx">(N)</span>
        </button>
      </div>
    </div>;
};