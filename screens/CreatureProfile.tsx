import React, { useState } from 'react';
import { Creature } from '../types';
import { X, Ruler, Utensils, Globe, Fingerprint, Activity, Database, Zap, Shield, Brain, Volume2, Mountain } from 'lucide-react';
import GeminiImage from '../components/GeminiImage';
import { generateCreatureStory } from '../services/geminiService';

interface CreatureProfileProps {
  creature: Creature;
  onClose: () => void;
}

const CreatureProfile: React.FC<CreatureProfileProps> = ({ creature, onClose }) => {
  const [logEntry, setLogEntry] = useState<string | null>(null);

  React.useEffect(() => {
     generateCreatureStory(creature.name).then(setLogEntry);
  }, [creature]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-0 md:p-6 overflow-hidden">
      
      {/* Main Lab Container */}
      <div className="w-full h-full md:max-w-6xl md:h-[90vh] dark:bg-earth-core bg-journal-paper border-0 md:border dark:border-stone-700 border-stone-300 flex flex-col md:flex-row overflow-hidden relative shadow-2xl md:rounded-3xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-mud-primary text-white backdrop-blur-md border border-white/20 shadow-lg p-2.5 rounded-full transition-all transform hover:rotate-90 hover:scale-105 group"
          title="Close File"
        >
          <X size={20} className="group-hover:text-white" />
        </button>

        {/* LEFT COLUMN: Visual Analysis */}
        <div className="w-full md:w-1/2 h-[40%] md:h-full relative dark:bg-stone-900 bg-stone-800 group overflow-hidden">
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none z-10"></div>
          
          {/* The AI Generator */}
          <div className="w-full h-full">
            <GeminiImage 
                prompt={`Full body shot of a ${creature.name} in a ${creature.habitat} environment. Photorealistic, 8k, national geographic style, dynamic pose, cinematic lighting.`}
                alt={creature.name}
                className="w-full h-full object-cover"
                autoGenerate={true}
                aspectRatio="4:3"
            />
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-earth-core via-transparent to-transparent opacity-90 md:opacity-60 z-10 pointer-events-none"></div>

          {/* Title Area on Image */}
          <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20 w-full">
             <div className="flex items-center gap-2 mb-2 animate-in slide-in-from-left-4 fade-in duration-700">
                <span className="bg-mud-primary text-white font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider rounded shadow-md border border-white/20">Reconstruction 100%</span>
                <span className="text-white/80 font-mono text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                    {creature.period}
                </span>
             </div>
             <h1 className="font-display text-4xl md:text-6xl dark:text-bone text-white uppercase text-shadow-lg leading-[0.9] break-words drop-shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-700 delay-100">
                {creature.name}
             </h1>
             <div className="flex items-center gap-2 mt-3 text-white/60 text-xs font-mono uppercase tracking-widest animate-in fade-in delay-300">
                <Volume2 size={12} className="text-mud-primary" /> {creature.pronunciation}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Data Terminal */}
        <div className="w-full md:w-1/2 h-[60%] md:h-full dark:bg-earth-core bg-journal-paper flex flex-col overflow-hidden relative">
           {/* Header Stripe */}
           <div className="h-1.5 w-full bg-mud-primary"></div>

           <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
              
              {/* Description Box */}
              <div className="mb-10 relative">
                 <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-mud-primary to-transparent rounded-full opacity-50"></div>
                 <p className="font-hand text-xl md:text-2xl dark:text-sand text-ink leading-relaxed italic opacity-90">
                    "{creature.description}"
                 </p>
              </div>

              {/* Battle Stats */}
              <div className="mb-10">
                 <h3 className="dark:text-stone-500 text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={12} /> Performance Metrics
                 </h3>
                 <div className="grid grid-cols-3 gap-4">
                     <StatRadial label="SPD" value={creature.attributes.speed} color="text-blue-500" icon={<Zap size={20} strokeWidth={2.5} />} />
                     <StatRadial label="DEF" value={creature.attributes.defense} color="text-orange-500" icon={<Shield size={20} strokeWidth={2.5} />} />
                     <StatRadial label="INT" value={creature.attributes.intelligence} color="text-purple-500" icon={<Brain size={20} strokeWidth={2.5} />} />
                 </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-px dark:bg-stone-800/50 bg-stone-300 border dark:border-stone-800 border-stone-300 mb-10 rounded-lg overflow-hidden">
                  <DataCell label="Length" value={`${creature.size.length}m`} icon={<Ruler size={14}/>} />
                  <DataCell label="Diet" value={creature.diet} icon={<Utensils size={14}/>} />
                  <DataCell label="Region" value={creature.region} icon={<Globe size={14}/>} />
                  <DataCell label="Habitat" value={creature.habitat} icon={<Mountain size={14}/>} />
              </div>

              {/* Log Entry (AI Text) */}
              <div className="dark:bg-stone-900 bg-amber-50/50 border dark:border-stone-800 border-amber-200/50 p-5 rounded-lg mb-10 relative overflow-hidden group">
                 {/* Tech accent */}
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Database size={40} />
                 </div>
                 
                 <div className="flex items-center gap-2 text-mud-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="w-1.5 h-1.5 bg-mud-primary rounded-full animate-pulse"></span>
                    Encrypted Log
                 </div>
                 <p className="dark:text-stone-400 text-ink-light font-mono text-xs leading-relaxed border-l-2 border-mud-primary/20 pl-3">
                    {logEntry ? logEntry : <span className="animate-pulse">Decrypting paleolithic data stream...</span>}
                 </p>
              </div>

              {/* Fun Facts */}
              <div className="pb-8">
                 <h3 className="dark:text-stone-500 text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Fingerprint size={12} /> Field Notes
                 </h3>
                 <ul className="space-y-3">
                    {creature.funFacts.map((fact, i) => (
                       <li key={i} className="flex gap-4 text-sm dark:text-sand text-ink items-start group">
                          <span className="text-mud-primary/50 font-mono font-bold text-xs pt-1 group-hover:text-mud-primary transition-colors">0{i+1}</span>
                          <span className="leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity border-b border-transparent group-hover:border-mud-primary/10 pb-2">{fact}</span>
                       </li>
                    ))}
                 </ul>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

const StatRadial = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: any }) => {
    const circumference = 2 * Math.PI * 18; // r=18
    const offset = circumference - (value / 10) * circumference;

    return (
        <div className="flex flex-col items-center gap-2 dark:bg-stone-900/50 bg-white p-3 rounded-xl border dark:border-stone-800 border-stone-200">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-stone-200 dark:text-stone-800" />
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className={`${color} transition-all duration-1000 ease-out`} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center ${color}`}>
                    {icon}
                </div>
            </div>
            <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-400 text-stone-500">{label}</div>
                <div className="text-[9px] font-mono dark:text-stone-600 text-stone-400">{value}/10</div>
            </div>
        </div>
    )
}

const DataCell = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
    <div className="dark:bg-earth-dark bg-white p-4 flex flex-col gap-1 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors group">
        <span className="text-stone-400 group-hover:text-mud-primary transition-colors text-[9px] uppercase tracking-wider flex items-center gap-2">{icon} {label}</span>
        <span className="dark:text-bone text-ink font-bold capitalize truncate text-sm">{value}</span>
    </div>
);

export default CreatureProfile;