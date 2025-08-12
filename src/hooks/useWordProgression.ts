import { useState, useEffect, useCallback } from 'react';
import { vocabulary, VocabularyWord } from '@/data/vocabulary';

export interface WordProgressionState {
  currentWord: VocabularyWord | null;
  currentIndex: number;
  totalWords: number;
  seenWords: Set<string>;
  masteredWords: Set<string>;
  availableWords: VocabularyWord[];
  completedCycle: boolean;
}

export interface WordProgressionSettings {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  categories: string[];
  shuffleWords: boolean;
}

const STORAGE_KEY = 'thai-word-progression';
const SETTINGS_KEY = 'thai-word-settings';

const defaultSettings: WordProgressionSettings = {
  difficulty: 'all',
  categories: [],
  shuffleWords: true,
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useWordProgression(masteredWords: Set<string>) {
  const [settings, setSettings] = useState<WordProgressionSettings>(defaultSettings);
  const [state, setState] = useState<WordProgressionState>({
    currentWord: null,
    currentIndex: 0,
    totalWords: 0,
    seenWords: new Set(),
    masteredWords: new Set(),
    availableWords: [],
    completedCycle: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to load word progression settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Filter words based on settings
  const getFilteredWords = useCallback(() => {
    let filtered = vocabulary;

    // Filter by difficulty
    if (settings.difficulty !== 'all') {
      filtered = filtered.filter(word => word.difficulty === settings.difficulty);
    }

    // Filter by categories (if any selected)
    if (settings.categories.length > 0) {
      filtered = filtered.filter(word => settings.categories.includes(word.category));
    }

    return filtered;
  }, [settings]);

  // Initialize or update available words when settings change
  useEffect(() => {
    const filteredWords = getFilteredWords();
    const availableWords = settings.shuffleWords ? shuffleArray(filteredWords) : filteredWords;
    
    setState(prev => {
      // Load progression state from localStorage
      const savedState = localStorage.getItem(STORAGE_KEY);
      let loadedState = null;
      
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          loadedState = {
            ...parsed,
            seenWords: new Set(parsed.seenWords || []),
            masteredWords: new Set(parsed.masteredWords || []),
          };
        } catch (error) {
          console.error('Failed to load word progression state:', error);
        }
      }

      const newState = {
        ...prev,
        availableWords,
        totalWords: availableWords.length,
        masteredWords,
        // If we have loaded state and the word count matches, use it
        ...(loadedState && loadedState.totalWords === availableWords.length ? loadedState : {
          currentIndex: 0,
          seenWords: new Set(),
          completedCycle: false,
        }),
      };

      // Set current word
      if (availableWords.length > 0) {
        newState.currentWord = availableWords[newState.currentIndex] || availableWords[0];
        if (newState.currentWord) {
          newState.currentIndex = availableWords.findIndex(w => w.id === newState.currentWord!.id);
          if (newState.currentIndex === -1) newState.currentIndex = 0;
        }
      }

      return newState;
    });
  }, [settings, masteredWords, getFilteredWords]);

  // Save state to localStorage
  useEffect(() => {
    if (state.availableWords.length > 0) {
      const toSave = {
        ...state,
        seenWords: Array.from(state.seenWords),
        masteredWords: Array.from(state.masteredWords),
        currentWord: null, // Don't save the actual word object
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [state]);

  // Get next word ensuring all words are seen before repetition
  const getNextWord = useCallback(() => {
    if (state.availableWords.length === 0) return null;

    // Create a pool of unseen words (excluding mastered ones)
    const unseenWords = state.availableWords.filter(word => 
      !state.seenWords.has(word.id) && !masteredWords.has(word.id)
    );

    let nextWord: VocabularyWord;
    let nextIndex: number;

    if (unseenWords.length > 0) {
      // Pick from unseen words
      nextWord = unseenWords[0];
      nextIndex = state.availableWords.findIndex(w => w.id === nextWord.id);
    } else {
      // All words have been seen, start a new cycle
      // Reset seen words and pick the first non-mastered word
      const nonMasteredWords = state.availableWords.filter(word => !masteredWords.has(word.id));
      
      if (nonMasteredWords.length === 0) {
        // All words are mastered! Start over with all words
        nextWord = state.availableWords[0];
        nextIndex = 0;
      } else {
        nextWord = nonMasteredWords[0];
        nextIndex = state.availableWords.findIndex(w => w.id === nextWord.id);
      }
    }

    return { word: nextWord, index: nextIndex, shouldResetCycle: unseenWords.length === 0 };
  }, [state.availableWords, state.seenWords, masteredWords]);

  // Advance to next word
  const nextWord = useCallback(() => {
    const next = getNextWord();
    if (!next) return;

    setState(prev => {
      const newSeenWords = new Set(prev.seenWords);
      if (prev.currentWord) {
        newSeenWords.add(prev.currentWord.id);
      }

      return {
        ...prev,
        currentWord: next.word,
        currentIndex: next.index,
        seenWords: next.shouldResetCycle ? new Set([next.word.id]) : newSeenWords,
        completedCycle: next.shouldResetCycle ? true : prev.completedCycle,
      };
    });
  }, [getNextWord]);

  // Go to specific word by ID
  const goToWord = useCallback((wordId: string) => {
    const word = state.availableWords.find(w => w.id === wordId);
    if (!word) return false;

    const index = state.availableWords.findIndex(w => w.id === wordId);
    setState(prev => ({
      ...prev,
      currentWord: word,
      currentIndex: index,
    }));
    return true;
  }, [state.availableWords]);

  // Mark current word as seen
  const markCurrentWordSeen = useCallback(() => {
    if (!state.currentWord) return;
    
    setState(prev => ({
      ...prev,
      seenWords: new Set([...prev.seenWords, state.currentWord!.id]),
    }));
  }, [state.currentWord]);

  // Reset progression
  const resetProgression = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: 0,
      seenWords: new Set(),
      completedCycle: false,
      currentWord: prev.availableWords[0] || null,
    }));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<WordProgressionSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get progress statistics
  const getProgressStats = useCallback(() => {
    const totalAvailable = state.availableWords.length;
    const totalSeen = state.seenWords.size;
    const totalMastered = Array.from(masteredWords).filter(id => 
      state.availableWords.some(w => w.id === id)
    ).length;
    
    return {
      totalWords: totalAvailable,
      seenWords: totalSeen,
      masteredWords: totalMastered,
      unseenWords: totalAvailable - totalSeen,
      progressPercentage: totalAvailable > 0 ? Math.round((totalSeen / totalAvailable) * 100) : 0,
      masteryPercentage: totalAvailable > 0 ? Math.round((totalMastered / totalAvailable) * 100) : 0,
      completedCycle: state.completedCycle,
    };
  }, [state.availableWords, state.seenWords, state.completedCycle, masteredWords]);

  return {
    // Current state
    currentWord: state.currentWord,
    currentIndex: state.currentIndex,
    totalWords: state.totalWords,
    availableWords: state.availableWords,
    
    // Actions
    nextWord,
    goToWord,
    markCurrentWordSeen,
    resetProgression,
    
    // Settings
    settings,
    updateSettings,
    
    // Statistics
    getProgressStats,
  };
}
