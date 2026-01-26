import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  title: string;
  subtitle?: string;
  duration: string;
  onComplete?: () => void;
}

export function AudioPlayer({ title, subtitle, duration, onComplete }: AudioPlayerProps) {
  const { t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            onComplete?.();
            return 100;
          }
          const newProgress = prev + 0.5;
          setCurrentTime(formatTime((newProgress / 100) * 300)); // Assume 5 min audio
          return newProgress;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Visualization */}
      <div className="relative h-48 mb-8 flex items-center justify-center">
        {/* Animated circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-primary/30"
            initial={{ width: 80, height: 80, opacity: 0.5 }}
            animate={isPlaying ? {
              width: [80 + i * 40, 120 + i * 60, 80 + i * 40],
              height: [80 + i * 40, 120 + i * 60, 80 + i * 40],
              opacity: [0.3, 0.1, 0.3],
            } : {}}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* Center button */}
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative z-10 w-24 h-24 rounded-full gradient-warm flex items-center justify-center shadow-soft"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause className="h-10 w-10 text-primary-foreground" />
          ) : (
            <Play className="h-10 w-10 text-primary-foreground ml-1" />
          )}
        </motion.button>
      </div>

      {/* Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={([val]) => {
            setProgress(val);
            setCurrentTime(formatTime((val / 100) * 300));
          }}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => setProgress(Math.max(0, progress - 10))}
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-16 w-16 rounded-full"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => setProgress(Math.min(100, progress + 10))}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
