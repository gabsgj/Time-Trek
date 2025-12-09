

import React, { useState, useEffect, useRef } from 'react';
import { generateImage } from '../services/geminiService';
import { Loader2, RefreshCw, Bone } from 'lucide-react';

interface GeminiImageProps {
  prompt: string;
  alt: string;
  className?: string;
  autoGenerate?: boolean;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4' | '9:16';
}

// 1. In-Memory Cache (Fastest, per session)
const memoryCache: Record<string, string> = {};

// 2. Local Storage Cache (Persistent, simulates saving files)
const STORAGE_PREFIX = 'timetrek_img_';

const saveToStorage = (key: string, dataUrl: string) => {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, dataUrl);
    } catch (e) {
        // Local storage full, ignore
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
  const cacheKey = `${prompt}_${aspectRatio}`;
  
  // Try memory -> try storage -> null
  const cached = memoryCache[cacheKey] || getFromStorage(cacheKey);
  
  const [imageUrl, setImageUrl] = useState<string | null>(cached);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // LAZY LOAD: Intersection Observer
  useEffect(() => {
    // If we already have the image, no need to observe
    if (imageUrl) {
        setIsVisible(true);
        return;
    }

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
        }
    }, { rootMargin: '200px' }); // Load when item is 200px away from viewport

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [imageUrl]);

  const fetchImage = async () => {
    // Double check cache before fetching (in case another component fetched it meanwhile)
    const currentCache = memoryCache[cacheKey] || getFromStorage(cacheKey);
    if (currentCache) {
        setImageUrl(currentCache);
        return;
    }

    setLoading(true);
    setError(false);
    
    // Add a small artificial delay to prevent flicker
    if (error) await new Promise(r => setTimeout(r, 500));

    const result = await generateImage(prompt, aspectRatio);
    
    if (result) {
      memoryCache[cacheKey] = result;
      saveToStorage(cacheKey, result);
      setImageUrl(result);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only auto-generate if Visible on screen AND no image exists
    if (autoGenerate && isVisible && !imageUrl && !loading && !error) {
      fetchImage();
    }
  }, [prompt, autoGenerate, aspectRatio, isVisible]);

  // FALLBACK UI: If error (e.g. Quota Exceeded), show a stylized placeholder
  if (error) {
    return (
      <div ref={containerRef} className={`relative flex flex-col items-center justify-center dark:bg-stone-900 bg-stone-200 overflow-hidden group ${className}`}>
         <div className="absolute inset-0 opacity-10 dark:bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
         <div className="z-10 text-stone-400 dark:text-stone-600 flex flex-col items-center p-4 text-center transition-colors group-hover:text-mud-primary/70">
             <div className="mb-2 p-3 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700">
                <Bone size={24} className="opacity-70" />
             </div>
             <span className="text-[10px] uppercase font-mono tracking-widest opacity-70 font-bold">
                 Fossil Record Only
             </span>
         </div>
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
      <div ref={containerRef} className={`flex flex-col items-center justify-center dark:bg-earth-core bg-white relative overflow-hidden ${className}`}>
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
            ref={containerRef}
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
    <div ref={containerRef} className={`relative overflow-hidden group ${className}`}>
        <img 
            src={imageUrl} 
            alt={alt} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            style={{ objectPosition: 'center center' }} 
        />
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none mix-blend-multiply"></div>
    </div>
  );
};

export default GeminiImage;