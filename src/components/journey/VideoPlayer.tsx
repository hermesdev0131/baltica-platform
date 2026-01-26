import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  title: string;
  duration: string;
  thumbnailUrl?: string;
  onComplete?: () => void;
}

export function VideoPlayer({ title, duration, thumbnailUrl, onComplete }: VideoPlayerProps) {
  const { t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            onComplete?.();
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  return (
    <div 
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted shadow-soft"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      {/* Thumbnail/Video */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-calm flex items-center justify-center">
            <Play className="h-16 w-16 text-primary opacity-30" />
          </div>
        )}
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:bg-primary transition-colors">
            <Play className="h-8 w-8 text-primary-foreground ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[progress]}
            max={100}
            step={1}
            onValueChange={([val]) => setProgress(val)}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-white/80">{duration}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
