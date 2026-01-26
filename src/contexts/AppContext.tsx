import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, getTranslation, TranslationKey } from '@/lib/i18n';

interface JourneyProgress {
  currentDay: number;
  completedDays: number[];
  currentStep: 'start' | 'video' | 'audio' | 'download' | 'survey' | 'closure';
  streak: number;
  lastCompletedDate: string | null;
}

interface AppContextType {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Journey
  progress: JourneyProgress;
  setCurrentDay: (day: number) => void;
  setCurrentStep: (step: JourneyProgress['currentStep']) => void;
  completeDay: (day: number) => void;
  totalDays: number;
  
  // User
  userName: string;
  setUserName: (name: string) => void;
}

const defaultProgress: JourneyProgress = {
  currentDay: 1,
  completedDays: [],
  currentStep: 'start',
  streak: 0,
  lastCompletedDate: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    if (saved && ['es-ES', 'es-LATAM', 'en'].includes(saved)) {
      return saved as Locale;
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('es')) {
      return browserLang.includes('ES') ? 'es-ES' : 'es-LATAM';
    }
    return 'en';
  });
  
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
  });
  
  const [progress, setProgress] = useState<JourneyProgress>(() => {
    const saved = localStorage.getItem('journeyProgress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });
  
  const totalDays = 21;

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save locale
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  // Save progress
  useEffect(() => {
    localStorage.setItem('journeyProgress', JSON.stringify(progress));
  }, [progress]);

  // Save username
  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  const t = (key: TranslationKey): string => getTranslation(locale, key);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  };

  const setCurrentDay = (day: number) => {
    setProgress(prev => ({ ...prev, currentDay: day }));
  };

  const setCurrentStep = (step: JourneyProgress['currentStep']) => {
    setProgress(prev => ({ ...prev, currentStep: step }));
  };

  const completeDay = (day: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setProgress(prev => {
      const newCompletedDays = prev.completedDays.includes(day) 
        ? prev.completedDays 
        : [...prev.completedDays, day];
      
      // Calculate streak
      let newStreak = prev.streak;
      if (prev.lastCompletedDate) {
        const lastDate = new Date(prev.lastCompletedDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak = prev.streak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        completedDays: newCompletedDays,
        currentDay: Math.min(day + 1, totalDays),
        currentStep: 'start',
        streak: newStreak,
        lastCompletedDate: today,
      };
    });
  };

  return (
    <AppContext.Provider value={{
      locale,
      setLocale,
      t,
      theme,
      setTheme,
      progress,
      setCurrentDay,
      setCurrentStep,
      completeDay,
      totalDays,
      userName,
      setUserName,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
