import { useApp } from '@/contexts/AppContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProgressRing } from '@/components/journey/ProgressRing';
import { DayCard } from '@/components/journey/DayCard';
import { ArrowRight, Clock, Heart, Sparkles, ShieldAlert, Mail } from 'lucide-react';
import BalticaLogo from '@/components/brand/BalticaLogo';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { t, locale, progress, totalDays, userName, setUserName, userEmail, paymentCompleted } = useApp();
  const { getUserStatus } = useAdmin();
  const navigate = useNavigate();
  const userStatus = getUserStatus(userEmail);
  const isSuspended = userStatus?.status === 'suspended';
  const isExpired = userStatus?.status === 'expired';
  const canAccessJourney = paymentCompleted && !isSuspended && !isExpired;
  
  const hasStarted = progress.completedDays.length > 0;
  const programComplete = progress.completedDays.includes(3);
  const progressPercent = (progress.completedDays.length / (totalDays + 1)) * 100;
  
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
        {/* Status Banner */}
        {isSuspended && (
          <Alert className="mb-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <AlertDescription className="flex items-center justify-between">
              <span>{t('status.suspended')}</span>
              <a href="mailto:help@baltica.app" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline ml-2">
                <Mail className="h-3 w-3" /> {t('status.contactSupport')}
              </a>
            </AlertDescription>
          </Alert>
        )}
        {isExpired && (
          <Alert className="mb-6 border-red-200 bg-red-50/50 dark:bg-red-950/20">
            <Clock className="h-4 w-4 text-red-600" />
            <AlertDescription className="flex items-center justify-between">
              <span>{t('status.expired')}</span>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate('/payment')}>
                {t('status.repay')}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {!paymentCompleted && !isSuspended && !isExpired && (
          <Alert className="mb-6 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <ShieldAlert className="h-4 w-4 text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
              <span>{locale.startsWith('es') ? 'Completa tu pago para acceder al programa.' : 'Complete your payment to access the program.'}</span>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate('/payment')}>
                {locale.startsWith('es') ? 'Ir a pagar' : 'Go to payment'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
                <BalticaLogo variant="isotipo" size={80} className="mx-auto" />
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
              disabled={!canAccessJourney}
              onClick={() => !canAccessJourney ? navigate('/payment') : programComplete ? navigate('/progress') : navigate(`/journey/${progress.currentDay}`)}
            >
              {programComplete
                ? (locale.startsWith('es') ? 'Ver mi progreso' : 'See my progress')
                : hasStarted ? t('welcome.continue') : t('welcome.cta')}
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
              { icon: Heart, title: '3 días', desc: 'Un programa que transforma' },
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

        {/* Day Grid - MVP 4 days (Welcome + 3 days) */}
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
            <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
              {Array.from({ length: totalDays + 1 }, (_, i) => i).map(day => (
                <DayCard
                  key={day}
                  day={day}
                  status={canAccessJourney ? getDayStatus(day) : 'locked'}
                  onClick={() => canAccessJourney && getDayStatus(day) !== 'locked' && navigate(`/journey/${day}`)}
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
