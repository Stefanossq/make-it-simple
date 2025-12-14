import React, { useState, useCallback } from 'react';
import { CHARACTERS } from './constants';
import Experience from './components/Experience';
import Interface from './components/Interface';

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % CHARACTERS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleConfirm = useCallback(() => {
    const char = CHARACTERS[selectedIndex];
    alert(`Character Selected: ${char.name}\nInitiating sequence...`);
    // Here you would navigate to the next screen or trigger a game start
  }, [selectedIndex]);

  return (
    <div className="w-full h-screen bg-void relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Experience 
            characters={CHARACTERS} 
            selectedIndex={selectedIndex} 
            onSelect={handleSelect}
        />
      </div>

      {/* UI Overlay */}
      <Interface 
        characters={CHARACTERS}
        selectedIndex={selectedIndex}
        onNext={handleNext}
        onPrev={handlePrev}
        onSelect={handleConfirm}
      />
    </div>
  );
};

export default App;