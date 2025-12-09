import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { Loader2, RefreshCw, Bone } from 'lucide-react';

interface GeminiImageProps {
  prompt: string;
  alt: string;
  className?: string;
  autoGenerate?: boolean;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4';
}

// 1. In-Memory Cache (Fastest, per session)
const memoryCache: Record<string, string> = {};

// 2. Local Storage Cache (Persistent, simulates saving files)
const STORAGE_PREFIX = 'timetrek_img_';

const saveToStorage = (key: string, dataUrl: string) => {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, dataUrl);
    } catch (e) {
        console.warn("Local Storage full, could not save image to disk.", e);
        // Optional: Clear old images here to make space (LRU), 
        // but for now we just fallback to memory cache.
    }
};

const getFromStorage = (key: string): string | null => {
    try {
        return localStorage.getItem(STORAGE_PREFIX + key);
    } catch (e) {
        return null;
    }
};

const GeminiImage: React.FC<GeminiImageProps> = ({ prompt, alt, className = "", autoGenerate = true, aspectRatio = '1:1' }) => {
  // Include aspectRatio in cache key so different shapes are cached separately
  const cacheKey = `${prompt}_${aspectRatio}`;
  
  // Try memory -> try storage -> null
  const cached = memoryCache[cacheKey] || getFromStorage(cacheKey);
  
  const [imageUrl, setImageUrl] = useState<string | null>(cached);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchImage = async () => {
    // Double check cache before fetching
    const currentCache = memoryCache[cacheKey] || getFromStorage(cacheKey);
    if (currentCache) {
        setImageUrl(currentCache);
        return;
    }

    setLoading(true);
    setError(false);
    
    // Add a small artificial delay if we are retrying quickly to prevent UI flicker
    if (error) await new Promise(r => setTimeout(r, 500));

    const result = await generateImage(prompt, aspectRatio);
    
    if (result) {
      // Save to Memory
      memoryCache[cacheKey] = result;
      // Save to "Disk" (Local Storage)
      saveToStorage(cacheKey, result);
      
      setImageUrl(result);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only auto-generate if we don't have an image, aren't loading, haven't errored yet
    if (autoGenerate && !imageUrl && !loading && !error) {
      fetchImage();
    }
  }, [prompt, autoGenerate, aspectRatio]);

  // FALLBACK UI: If error (e.g. Quota Exceeded), show a stylized placeholder
  if (error) {
    return (
      <div className={`relative flex flex-col items-center justify-center dark:bg-stone-900 bg-stone-200 overflow-hidden group ${className}`}>
         {/* Fallback Texture */}
         <div className="absolute inset-0 opacity-10 dark:bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
         
         {/* Centered Icon */}
         <div className="z-10 text-stone-400 dark:text-stone-600 flex flex-col items-center p-4 text-center transition-colors group-hover:text-mud-primary/70">
             <div className="mb-2 p-3 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700">
                <Bone size={24} className="opacity-70" />
             </div>
             <span className="text-[10px] uppercase font-mono tracking-widest opacity-70 font-bold">
                 Fossil Record Only
             </span>
             <span className="text-[8px] uppercase font-mono tracking-widest opacity-50 mt-1">
                 (Visual reconstruction unavailable)
             </span>
         </div>
         
         {/* Retry Button (Subtle) */}
         <button 
            onClick={(e) => { e.stopPropagation(); fetchImage(); }}
            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/10 hover:bg-mud-primary/20 text-stone-500 hover:text-mud-primary transition-colors"
            title="Retry Generation"
         >
            <RefreshCw size={12} />
         </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center dark:bg-earth-core bg-white relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 dark:bg-dirt-pattern bg-paper-texture opacity-20"></div>
        <Loader2 size={24} className="text-mud-primary animate-spin z-10" />
        <span className="text-mud-primary/70 text-[9px] font-mono mt-2 uppercase tracking-widest z-10 animate-pulse">
            Reconstructing...
        </span>
      </div>
    );
  }

  if (!imageUrl) {
     return (
         <div 
            onClick={(e) => { e.stopPropagation(); fetchImage(); }}
            className={`cursor-pointer flex flex-col items-center justify-center dark:bg-earth-mid bg-stone-50 hover:dark:bg-earth-dark hover:bg-stone-100 transition-colors border dark:border-stone-800 border-stone-200 group ${className}`}
         >
             <div className="w-12 h-12 rounded-full border-2 border-mud-primary/30 flex items-center justify-center group-hover:border-mud-primary group-hover:scale-110 transition-all">
                <RefreshCw className="text-mud-primary/50 group-hover:text-mud-primary" size={20} />
             </div>
             <span className="mt-3 text-stone-500 text-[10px] font-mono uppercase group-hover:text-mud-primary tracking-wider">Initialize</span>
         </div>
     )
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
        <img 
            src={imageUrl} 
            alt={alt} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            style={{ objectPosition: 'center center' }} 
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none mix-blend-multiply"></div>
    </div>
  );
};

export default GeminiImage;