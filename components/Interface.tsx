import React from 'react';
import { CharacterData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface InterfaceProps {
  characters: CharacterData[];
  selectedIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: () => void;
  visible: boolean;
}

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center gap-4 mb-2">
    <span className="w-16 text-xs text-gray-400 font-mono uppercase tracking-widest">{label}</span>
    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
      <motion.div 
        className="h-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "circOut" }}
      />
    </div>
    <span className="w-8 text-right text-xs font-bold">{value}</span>
  </div>
);

const Interface: React.FC<InterfaceProps> = ({ characters, selectedIndex, onNext, onPrev, onSelect, visible }) => {
  const current = characters[selectedIndex];

  return (
    <AnimatePresence>
        {visible && (
            <motion.div 
                className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
            {/* Header */}
            <header className="flex justify-between items-start pointer-events-auto">
                <div>
                <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                    Make It<br />Simple <span className="text-neon-blue">!</span>
                </h1>
                <p className="mt-2 text-sm text-gray-400 max-w-xs font-body">
                    Choose your avatar. Break the simulation.
                </p>
                </div>
                <button 
                    className="border border-white/20 px-6 py-2 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest backdrop-blur-md"
                >
                    Login
                </button>
            </header>

            {/* Main Content Area - Absolute Centered Controls */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-4 md:px-12">
                <button 
                onClick={onPrev}
                className="pointer-events-auto p-4 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-all active:scale-95 group"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                </button>

                <button 
                onClick={onNext}
                className="pointer-events-auto p-4 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-all active:scale-95 group"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                </button>
            </div>

            {/* Footer / Stats Panel */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 pointer-events-auto">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={current.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full md:w-96 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl"
                    >
                        <div className="flex items-baseline justify-between mb-2">
                            <h2 className="text-3xl font-display uppercase tracking-wide" style={{ color: current.color }}>
                                {current.name}
                            </h2>
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-gray-300">
                                {current.role}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            {current.description}
                        </p>
                        
                        <div className="space-y-1">
                            <StatBar label="PWR" value={current.stats.power} color={current.color} />
                            <StatBar label="SPD" value={current.stats.speed} color={current.color} />
                            <StatBar label="DEF" value={current.stats.defense} color={current.color} />
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="w-full md:w-auto flex justify-end">
                    <button 
                        onClick={onSelect}
                        className="w-full md:w-auto px-12 py-4 bg-white text-black font-display text-xl uppercase tracking-widest hover:bg-neon-blue hover:text-black transition-colors shadow-lg shadow-white/20"
                    >
                        Confirm Select
                    </button>
                </div>
            </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default Interface;