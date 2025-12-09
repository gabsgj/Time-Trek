import React, { useState } from 'react';
import { Era, Creature } from '../types';
import { CREATURES } from '../constants';
import { Search, Bone, Pickaxe, Map as MapIcon, Filter, X } from 'lucide-react';
import GeminiImage from '../components/GeminiImage';

interface EraExplorerProps {
  era: Era;
  onSelectCreature: (c: Creature) => void;
}

const EraExplorer: React.FC<EraExplorerProps> = ({ era, onSelectCreature }) => {
  const [filter, setFilter] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'carnivore' | 'herbivore'>('all');
  
  const creatures = CREATURES.filter(c => {
    const matchesEra = c.eraId === era.id;
    const matchesSearch = c.name.toLowerCase().includes(filter.toLowerCase());
    const matchesDiet = dietFilter === 'all' || c.diet === dietFilter || (dietFilter === 'carnivore' && (c.diet === 'piscivore' || c.diet === 'insectivore'));
    return matchesEra && matchesSearch && matchesDiet;
  });

  return (
    <div className="pt-24 pb-48 min-h-screen relative dark:bg-earth-core bg-journal-bg transition-colors duration-500">
       
       {/* Generated Atmosphere Background */}
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed">
          <GeminiImage 
            prompt={`Wide angle landscape of the ${era.name} era, ${era.description}, prehistoric nature, atmospheric, cinematic lighting`} 
            alt={era.name}
            className="w-full h-full grayscale dark:grayscale-0 scale-110 blur-sm"
            autoGenerate={true}
            aspectRatio="16:9"
          />
       </div>

       {/* Scanline / Grid Overlay */}
       <div className="absolute inset-0 z-0 dark:bg-[linear-gradient(rgba(12,10,9,0.9),rgba(12,10,9,0.9)),url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-[linear-gradient(rgba(245,245,220,0.96),rgba(245,245,220,0.96)),url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-100 mix-blend-normal"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header Dashboard */}
        <header className="mb-10 border-b dark:border-stone-800 border-stone-300 pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-3">
                 <div className={`w-14 h-14 flex items-center justify-center dark:bg-stone-800 bg-white rounded-xl border dark:border-stone-700 border-stone-300 text-3xl shadow-lg ring-1 ring-black/5`}>
                    {era.icon}
                 </div>
                 <div>
                    <h2 className="font-display text-5xl md:text-6xl dark:text-bone text-ink uppercase tracking-tight leading-none break-words text-shadow-sm">
                      {era.name}
                    </h2>
                 </div>
              </div>
              <p className="text-mud-primary font-mono text-xs uppercase tracking-widest pl-1 font-bold flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 Sector Active // {era.timeRange}
              </p>
            </div>
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
               <div className="relative group flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-mud-primary transition-colors w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="SEARCH FOSSIL DB..." 
                    className="pl-10 pr-4 py-3.5 dark:bg-stone-900/80 bg-white border dark:border-stone-700 border-stone-300 dark:text-bone text-ink placeholder-stone-500 focus:outline-none focus:border-mud-primary focus:ring-1 focus:ring-mud-primary transition-all w-full font-mono text-xs uppercase tracking-wider rounded-lg shadow-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  {filter && (
                    <button onClick={() => setFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-red-500">
                        <X size={14} />
                    </button>
                  )}
               </div>

               {/* Diet Filters */}
               <div className="flex bg-white dark:bg-stone-900/80 rounded-lg p-1 border dark:border-stone-700 border-stone-300 shadow-sm">
                  {['all', 'carnivore', 'herbivore'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDietFilter(d as any)}
                        className={`px-4 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                            dietFilter === d 
                            ? 'bg-mud-primary text-white shadow-md' 
                            : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        {d}
                      </button>
                  ))}
               </div>
            </div>
        </header>

        {/* The Dig Site (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {creatures.length > 0 ? (
            creatures.map((creature, index) => (
              <div 
                key={creature.id}
                onClick={() => onSelectCreature(creature)}
                className="group relative dark:bg-stone-900 bg-white border dark:border-stone-800 border-stone-200 hover:border-mud-primary/50 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] rounded-xl flex flex-col h-full animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Tech Pattern */}
                <div className="absolute inset-0 dark:bg-dirt-pattern bg-paper-texture opacity-5 pointer-events-none"></div>

                {/* Card Content */}
                <div className="flex flex-col h-full relative z-10">
                   
                   {/* Thumbnail Image Area */}
                   <div className="w-full h-48 bg-stone-200 dark:bg-stone-950 relative overflow-hidden border-b dark:border-stone-800 border-stone-100 group">
                      
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
                         <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase backdrop-blur-md shadow-sm border border-white/10 ${creature.dangerLevel > 7 ? 'bg-red-600/90 text-white' : creature.dangerLevel > 4 ? 'bg-orange-500/90 text-white' : 'bg-green-600/90 text-white'}`}>
                            Danger Lvl {creature.dangerLevel}
                         </div>
                      </div>
                      
                      {/* AI GENERATED FOSSIL THUMBNAIL */}
                      {/* Using 16:9 ratio and "wide shot" prompt to prevent cropping heads/tails */}
                      <GeminiImage 
                        prompt={`Wide shot of a complete fossilized skeleton of ${creature.name} fully visible embedded in a stone slab, museum specimen, centered, high detail`} 
                        alt={`${creature.name} Fossil`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 sepia-[.3] group-hover:sepia-0"
                        autoGenerate={true}
                        aspectRatio="16:9"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity"></div>
                      
                      {/* ID Tag */}
                      <div className="absolute bottom-2 left-3 font-mono text-[9px] text-white/70 uppercase tracking-widest">
                         {creature.id.substring(0,6).toUpperCase()}-SEQ
                      </div>
                   </div>

                   {/* Text Info Area */}
                   <div className="p-5 flex-1 flex flex-col justify-between">
                       <div>
                          <h3 className="font-display text-xl dark:text-bone text-ink group-hover:text-mud-primary transition-colors leading-tight mb-2 line-clamp-2 min-h-[3rem]">
                            {creature.name}
                          </h3>
                          
                          <div className="flex flex-wrap gap-y-2 gap-x-3 text-[10px] dark:text-stone-400 text-stone-500 font-mono mb-4 uppercase tracking-wide font-bold">
                             <span className="flex items-center gap-1 dark:text-stone-500 text-stone-400"><MapIcon size={10}/> {creature.region.split(',')[0]}</span>
                             <span className="text-mud-primary/50">|</span>
                             <span className={`${creature.diet === 'carnivore' ? 'text-red-500' : creature.diet === 'herbivore' ? 'text-green-600' : 'text-orange-500'}`}>
                                {creature.diet}
                             </span>
                          </div>
                       </div>
                       
                       {/* Footer / Stats */}
                       <div className="mt-auto pt-4 border-t dark:border-stone-800 border-stone-100">
                          {/* Mini Stat Bars */}
                          <div className="flex gap-1.5 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                              <StatPill value={creature.attributes.speed} color="bg-blue-500" label="SPD" />
                              <StatPill value={creature.attributes.defense} color="bg-orange-500" label="DEF" />
                              <StatPill value={creature.attributes.intelligence} color="bg-purple-500" label="INT" />
                          </div>

                          {/* Action Button */}
                          <div className="w-full bg-stone-100 dark:bg-stone-800 group-hover:bg-mud-primary text-stone-500 dark:text-stone-400 group-hover:text-white text-[10px] font-bold py-2.5 uppercase tracking-widest flex items-center justify-center gap-2 rounded-md transition-all duration-300 shadow-sm group-hover:shadow-md">
                             <Pickaxe size={12} className="group-hover:-rotate-12 transition-transform" /> Excavate
                          </div>
                       </div>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed dark:border-stone-800 border-stone-300 rounded-2xl bg-stone-50/50 dark:bg-stone-900/30">
              <div className="bg-stone-200 dark:bg-stone-800 p-6 rounded-full mb-4">
                  <Bone className="dark:text-stone-600 text-stone-400 w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold dark:text-bone text-ink mb-1">No Fossils Found</h3>
              <p className="dark:text-stone-500 text-stone-400 font-mono text-xs uppercase tracking-wide">Try adjusting your scanner filters.</p>
              <button onClick={() => {setFilter(''); setDietFilter('all');}} className="mt-4 text-mud-primary text-xs font-bold uppercase hover:underline">Clear Search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ value, color, label }: { value: number, color: string, label: string }) => (
    <div className="flex-1 flex flex-col gap-0.5">
        <div className="h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{width: `${value * 10}%`}}></div>
        </div>
        <span className="text-[8px] font-mono text-stone-400 text-center">{label}</span>
    </div>
)

export default EraExplorer;