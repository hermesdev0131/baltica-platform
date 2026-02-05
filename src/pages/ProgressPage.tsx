import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/layout/Header';
import { ProgressRing } from '@/components/journey/ProgressRing';
import { DayCard } from '@/components/journey/DayCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Flame, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProgressPage() {
  const { t, progress, totalDays } = useApp();
  const navigate = useNavigate();
  
  const progressPercent = (progress.completedDays.length / totalDays) * 100;

  const getDayStatus = (day: number): 'completed' | 'current' | 'locked' => {
    if (progress.completedDays.includes(day)) return 'completed';
    if (day === progress.currentDay) return 'current';
    return 'locked';
  };

  const stats = [
    {
      icon: Calendar,
      value: progress.completedDays.length,
      label: t('progress.completed'),
      color: 'text-primary'
    },
    {
      icon: Flame,
      value: progress.streak,
      label: t('progress.streak'),
      color: 'text-orange-500'
    },
    {
      icon: TrendingUp,
      value: `${Math.round(progressPercent)}%`,
      label: t('progress.totalPercent' as any),
      color: 'text-green-500'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title */}
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('progress.title')}
        </motion.h1>

        {/* Progress Ring */}
        <motion.div 
          className="flex justify-center mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressRing progress={progressPercent} size={200} strokeWidth={16}>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">
                {progress.completedDays.length}
              </span>
              <span className="text-muted-foreground text-lg block">
                / {totalDays} {t('progress.days')}
              </span>
            </div>
          </ProgressRing>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Day Grid - MVP 4 days (Welcome + 3 days) */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('progress.yourJourney' as any)}
          </h2>
          <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
            {Array.from({ length: totalDays + 1 }, (_, i) => i).map(day => (
              <DayCard
                key={day}
                day={day}
                status={getDayStatus(day)}
                onClick={() => getDayStatus(day) !== 'locked' && navigate(`/journey/${day}`)}
              />
            ))}
          </div>
        </motion.section>

        {/* Achievement - Program Complete */}
        {progress.completedDays.length >= 3 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Trophy className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">¡Programa completado!</h3>
                  <p className="text-sm text-muted-foreground">
                    Has demostrado compromiso con tu bienestar
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
