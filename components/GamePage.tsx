import React from 'react';
import { CharacterData } from '../types';
import { motion } from 'framer-motion';

interface GamePageProps {
  character: CharacterData;
  onBack: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ character, onBack }) => {
  return (
    <div className="absolute inset-0 bg-void flex flex-col items-center justify-center text-white z-50 overflow-hidden">
        {/* Background ambient glow matching character */}
        <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ 
                background: `radial-gradient(circle at center, ${character.color}, transparent 70%)` 
            }}
        />

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 text-center max-w-4xl px-6"
        >
            <h2 className="text-neon-blue font-mono text-sm tracking-[0.5em] mb-4">SIMULATION INITIALIZED</h2>
            
            <h1 
                className="text-8xl md:text-9xl font-display uppercase tracking-tighter mb-2 text-transparent bg-clip-text"
                style={{ 
                    backgroundImage: `linear-gradient(to bottom right, #fff, ${character.color})`,
                    textShadow: `0 0 40px ${character.color}40`
                }}
            >
                {character.name}
            </h1>
            
            <div className="flex justify-center gap-4 mb-12">
                <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase bg-black/50 backdrop-blur-md">
                    Role: {character.role}
                </span>
                <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase bg-black/50 backdrop-blur-md">
                   Geometry: {character.geometry}
                </span>
            </div>

            <p className="text-gray-400 text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed mb-12">
                System synchronization complete. The neural link has been established. 
                Get ready to deploy into the void.
            </p>

            <button 
                onClick={onBack}
                className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-md transition-all hover:scale-105"
            >
                <div className="absolute inset-0 border border-white/20 group-hover:border-white/60 transition-colors rounded-md" />
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: character.color }} 
                />
                <span className="relative font-display tracking-widest uppercase">
                    Abort Mission
                </span>
            </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-12 left-12 w-32 h-[1px] bg-white/20" />
        <div className="absolute bottom-12 right-12 w-32 h-[1px] bg-white/20" />
        <div className="absolute top-12 right-12 font-mono text-xs text-gray-600">SYS.VER.2.0.4</div>
        <div className="absolute bottom-12 left-12 font-mono text-xs text-gray-600">CONNECTED</div>
    </div>
  );
};

export default GamePage;