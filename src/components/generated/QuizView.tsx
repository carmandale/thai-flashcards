import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, SkipForward } from 'lucide-react';
interface QuizViewProps {
  onCorrectAnswer: () => void;
  masteredWords: Set<string>;
  mpid?: string;
}
interface QuizQuestion {
  id: string;
  thai: string;
  transliteration: string;
  correct: string;
  options: string[];
  mpid?: string;
}
const quizQuestions: QuizQuestion[] = [{
  id: '1',
  thai: 'สวัสดี',
  transliteration: 'sà-wàt-dii',
  correct: 'Hello',
  options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
  mpid: "1047402f-27a2-42d0-a3d5-627538b72863"
}, {
  id: '2',
  thai: 'ขอบคุณ',
  transliteration: 'kɔ̀ɔp-kun',
  correct: 'Thank you',
  options: ['Hello', 'Thank you', 'Please', 'Excuse me'],
  mpid: "8514b5c1-e33f-42ca-86e2-fbdab9599225"
}, {
  id: '3',
  thai: 'อร่อย',
  transliteration: 'à-ròoi',
  correct: 'Delicious',
  options: ['Beautiful', 'Delicious', 'Expensive', 'Hot'],
  mpid: "9ca7c98c-ddda-41fc-a8a4-2a0d98f22100"
}, {
  id: '4',
  thai: 'น้ำ',
  transliteration: 'náam',
  correct: 'Water',
  options: ['Water', 'Food', 'Tea', 'Coffee'],
  mpid: "4f35e290-429f-4ac5-9d58-2a17c14035de"
}, {
  id: '5',
  thai: 'บ้าน',
  transliteration: 'bâan',
  correct: 'House',
  options: ['Car', 'House', 'School', 'Shop'],
  mpid: "9ed9281a-06c7-452b-8e94-a40164082f52"
}];
export const QuizView: React.FC<QuizViewProps> = ({
  onCorrectAnswer,
  masteredWords
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const currentQuestion = quizQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct;
  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    setAnsweredQuestions(prev => prev + 1);
    if (answer === currentQuestion.correct) {
      setScore(prev => prev + 1);
      onCorrectAnswer();
    }
  };
  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex(prev => (prev + 1) % quizQuestions.length);
  };
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (showResult) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextQuestion();
      }
      return;
    }

    // Number keys for selecting answers
    const num = parseInt(e.key);
    if (num >= 1 && num <= 4) {
      e.preventDefault();
      handleAnswerSelect(currentQuestion.options[num - 1]);
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showResult, currentQuestion.options]);
  const accuracy = answeredQuestions > 0 ? Math.round(score / answeredQuestions * 100) : 0;
  return <div className="max-w-2xl mx-auto" data-magicpath-id="0" data-magicpath-path="QuizView.tsx">
      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4" data-magicpath-id="1" data-magicpath-path="QuizView.tsx">
        <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50" data-magicpath-id="2" data-magicpath-path="QuizView.tsx">
          <div className="text-2xl font-bold text-white" data-magicpath-id="3" data-magicpath-path="QuizView.tsx">{score}</div>
          <div className="text-sm text-slate-400" data-magicpath-id="4" data-magicpath-path="QuizView.tsx">Correct</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50" data-magicpath-id="5" data-magicpath-path="QuizView.tsx">
          <div className="text-2xl font-bold text-white" data-magicpath-id="6" data-magicpath-path="QuizView.tsx">{answeredQuestions}</div>
          <div className="text-sm text-slate-400" data-magicpath-id="7" data-magicpath-path="QuizView.tsx">Answered</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50" data-magicpath-id="8" data-magicpath-path="QuizView.tsx">
          <div className="text-2xl font-bold text-white" data-magicpath-id="9" data-magicpath-path="QuizView.tsx">{accuracy}%</div>
          <div className="text-sm text-slate-400" data-magicpath-id="10" data-magicpath-path="QuizView.tsx">Accuracy</div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 md:p-12 border border-slate-600/50 shadow-2xl mb-8" data-magicpath-id="11" data-magicpath-path="QuizView.tsx">
        <div className="text-center mb-8" data-magicpath-id="12" data-magicpath-path="QuizView.tsx">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-magicpath-id="13" data-magicpath-path="QuizView.tsx">
            {currentQuestion.thai}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-medium mb-6" data-magicpath-id="14" data-magicpath-path="QuizView.tsx">
            {currentQuestion.transliteration}
          </p>
          <p className="text-slate-400" data-magicpath-id="15" data-magicpath-path="QuizView.tsx">What does this mean in English?</p>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-magicpath-id="16" data-magicpath-path="QuizView.tsx">
          {currentQuestion.options.map((option, index) => {
          let buttonClass = `
              w-full p-4 rounded-lg font-medium transition-all duration-150 text-left
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
              min-h-[56px] flex items-center justify-between
            `;
          if (!showResult) {
            buttonClass += ` bg-slate-700 hover:bg-slate-600 text-white border border-slate-600
                focus:ring-blue-400/50 hover:border-slate-500`;
          } else if (option === currentQuestion.correct) {
            buttonClass += ` bg-green-600 text-white border border-green-500`;
          } else if (option === selectedAnswer && !isCorrect) {
            buttonClass += ` bg-red-600 text-white border border-red-500`;
          } else {
            buttonClass += ` bg-slate-700/50 text-slate-400 border border-slate-700`;
          }
          return <motion.button key={option} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={showResult} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} aria-label={`Option ${index + 1}: ${option} (Press ${index + 1})`} data-magicpath-id="17" data-magicpath-path="QuizView.tsx">
                <span className="flex items-center gap-3" data-magicpath-id="18" data-magicpath-path="QuizView.tsx">
                  <span className="w-6 h-6 rounded bg-slate-600 text-white text-sm flex items-center justify-center font-bold" data-magicpath-id="19" data-magicpath-path="QuizView.tsx">
                    {index + 1}
                  </span>
                  <span data-magicpath-id="20" data-magicpath-path="QuizView.tsx">{option}</span>
                </span>
                
                <AnimatePresence data-magicpath-id="21" data-magicpath-path="QuizView.tsx">
                  {showResult && option === currentQuestion.correct && <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} className="text-green-300" data-magicpath-id="22" data-magicpath-path="QuizView.tsx">
                      <Check className="w-5 h-5" data-magicpath-id="23" data-magicpath-path="QuizView.tsx" />
                    </motion.div>}
                  {showResult && option === selectedAnswer && !isCorrect && <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} className="text-red-300" data-magicpath-id="24" data-magicpath-path="QuizView.tsx">
                      <X className="w-5 h-5" data-magicpath-id="25" data-magicpath-path="QuizView.tsx" />
                    </motion.div>}
                </AnimatePresence>
              </motion.button>;
        })}
        </div>

        {/* Result feedback */}
        <AnimatePresence data-magicpath-id="26" data-magicpath-path="QuizView.tsx">
          {showResult && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mt-6 text-center" data-magicpath-id="27" data-magicpath-path="QuizView.tsx">
              <div className={`text-lg font-semibold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`} data-magicpath-id="28" data-magicpath-path="QuizView.tsx">
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </div>
              
              <button onClick={nextQuestion} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900" aria-label="Next question (Press Enter or Space)" data-magicpath-id="29" data-magicpath-path="QuizView.tsx">
                <span data-magicpath-id="30" data-magicpath-path="QuizView.tsx">Next Question</span>
                <SkipForward className="w-4 h-4" data-magicpath-id="31" data-magicpath-path="QuizView.tsx" />
              </button>
            </motion.div>}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {!showResult && <div className="text-center text-slate-400 text-sm" data-magicpath-id="32" data-magicpath-path="QuizView.tsx">
          <p data-magicpath-id="33" data-magicpath-path="QuizView.tsx">Use number keys 1-4 to select an answer, or click the options above</p>
        </div>}
    </div>;
};