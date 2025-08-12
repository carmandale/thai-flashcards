import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, SkipForward } from 'lucide-react';
import { useWordProgression } from '@/hooks/useWordProgression';
import { vocabulary, VocabularyWord } from '@/data/vocabulary';

interface QuizViewProps {
  onCorrectAnswer: () => void;
  masteredWords: Set<string>;
}

interface QuizQuestion {
  id: string;
  thai: string;
  transliteration: string;
  correct: string;
  options: string[];
}

// Generate wrong answers from vocabulary
function generateWrongAnswers(correctWord: VocabularyWord, allWords: VocabularyWord[], count: number = 3): string[] {
  const wrongAnswers = allWords
    .filter(word => word.id !== correctWord.id && word.english !== correctWord.english)
    .map(word => word.english);
  
  // Shuffle and take the required count
  const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Convert vocabulary word to quiz question
function createQuizQuestion(word: VocabularyWord, allWords: VocabularyWord[]): QuizQuestion {
  const wrongAnswers = generateWrongAnswers(word, allWords);
  const allOptions = [word.english, ...wrongAnswers];
  
  // Shuffle options
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
  
  return {
    id: word.id,
    thai: word.thai,
    transliteration: word.transliteration,
    correct: word.english,
    options: shuffledOptions,
  };
}
export const QuizView: React.FC<QuizViewProps> = ({
  onCorrectAnswer,
  masteredWords
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  
  const {
    currentWord,
    availableWords,
    nextWord,
    markCurrentWordSeen,
  } = useWordProgression(masteredWords);

  // Generate current quiz question
  const currentQuestion = useMemo(() => {
    if (!currentWord || availableWords.length < 4) return null;
    return createQuizQuestion(currentWord, availableWords);
  }, [currentWord, availableWords]);

  const isCorrect = selectedAnswer === currentQuestion?.correct;
  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentQuestion) return;
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
    if (currentWord) {
      markCurrentWordSeen();
    }
    nextWord();
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
    if (num >= 1 && num <= 4 && currentQuestion) {
      e.preventDefault();
      handleAnswerSelect(currentQuestion.options[num - 1]);
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showResult, currentQuestion?.options]);
  const accuracy = answeredQuestions > 0 ? Math.round(score / answeredQuestions * 100) : 0;
  
  if (!currentQuestion) {
    return <div className="max-w-2xl mx-auto text-center py-16">
      <h2 className="text-2xl font-bold mb-4">No quiz questions available</h2>
      <p className="text-slate-400">Need at least 4 words to generate quiz questions.</p>
    </div>;
  }

  return <div className="max-w-2xl mx-auto">
      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-sm text-slate-400">Correct</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
          <div className="text-2xl font-bold text-white">{answeredQuestions}</div>
          <div className="text-sm text-slate-400">Answered</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
          <div className="text-2xl font-bold text-white">{accuracy}%</div>
          <div className="text-sm text-slate-400">Accuracy</div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 md:p-12 border border-slate-600/50 shadow-2xl mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {currentQuestion.thai}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-medium mb-6">
            {currentQuestion.transliteration}
          </p>
          <p className="text-slate-400">What does this mean in English?</p>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          }} aria-label={`Option ${index + 1}: ${option} (Press ${index + 1})`}>
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-slate-600 text-white text-sm flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span>{option}</span>
                </span>
                
                <AnimatePresence>
                  {showResult && option === currentQuestion.correct && <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} className="text-green-300">
                      <Check className="w-5 h-5" />
                    </motion.div>}
                  {showResult && option === selectedAnswer && !isCorrect && <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} className="text-red-300">
                      <X className="w-5 h-5" />
                    </motion.div>}
                </AnimatePresence>
              </motion.button>;
        })}
        </div>

        {/* Result feedback */}
        <AnimatePresence>
          {showResult && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mt-6 text-center">
              <div className={`text-lg font-semibold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </div>
              
              <button onClick={nextQuestion} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900" aria-label="Next question (Press Enter or Space)">
                <span>Next Question</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </motion.div>}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {!showResult && <div className="text-center text-slate-400 text-sm">
          <p>Use number keys 1-4 to select an answer, or click the options above</p>
        </div>}
    </div>;
};
