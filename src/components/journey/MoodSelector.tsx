import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'struggling';

interface MoodSelectorProps {
  onSelect: (mood: Mood) => void;
  selectedMood?: Mood;
}

// Using brand-aligned colors with subtle mood indicators
const moods: { key: Mood; emoji: string; color: string }[] = [
  { key: 'great', emoji: '😊', color: 'bg-accent/30 dark:bg-accent/20 border-accent/50' },
  { key: 'good', emoji: '🙂', color: 'bg-primary/20 dark:bg-primary/15 border-primary/40' },
  { key: 'okay', emoji: '😐', color: 'bg-muted border-border' },
  { key: 'low', emoji: '😔', color: 'bg-secondary/20 dark:bg-secondary/15 border-secondary/40' },
  { key: 'struggling', emoji: '😢', color: 'bg-destructive/10 dark:bg-destructive/15 border-destructive/30' },
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
