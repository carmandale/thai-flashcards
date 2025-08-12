# Product Roadmap

> Last Updated: 2025-08-12
> Version: 1.0.0
> Status: Planning

## Phase 0: Already Completed

**Goal:** Establish core vocabulary learning functionality
**Success Criteria:** Users can practice Thai vocabulary with audio pronunciation and track progress

The following features have been implemented:

- [x] **Flashcard Vocabulary System** - Interactive flashcards with 250+ Thai words organized by difficulty level `M`
- [x] **Quiz Mode** - Gamified testing system with multiple choice questions `M`
- [x] **Progress Tracking** - XP points and streak system to encourage daily practice `S`
- [x] **Text-to-Speech Pronunciation** - Native Thai audio pronunciation for all vocabulary with mobile optimization `L`
- [x] **Mobile-Responsive UI** - Touch-optimized interface that works seamlessly on smartphones `M`
- [x] **Vocabulary Categories** - Words organized by beginner/intermediate/advanced difficulty levels `S`

### Dependencies
- React 19 foundation established
- Tailwind CSS styling system in place
- Audio handling and TTS integration complete

## Phase 1: Enhanced Mobile Experience (2 weeks)

**Goal:** Optimize for mobile-first usage and remove development artifacts
**Success Criteria:** App feels native on mobile devices, clean interface for travel use

### Must-Have Features

- [ ] **Remove Game Placeholder** - Remove "Mouse & Cheese" game tab and clean up unused components `S`
- [ ] **Enhanced Touch Interactions** - Improved gestures and mobile-specific interactions `M`
- [ ] **Offline Mode Foundation** - Basic PWA setup for offline vocabulary access `L`
- [ ] **Mobile Audio Optimization** - Enhanced TTS reliability on iOS and Android `M`

### Should-Have Features

- [ ] **Improved Navigation** - Mobile-first navigation patterns `S`
- [ ] **Touch Feedback** - Haptic feedback and visual touch responses `S`

### Dependencies

- Mobile testing on various devices
- PWA manifest and service worker setup

## Phase 2: Thai Script Learning (3 weeks)

**Goal:** Enable users to read basic Thai text and script
**Success Criteria:** Users can recognize and read common Thai characters and words

### Must-Have Features

- [ ] **Thai Script Introduction** - Basic character recognition and formation `L`
- [ ] **Character Practice Mode** - Interactive character tracing and recognition `L`
- [ ] **Script-Vocabulary Integration** - Show Thai script alongside romanized text in flashcards `M`
- [ ] **Reading Practice** - Simple Thai text reading exercises `L`

### Should-Have Features

- [ ] **Character Grouping** - Thai characters organized by similarity and usage `M`
- [ ] **Tone Mark Learning** - Understanding Thai tone marks and pronunciation `M`

### Dependencies

- Thai font integration
- Character stroke order data
- Touch drawing/tracing functionality

## Phase 3: Intelligent Learning (2 weeks)

**Goal:** Implement adaptive learning that personalizes to user progress
**Success Criteria:** App adapts difficulty and review frequency based on individual performance

### Must-Have Features

- [ ] **Spaced Repetition Algorithm** - Intelligent scheduling based on memory retention curves `XL`
- [ ] **Difficulty Adaptation** - Dynamic adjustment of word difficulty based on performance `L`
- [ ] **Personalized Review** - Custom review sets focusing on challenging words `M`

### Should-Have Features

- [ ] **Learning Analytics** - Progress visualization and learning insights `M`
- [ ] **Study Recommendations** - AI-suggested study sessions and focus areas `L`

### Dependencies

- User performance data collection
- Memory retention algorithms
- Analytics dashboard components

## Phase 4: Conversation Practice (2 weeks)

**Goal:** Provide practical conversation scenarios for travel use
**Success Criteria:** Users can practice common travel conversations and build confidence

### Must-Have Features

- [ ] **Travel Scenarios** - Restaurant, transportation, shopping, and hotel conversations `L`
- [ ] **Interactive Dialogues** - Practice conversations with audio feedback `XL`
- [ ] **Phrase Builder** - Construct common phrases from learned vocabulary `M`
- [ ] **Emergency Phrases** - Critical phrases for travel emergencies `S`

### Should-Have Features

- [ ] **Cultural Context** - Thai cultural notes and etiquette guidance `M`
- [ ] **Regional Variations** - Different Thai dialects and regional differences `L`

### Dependencies

- Conversation script database
- Audio dialogue recordings
- Cultural content research

## Phase 5: Advanced Features (3 weeks)

**Goal:** Professional-grade features for serious learners and extended use
**Success Criteria:** App supports long-term learning goals and advanced functionality

### Must-Have Features

- [ ] **Extended Vocabulary** - Expand to 1000+ words across specialized categories `L`
- [ ] **Advanced Grammar** - Thai sentence structure and grammar rules `XL`
- [ ] **Export/Import Progress** - Backup and sync learning progress `M`
- [ ] **Multiple Vocabulary Sets** - Specialized sets for different interests (business, food, culture) `L`

### Should-Have Features

- [ ] **Community Features** - Share progress and compete with other learners `XL`
- [ ] **Learning Streaks & Achievements** - Extended gamification with badges and rewards `M`
- [ ] **Voice Recognition** - Practice pronunciation with speech recognition feedback `XL`

### Dependencies

- Cloud storage integration
- Advanced audio processing
- Community platform infrastructure