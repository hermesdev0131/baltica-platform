import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/journey/ProgressRing';
import { DayCard } from '@/components/journey/DayCard';
import { ArrowRight, Sparkles, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { t, progress, totalDays, userName, setUserName } = useApp();
  const navigate = useNavigate();
  
  const hasStarted = progress.completedDays.length > 0;
  const progressPercent = (progress.completedDays.length / totalDays) * 100;
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('journey.greeting.morning');
    if (hour < 18) return t('journey.greeting.afternoon');
    return t('journey.greeting.evening');
  };

  const getDayStatus = (day: number): 'completed' | 'current' | 'locked' => {
    if (progress.completedDays.includes(day)) return 'completed';
    if (day === progress.currentDay) return 'current';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <motion.section 
          className="text-center py-12 md:py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {hasStarted ? (
            <>
              <p className="text-lg text-muted-foreground mb-2">
                {getGreeting()}{userName && `, ${userName}`}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                {t('journey.day')} {progress.currentDay} {t('journey.of')} {totalDays}
              </h1>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-block mb-6"
              >
                <div className="h-20 w-20 rounded-full gradient-warm flex items-center justify-center mx-auto shadow-soft">
                  <Sparkles className="h-10 w-10 text-primary-foreground" />
                </div>
              </motion.div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {t('welcome.title')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
                {t('welcome.subtitle')}
              </p>
            </>
          )}

          {/* Progress Ring */}
          {hasStarted && (
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ProgressRing progress={progressPercent} size={160} strokeWidth={12}>
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">
                    {progress.completedDays.length}
                  </span>
                  <span className="text-muted-foreground text-sm block">
                    / {totalDays}
                  </span>
                </div>
              </ProgressRing>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="gap-2 px-8 py-6 text-lg rounded-full shadow-soft"
              onClick={() => navigate(`/journey/${progress.currentDay}`)}
            >
              {hasStarted ? t('welcome.continue') : t('welcome.cta')}
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              {t('welcome.tagline')}
            </p>
          </motion.div>
        </motion.section>

        {/* Features */}
        {!hasStarted && (
          <motion.section 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: Clock, title: '10 min', desc: 'Experiencias diarias breves' },
              { icon: Heart, title: '21 días', desc: 'Un hábito que transforma' },
              { icon: Sparkles, title: 'Tu ritmo', desc: 'Avanza a tu manera' },
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-card rounded-2xl p-6 text-center shadow-card"
              >
                <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </motion.section>
        )}

        {/* Day Grid */}
        {hasStarted && (
          <motion.section 
            className="py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              {t('progress.title')}
            </h2>
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                <DayCard
                  key={day}
                  day={day}
                  status={getDayStatus(day)}
                  onClick={() => getDayStatus(day) !== 'locked' && navigate(`/journey/${day}`)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Streak */}
        {progress.streak > 0 && (
          <motion.div 
            className="mt-8 p-6 bg-accent/30 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-lg font-medium text-foreground">
              🔥 {progress.streak} {t('progress.days')} {t('progress.streak').toLowerCase()}
            </p>
            <p className="text-muted-foreground">{t('progress.keep')}</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
