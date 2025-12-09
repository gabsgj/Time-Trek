
import React, { useState, useRef } from 'react';
import { CREATURES } from '../constants';
import { Trash2, Plus, Image as ImageIcon, RotateCw, Maximize, MousePointer2, Wand2, ArrowLeft, Download } from 'lucide-react';
import GeminiImage from '../components/GeminiImage';

interface Sticker {
  id: number;
  creatureId: string;
  x: number;
  y: number; // percentage 0-100
  scale: number;
  rotation: number;
}

const CreativeLab: React.FC = () => {
  const [backgroundPrompt, setBackgroundPrompt] = useState('Jurassic Jungle');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
  
  // Generation State
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addSticker = (creatureId: string) => {
    if (isGenerated) return; 
    const newId = Date.now();
    const newSticker: Sticker = { 
        id: newId, 
        creatureId, 
        x: 50, 
        y: 50, 
        scale: 1, 
        rotation: 0 
    };
    setStickers([...stickers, newSticker]);
    setSelectedStickerId(newId);
  };

  const updateSticker = (id: number, updates: Partial<Sticker>) => {
      setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSticker = (id: number) => {
      setStickers(prev => prev.filter(s => s.id !== id));
      if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const clearCanvas = () => {
      setStickers([]);
      setSelectedStickerId(null);
      setIsGenerated(false);
  };

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent, id: number) => {
      if (isGenerated) return;
      e.stopPropagation(); // Prevent canvas click
      setSelectedStickerId(id);
      setIsDragging(true);
      
      // Capture pointer to ensure smooth dragging even if moving fast
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging || selectedStickerId === null || !containerRef.current || isGenerated) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Clamp to visible area (optional, but good for UX)
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      updateSticker(selectedStickerId, { x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // --- AI SCENE GENERATION LOGIC ---
  const generateScene = () => {
      if (stickers.length === 0) return;

      // 1. Base Environment
      let finalPrompt = `Cinematic, photorealistic masterpiece of a ${backgroundPrompt}. `;
      
      // 2. Add Creatures based on position
      const descriptions = stickers.map(s => {
          const c = CREATURES.find(x => x.id === s.creatureId);
          if (!c) return '';

          // Decode X Position
          let xPos = 'in the center';
          if (s.x < 33) xPos = 'on the left side';
          else if (s.x > 66) xPos = 'on the right side';

          // Decode Y Position / Depth
          let depth = 'in the mid-ground';
          if (s.y < 33) depth = 'in the background/sky';
          else if (s.y > 66) depth = 'in the immediate foreground close to camera';

          // Decode Scale
          let size = '';
          if (s.scale > 1.5) size = 'giant, imposing';
          else if (s.scale < 0.7) size = 'small, distant';

          return `A ${size} ${c.name} located ${depth} ${xPos}`;
      });

      if (descriptions.length > 0) {
          finalPrompt += `The scene actively features: ${descriptions.join('. ')}. `;
      }

      // 3. Style Boosters
      finalPrompt += "Highly detailed textures, dramatic lighting, 8k resolution, national geographic photography style, accurate anatomy.";

      setGeneratedPrompt(finalPrompt);
      setIsGenerated(true);
      setSelectedStickerId(null);
  };

  // Get currently selected sticker object
  const selectedSticker = stickers.find(s => s.id === selectedStickerId);

  return (
    <div className="pt-24 pb-24 px-4 min-h-screen dark:bg-earth-core bg-journal-bg transition-colors duration-500 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-6">
      
      {/* Sidebar Controls */}
      <div className={`w-full lg:w-80 dark:bg-earth-dark bg-white border dark:border-stone-800 border-stone-200 p-6 flex flex-col gap-8 h-fit lg:sticky lg:top-24 rounded-xl shadow-lg shrink-0 transition-opacity duration-300 ${isGenerated ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
        
        {/* EDIT CONTROLS - Visible only when selected */}
        {selectedSticker ? (
            <div className="animate-in fade-in slide-in-from-left-4 bg-mud-primary/10 -mx-2 p-4 rounded-xl border border-mud-primary/20">
                <h3 className="text-mud-primary font-mono text-xs uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                    <MousePointer2 size={14}/> Edit Selection
                </h3>
                
                <div className="space-y-4">
                    {/* Scale Control */}
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase dark:text-stone-400 text-stone-500 mb-1">
                            <span className="flex items-center gap-1"><Maximize size={10}/> Size</span>
                            <span>{Math.round(selectedSticker.scale * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="3" 
                            step="0.1"
                            value={selectedSticker.scale}
                            onChange={(e) => updateSticker(selectedSticker.id, { scale: parseFloat(e.target.value) })}
                            className="w-full accent-mud-primary h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Rotation Control */}
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase dark:text-stone-400 text-stone-500 mb-1">
                            <span className="flex items-center gap-1"><RotateCw size={10}/> Rotation</span>
                            <span>{Math.round(selectedSticker.rotation)}°</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="360" 
                            step="15"
                            value={selectedSticker.rotation}
                            onChange={(e) => updateSticker(selectedSticker.id, { rotation: parseInt(e.target.value) })}
                            className="w-full accent-mud-primary h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <button 
                        onClick={() => removeSticker(selectedSticker.id)}
                        className="w-full mt-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2"
                    >
                        <Trash2 size={12} /> Remove Item
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-stone-100 dark:bg-stone-800/50 p-4 rounded-xl text-center">
                <p className="text-xs dark:text-stone-500 text-stone-400 font-mono">
                    Select a creature on the canvas to edit its size and rotation.
                </p>
            </div>
        )}

        {/* Environment Selector */}
        <div>
           <h3 className="text-mud-primary font-mono text-xs uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
             <ImageIcon size={14}/> 1. Choose Environment
           </h3>
           <div className="grid grid-cols-2 gap-2">
              {[
                  { name: 'Swamp', prompt: 'Prehistoric Swamp, foggy, mysterious' },
                  { name: 'Volcano', prompt: 'Volcanic landscape, lava flows, ash' },
                  { name: 'Ocean', prompt: 'Deep underwater ocean, ancient coral' },
                  { name: 'Tundra', prompt: 'Ice Age tundra, snow, glaciers' },
              ].map(env => (
                 <button 
                    key={env.name}
                    onClick={() => setBackgroundPrompt(env.prompt)}
                    className={`p-3 text-xs font-bold rounded-lg transition-all border ${
                        backgroundPrompt === env.prompt 
                        ? 'bg-mud-primary text-white border-mud-primary' 
                        : 'dark:bg-stone-800 bg-stone-100 dark:text-sand text-stone-600 border-transparent hover:border-mud-primary'
                    }`}
                 >
                    {env.name}
                 </button>
              ))}
           </div>
        </div>

        {/* Sticker Selector */}
        <div className="flex-1 min-h-[200px]">
           <h3 className="text-mud-primary font-mono text-xs uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
             <Plus size={14}/> 2. Add Creatures
           </h3>
           <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-2 scrollbar-hide max-h-[300px]">
              {CREATURES.map(c => (
                 <button 
                    key={c.id} 
                    onClick={() => addSticker(c.id)}
                    className="aspect-square dark:bg-stone-800 bg-stone-100 border dark:border-stone-700 border-stone-200 hover:border-mud-primary flex flex-col items-center justify-center p-1 rounded-lg transition-all hover:scale-105 hover:shadow-md group"
                 >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                        {/* Simple emoji mapping based on habitat for icon */}
                        {c.habitat === 'sea' ? '🐟' : c.habitat === 'sky' ? '🦅' : '🦖'}
                    </span>
                    <span className="text-[9px] text-center dark:text-stone-400 text-stone-500 font-bold uppercase leading-none truncate w-full px-1">
                        {c.name.split(' ')[0]}
                    </span>
                 </button>
              ))}
           </div>
        </div>

        <button 
            onClick={clearCanvas}
            className="w-full py-3 border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
            <Trash2 size={14} /> Clear Canvas
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col gap-4">
          
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-white dark:bg-earth-dark p-4 rounded-xl border dark:border-stone-800 border-stone-200 shadow-sm">
             <div className="flex flex-col">
                <h2 className="font-display text-xl dark:text-bone text-ink uppercase">Creative Lab</h2>
                <p className="text-xs dark:text-stone-500 text-stone-400 font-mono">
                    {isGenerated ? 'Viewing Generated Masterpiece' : 'Arrange specimens to generate scene'}
                </p>
             </div>
             
             {isGenerated ? (
                 <div className="flex gap-3">
                     <button 
                        onClick={() => setIsGenerated(false)}
                        className="px-6 py-3 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-colors dark:text-bone text-ink"
                     >
                        <ArrowLeft size={16} /> Edit Layout
                     </button>
                 </div>
             ) : (
                 <button 
                    onClick={generateScene}
                    disabled={stickers.length === 0}
                    className={`px-8 py-3 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-lg ${
                        stickers.length === 0 
                        ? 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed' 
                        : 'bg-mud-primary hover:bg-mud-accent text-white hover:scale-105'
                    }`}
                 >
                    <Wand2 size={16} /> Generate Scene
                 </button>
             )}
          </div>

          <div 
            ref={containerRef}
            className="w-full aspect-video bg-black dark:border-stone-800 border-stone-300 border-4 rounded-xl relative overflow-hidden shadow-2xl group touch-none"
            onClick={() => !isGenerated && setSelectedStickerId(null)}
          >
            {/* MODE 1: AI RESULT VIEW */}
            {isGenerated ? (
                <div className="w-full h-full relative animate-in fade-in duration-1000">
                    <GeminiImage 
                        prompt={generatedPrompt}
                        alt="AI Generated Scene"
                        className="w-full h-full object-cover"
                        autoGenerate={true}
                        aspectRatio="16:9"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/20 shadow-xl flex items-center gap-2">
                        <Wand2 size={12} className="text-mud-primary"/> AI Reconstruction
                    </div>
                </div>
            ) : (
                /* MODE 2: LAYOUT EDITOR */
                <>
                    {/* Background Image Generator */}
                    <GeminiImage 
                        prompt={backgroundPrompt + ", cinematic background, no animals, wide shot"}
                        alt="Background"
                        className="w-full h-full opacity-80 pointer-events-none select-none grayscale-[0.2]"
                        autoGenerate={true}
                        aspectRatio="16:9"
                    />
                    
                    {/* Environment Label */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-mono pointer-events-none border border-white/10 z-0">
                        ENV: {backgroundPrompt.split(',')[0].toUpperCase()}
                    </div>

                    {/* Draggable Stickers */}
                    {stickers.map(s => {
                        const c = CREATURES.find(x => x.id === s.creatureId);
                        const isSelected = selectedStickerId === s.id;
                        
                        return (
                            <div 
                                key={s.id}
                                className={`absolute group/sticker ${isDragging && isSelected ? 'cursor-grabbing z-50' : 'cursor-grab z-10'}`}
                                style={{ 
                                    left: `${s.x}%`, 
                                    top: `${s.y}%`, 
                                    transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale})`,
                                    touchAction: 'none'
                                }}
                                onPointerDown={(e) => handlePointerDown(e, s.id)}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                            >
                                {/* Sticker Content */}
                                <div className={`relative flex flex-col items-center transition-all duration-200 ${isSelected ? 'scale-110 drop-shadow-2xl' : 'drop-shadow-md hover:scale-105'}`}>
                                    <div className={`w-20 h-20 bg-mud-primary rounded-full border-4 flex items-center justify-center relative overflow-hidden ${isSelected ? 'border-white dark:border-mud-accent ring-4 ring-mud-primary/30' : 'border-white dark:border-earth-core'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                        <span className="text-3xl drop-shadow-md select-none">
                                            {c?.habitat === 'sea' ? '🐟' : c?.habitat === 'sky' ? '🦅' : '🦖'}
                                        </span>
                                    </div>
                                    
                                    {/* Label (Hidden when dragging to reduce clutter) */}
                                    {!isDragging && (
                                        <div className={`bg-white dark:bg-earth-dark px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-md mt-1 dark:text-bone text-ink border dark:border-stone-700 border-stone-200 select-none ${isSelected ? 'text-mud-primary' : ''}`}>
                                            {c?.name}
                                        </div>
                                    )}

                                    {/* Selection Indicator Ring (Visual Only) */}
                                    {isSelected && (
                                        <div className="absolute -inset-4 border-2 border-dashed border-mud-primary/50 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '10s' }}></div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    
                    {stickers.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-white/50 font-display text-2xl uppercase tracking-widest drop-shadow-md text-center px-4">
                                Drag & Drop Creatures from the sidebar
                            </p>
                        </div>
                    )}
                </>
            )}
         </div>
         
         <p className="text-center text-xs dark:text-stone-500 text-stone-400 font-mono">
            {isGenerated ? '* AI Generated content based on your layout.' : '* Drag to move. Tap to edit size & rotation. Click "Generate Scene" to visualize.'}
         </p>
      </div>

    </div>
  );
};

export default CreativeLab;
