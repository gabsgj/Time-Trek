import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { CheckCircle, XCircle, Trophy, RefreshCcw, Star, Flame } from 'lucide-react';

const QuizArea: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = QUIZZES[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === currentQ.correctAnswer) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < QUIZZES.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="pt-24 pb-24 px-4 min-h-screen flex items-center justify-center dark:bg-earth-core bg-journal-bg transition-colors duration-500">
        <div className="dark:bg-stone-900 bg-white p-10 rounded-3xl border dark:border-stone-800 border-stone-200 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          {/* Confetti / bg effect */}
          <div className="absolute inset-0 dark:bg-dirt-pattern bg-paper-texture opacity-10 pointer-events-none"></div>

          <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce">
              <Trophy className="w-12 h-12 text-yellow-900" />
          </div>

          <h2 className="text-4xl font-display dark:text-bone text-ink mb-2">Mission Complete!</h2>
          <p className="dark:text-stone-400 text-stone-500 mb-8 font-mono">Final Score: <span className="text-mud-primary font-bold">{score}/{QUIZZES.length}</span></p>
          
          <div className="w-full dark:bg-stone-800 bg-stone-200 rounded-full h-6 mb-8 overflow-hidden relative">
            <div 
              className="bg-mud-primary h-full transition-all duration-1000 flex items-center justify-center" 
              style={{ width: `${(score / QUIZZES.length) * 100}%` }}
            >
                <span className="text-[10px] font-bold text-white px-2">Accuracy</span>
            </div>
          </div>

          <button 
            onClick={restartQuiz}
            className="w-full py-4 bg-mud-primary hover:bg-mud-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg uppercase tracking-wider text-sm"
          >
            <RefreshCcw size={18} /> Replay Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 min-h-screen flex flex-col items-center max-w-2xl mx-auto dark:bg-earth-core bg-journal-bg transition-colors duration-500">
      
      {/* HUD Stats */}
      <div className="w-full flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-2">
             <span className="text-xs font-bold uppercase tracking-widest dark:text-stone-500 text-stone-400">Progress</span>
             <span className="text-xl font-display dark:text-bone text-ink">{currentQuestionIndex + 1}<span className="text-stone-500">/{QUIZZES.length}</span></span>
        </div>
        
        {streak > 1 && (
            <div className="flex items-center gap-2 animate-pulse text-orange-500 font-bold uppercase text-xs tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                <Flame size={14} /> Streak x{streak}
            </div>
        )}
      </div>

      <div className="w-full dark:bg-stone-900 bg-white p-8 rounded-3xl border dark:border-stone-800 border-stone-200 shadow-xl relative overflow-hidden min-h-[400px] flex flex-col justify-center">
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 h-1.5 dark:bg-stone-800 bg-stone-200 w-full">
           <div className="h-full bg-mud-primary transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / QUIZZES.length) * 100}%` }}></div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold dark:text-bone text-ink mb-8 leading-snug text-center">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let stateClass = "dark:bg-stone-800 bg-stone-100 hover:dark:bg-stone-700 hover:bg-stone-200 border-transparent dark:text-bone text-ink";
            
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) stateClass = "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400";
              else if (idx === selectedOption) stateClass = "bg-red-500/20 border-red-500 text-red-600 dark:text-red-400";
              else stateClass = "opacity-50 dark:bg-stone-800 bg-stone-100 dark:text-stone-500 text-stone-400";
            } else if (selectedOption === idx) {
              stateClass = "bg-mud-primary border-mud-primary text-white";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border-2 text-left font-bold text-lg transition-all flex justify-between items-center transform ${!isAnswered && 'hover:scale-[1.02]'} ${stateClass}`}
              >
                {option}
                {isAnswered && idx === currentQ.correctAnswer && <CheckCircle className="text-green-500" size={24}/>}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="text-red-500" size={24}/>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="dark:bg-earth-dark bg-stone-50 p-4 rounded-xl dark:text-stone-300 text-stone-600 text-sm mb-4 border dark:border-stone-700 border-stone-200">
              <span className="font-bold text-mud-primary uppercase text-xs block mb-1 flex items-center gap-2"><Star size={12}/> Fact File</span>
              {currentQ.explanation}
            </div>
            <button 
              onClick={nextQuestion}
              className="w-full py-4 bg-mud-primary hover:bg-mud-accent text-white rounded-xl font-bold transition-all shadow-lg text-lg uppercase tracking-wide flex items-center justify-center"
            >
              Next Challenge &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizArea;