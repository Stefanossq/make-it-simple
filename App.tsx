import React, { useState, useCallback } from 'react';
import { CHARACTERS } from './constants';
import Experience from './components/Experience';
import Interface from './components/Interface';
import GamePage from './components/GamePage';
import { AnimatePresence, motion } from 'framer-motion';

type ViewState = 'selecting' | 'confirming' | 'game';

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewState, setViewState] = useState<ViewState>('selecting');

  const handleNext = useCallback(() => {
    if (viewState !== 'selecting') return;
    setSelectedIndex((prev) => (prev + 1) % CHARACTERS.length);
  }, [viewState]);

  const handlePrev = useCallback(() => {
    if (viewState !== 'selecting') return;
    setSelectedIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
  }, [viewState]);

  const handleSelect = useCallback((index: number) => {
    if (viewState !== 'selecting') return;
    setSelectedIndex(index);
  }, [viewState]);

  const handleConfirm = useCallback(() => {
    setViewState('confirming');
    
    // Sequence: 
    // 1. 'confirming' starts animation (zoom, glow)
    // 2. 1.5s later, fade to white
    // 3. 2.0s later, switch to 'game' view
    setTimeout(() => {
        setViewState('game');
    }, 2000);
  }, []);

  const handleBack = useCallback(() => {
      setViewState('selecting');
  }, []);

  return (
    <div className="w-full h-screen bg-void relative overflow-hidden">
      
      {/* 3D Background - Always active but obscured in game view */}
      <div className="absolute inset-0 z-0">
        <Experience 
            characters={CHARACTERS} 
            selectedIndex={selectedIndex} 
            onSelect={handleSelect}
            mode={viewState}
        />
      </div>

      {/* UI Overlay for Selection */}
      <Interface 
        characters={CHARACTERS}
        selectedIndex={selectedIndex}
        onNext={handleNext}
        onPrev={handlePrev}
        onSelect={handleConfirm}
        visible={viewState === 'selecting'}
      />

      {/* Flash Overlay for Transition */}
      <AnimatePresence>
        {viewState === 'confirming' && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }} // Fade in white at the end of confirm anim
                className="absolute inset-0 bg-white z-40 pointer-events-none"
             />
        )}
      </AnimatePresence>

      {/* Game/Post-Selection Page */}
      <AnimatePresence>
        {viewState === 'game' && (
            <motion.div 
                key="game-page"
                className="absolute inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <GamePage 
                    character={CHARACTERS[selectedIndex]} 
                    onBack={handleBack}
                />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;