import React from 'react';
import { Shovel, Map, ChevronDown } from 'lucide-react';
import GeminiImage from '../components/GeminiImage';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-700 dark:bg-earth-core bg-journal-bg group/home">
      
      {/* Background Layer - Generated Hero or Gradient Fallback */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-40 opacity-20 transform scale-105 group-hover/home:scale-100 transition-transform duration-[20s] ease-in-out">
        <GeminiImage 
            prompt="Epic prehistoric landscape, lush ferns, volcano in distance, atmospheric lighting, moody, cinematic, 8k render, photorealistic, wide angle" 
            alt="Background" 
            className="w-full h-full"
            autoGenerate={true}
            aspectRatio="16:9"
        />
        {/* CSS Fallback in case GeminiImage fails to load */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-mud-primary/20 via-stone-900 to-black"></div>
      </div>

      {/* Dirt Texture Overlay */}
      <div className="absolute inset-0 z-10 dark:bg-dirt-pattern bg-paper-texture dark:opacity-30 opacity-60 mix-blend-multiply pointer-events-none"></div>
      
      {/* Vignette & Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
      <div className="absolute inset-0 z-10 dark:bg-gradient-to-t dark:from-earth-core dark:via-earth-core/80 dark:to-transparent bg-gradient-to-t from-journal-bg via-journal-bg/80 to-transparent"></div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-5xl mx-auto">
        
        {/* LOGO AREA */}
        <div className="mb-10 relative group perspective-1000">
            <div className="absolute inset-0 bg-mud-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-mud-primary to-clay rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative animate-float transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full dark:bg-earth-core bg-journal-paper rounded-full flex items-center justify-center border-4 dark:border-stone-800 border-stone-200 overflow-hidden relative">
                     {/* Inner spinny thing */}
                     <div className="absolute inset-0 border-[6px] border-dashed border-mud-primary/20 rounded-full animate-spin-[20s_linear_infinite]"></div>
                     
                     {/* Custom Ammonite Logo */}
                     <div className="w-16 h-16 md:w-24 md:h-24 relative z-10 animate-pulse-slow drop-shadow-md text-mud-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                            <path d="M20.2 14.6l-1.6.9c-1.3.8-2.9 1.1-4.4.8-1.6-.4-2.9-1.4-3.7-2.9-.8-1.5-.8-3.3 0-4.8.9-1.5 2.5-2.5 4.2-2.5h.3" />
                            <path d="M16 10a4 4 0 0 0-7.8 1.2" />
                            <path d="M8.5 10a1.5 1.5 0 0 0 2.9 0" />
                            <circle cx="12" cy="12" r="10" className="opacity-30" />
                        </svg>
                     </div>
                </div>
            </div>
        </div>

        <div className="mb-8 border-y border-mud-primary/30 py-3 px-10 dark:bg-earth-dark/80 bg-white/60 backdrop-blur-md shadow-lg rounded-sm">
            <span className="text-mud-primary font-mono text-xs md:text-sm tracking-[0.4em] uppercase font-bold flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-mud-primary animate-ping"></span>
              Project Chronos Active
              <span className="w-2 h-2 rounded-full bg-mud-primary animate-ping"></span>
            </span>
        </div>

        <h1 className="font-display text-7xl md:text-9xl dark:text-bone text-ink mb-6 drop-shadow-2xl tracking-tight leading-none scale-y-110">
          TIME TREK
        </h1>
        
        <p className="text-lg md:text-2xl dark:text-sand text-ink-light font-hand italic max-w-2xl mb-14 leading-relaxed transform -rotate-1 opacity-90">
          "The earth remembers. Dig deep enough, and you will find monsters."
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-16 py-6 text-lg font-bold dark:text-earth-core text-journal-bg bg-mud-primary hover:bg-mud-accent transition-all duration-300 clip-path-polygon shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:shadow-[0_0_60px_rgba(217,119,6,0.6)] hover:-translate-y-1 overflow-hidden"
        >
          {/* Light sweep effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          
          <Shovel className="w-6 h-6 mr-3 group-hover:rotate-45 transition-transform relative z-10" />
          <span className="relative z-10 tracking-widest">BEGIN EXCAVATION</span>
          
          {/* Button Tech Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 dark:border-earth-core border-white"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 dark:border-earth-core border-white"></div>
        </button>

        {/* Floating Era Indicators */}
        <div className="mt-24 grid grid-cols-3 gap-12 w-full max-w-lg opacity-60 hover:opacity-100 transition-opacity duration-500">
           {['Triassic', 'Jurassic', 'Cretaceous'].map((era, i) => (
             <div key={era} className="flex flex-col items-center gap-3 group cursor-default">
                <div className={`w-full h-1 rounded-full transition-all duration-500 ${i === 1 ? 'bg-mud-primary shadow-[0_0_10px_orange] scale-x-110' : 'bg-stone-600 group-hover:bg-stone-400'}`}></div>
                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${i === 1 ? 'text-mud-primary' : 'dark:text-stone-600 text-stone-400 group-hover:text-stone-500'}`}>
                  {era}
                </span>
             </div>
           ))}
        </div>

        <div className="absolute bottom-8 animate-bounce text-stone-500/50">
            <ChevronDown size={32} />
        </div>
      </div>
    </div>
  );
};

export default Home;