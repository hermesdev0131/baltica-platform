import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'struggling';

interface MoodSelectorProps {
  onSelect: (mood: Mood) => void;
  selectedMood?: Mood;
}

const moods: { key: Mood; emoji: string; color: string }[] = [
  { key: 'great', emoji: '😊', color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' },
  { key: 'good', emoji: '🙂', color: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700' },
  { key: 'okay', emoji: '😐', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700' },
  { key: 'low', emoji: '😔', color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700' },
  { key: 'struggling', emoji: '😢', color: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' },
];

export function MoodSelector({ onSelect, selectedMood }: MoodSelectorProps) {
  const { t } = useApp();

  return (
    <div className="grid grid-cols-5 gap-3 w-full max-w-md mx-auto">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.key}
          onClick={() => onSelect(mood.key)}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
            mood.color,
            selectedMood === mood.key && 'ring-2 ring-primary ring-offset-2',
            selectedMood && selectedMood !== mood.key && 'opacity-50'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="text-xs font-medium text-foreground">
            {t(`mood.${mood.key}` as any)}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
