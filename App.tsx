import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Compass, Puzzle, Palette, Activity, Moon, Sun } from 'lucide-react';

import { Era, Creature } from './types';
import TimeRuler from './components/TimeRuler';

import HomeScreen from './screens/Home';
import EraExplorer from './screens/EraExplorer';
import CreatureProfile from './screens/CreatureProfile';
import QuizArea from './screens/QuizArea';
import CreativeLab from './screens/CreativeLab';

type View = 'home' | 'explore' | 'quiz' | 'create';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentEra, setCurrentEra] = useState<Era | null>(null);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleEraSelect = (era: Era) => {
    setCurrentEra(era);
    setCurrentView('explore');
  };

  const handleStart = () => {
    setCurrentView('explore');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen onStart={handleStart} />;
      case 'explore':
        return currentEra ? (
          <EraExplorer era={currentEra} onSelectCreature={setSelectedCreature} />
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 pt-20 dark:bg-earth-core bg-journal-bg transition-colors duration-500">
             <div className="w-24 h-24 border-4 dark:border-stone-800 border-stone-300 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                <Compass className="dark:text-stone-700 text-stone-400 w-10 h-10" />
             </div>
             <h2 className="text-3xl font-display dark:text-bone text-ink mb-2 uppercase tracking-wide">Select Strata Layer</h2>
             <p className="dark:text-stone-500 text-ink-light max-w-sm font-mono text-sm">Initiate time sequence via the geological ruler below.</p>
          </div>
        );
      case 'quiz':
        return <QuizArea />;
      case 'create':
        return <CreativeLab />;
      default:
        return <HomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-mud-primary selection:text-earth-core transition-colors duration-500 ${isDarkMode ? 'dark bg-earth-core text-bone' : 'bg-journal-bg text-ink'}`}>
      
      <main className="relative z-0">
        {renderContent()}
      </main>

      {selectedCreature && (
        <CreatureProfile 
          creature={selectedCreature} 
          onClose={() => setSelectedCreature(null)} 
        />
      )}

      {currentView !== 'home' && (
        <>
          {/* Top Nav - Adjusted opacity to be more readable but still glassy */}
          <nav className="fixed top-0 left-0 right-0 z-40 dark:bg-earth-core/85 bg-journal-paper/90 border-b dark:border-mud-primary/20 border-stone-300/50 backdrop-blur-xl px-6 h-16 flex items-center justify-between shadow-lg transition-colors duration-500">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('home')}>
               {/* NEW CUSTOM AMMONITE LOGO */}
               <div className="w-9 h-9 relative">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mud-primary w-full h-full drop-shadow-[0_0_5px_rgba(217,119,6,0.6)] group-hover:rotate-12 transition-transform duration-500">
                    {/* Spiral Shell Shape */}
                    <path d="M20.2 14.6l-1.6.9c-1.3.8-2.9 1.1-4.4.8-1.6-.4-2.9-1.4-3.7-2.9-.8-1.5-.8-3.3 0-4.8.9-1.5 2.5-2.5 4.2-2.5h.3" />
                    <path d="M16 10a4 4 0 0 0-7.8 1.2" />
                    <path d="M8.5 10a1.5 1.5 0 0 0 2.9 0" />
                    {/* Outer Circle Ring */}
                    <circle cx="12" cy="12" r="10" className="opacity-30" />
                  </svg>
               </div>
               <span className="font-display font-bold text-xl tracking-wider dark:text-bone text-ink hidden md:block group-hover:text-mud-primary transition-colors">TIME TREK</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex dark:bg-stone-900/50 bg-white/50 border dark:border-stone-700 border-stone-300 p-1 gap-1 rounded-full shadow-sm backdrop-blur-md">
                 <NavButton active={currentView === 'explore'} onClick={() => setCurrentView('explore')} icon={<Compass size={16}/>} label="EXPLORE" />
                 <NavButton active={currentView === 'quiz'} onClick={() => setCurrentView('quiz')} icon={<Puzzle size={16}/>} label="TEST" />
                 <NavButton active={currentView === 'create'} onClick={() => setCurrentView('create')} icon={<Palette size={16}/>} label="LAB" />
              </div>
              
              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-stone-800 bg-stone-200 dark:text-mud-primary text-stone-600 hover:scale-110 transition-transform shadow-sm"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </nav>

          {/* Time Ruler (Only on Explore) */}
          {currentView === 'explore' && (
             <TimeRuler 
               currentEraId={currentEra?.id || null} 
               onSelectEra={handleEraSelect} 
             />
          )}
        </>
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full ${
      active 
        ? 'dark:bg-mud-primary bg-mud-primary text-white shadow-md' 
        : 'dark:text-stone-400 text-stone-500 hover:text-mud-primary'
    }`}
  >
    {icon}
    <span className="hidden sm:block">{label}</span>
  </button>
);

export default App;