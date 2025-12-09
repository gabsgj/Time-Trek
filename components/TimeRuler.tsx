import React from 'react';
import { ERAS } from '../constants';
import { Era } from '../types';

interface TimeRulerProps {
  currentEraId: string | null;
  onSelectEra: (era: Era) => void;
}

const TimeRuler: React.FC<TimeRulerProps> = ({ currentEraId, onSelectEra }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-earth-core border-t dark:border-stone-800 border-stone-300 z-50 flex flex-col justify-end shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-colors duration-500">
      
      {/* Label Tag - Raised higher to avoid overlapping the timeline or getting cut off */}
      <div className="absolute bottom-full mb-0 left-0 md:left-6 bg-mud-primary text-earth-core text-[9px] md:text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest transform skew-x-12 shadow-md rounded-tr-md">
        Geologic Timeline Sequence
      </div>

      <div className="flex w-full h-full overflow-x-auto scrollbar-hide items-end">
        {ERAS.map((era) => {
          const isActive = currentEraId === era.id;
          
          return (
            <button
              key={era.id}
              onClick={() => onSelectEra(era)}
              className={`relative flex-1 min-w-[80px] md:min-w-[120px] h-full transition-all duration-300 group border-r dark:border-stone-900 border-stone-300 overflow-hidden flex flex-col justify-end pb-2 items-center hover:bg-stone-100 dark:hover:bg-stone-800 ${isActive ? 'dark:bg-stone-800 bg-stone-200' : 'dark:bg-earth-mid bg-stone-50'}`}
            >
              {/* Texture Layer */}
              <div className={`absolute inset-0 dark:bg-rock-texture bg-paper-texture opacity-30 mix-blend-overlay`}></div>
              
              {/* Top Highlight Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${isActive ? 'bg-mud-primary shadow-[0_0_15px_rgba(217,119,6,0.8)]' : 'bg-transparent group-hover:bg-mud-primary/30'}`}></div>
              
              <div className={`relative z-10 transition-transform duration-300 flex flex-col items-center gap-1 ${isActive ? '-translate-y-2' : 'translate-y-0 group-hover:-translate-y-1'}`}>
                 <span className={`text-2xl md:text-3xl block drop-shadow-md grayscale group-hover:grayscale-0 transition-all ${isActive ? 'grayscale-0 scale-110' : 'opacity-40'}`}>
                    {era.icon}
                 </span>
                 <span className={`text-[8px] md:text-[9px] font-mono uppercase tracking-widest block transition-colors ${isActive ? 'text-mud-primary font-bold' : 'text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300'}`}>
                    {era.name}
                 </span>
              </div>

              {/* Active Indicator Glow at bottom */}
              {isActive && (
                 <div className="absolute bottom-0 w-1/2 h-0.5 bg-mud-primary rounded-t-full shadow-[0_-2px_8px_rgba(217,119,6,0.8)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeRuler;