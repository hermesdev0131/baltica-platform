import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useCelebration } from '@/hooks/useCelebration';
import { Header } from '@/components/layout/Header';
import { StepIndicator, Step } from '@/components/journey/StepIndicator';
import { VideoPlayer } from '@/components/journey/VideoPlayer';
import { AudioPlayer } from '@/components/journey/AudioPlayer';
import { MoodSelector } from '@/components/journey/MoodSelector';
import { CelebrationModal } from '@/components/celebrations/CelebrationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Download, CheckCircle, Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type JourneyStep = Step;

const journeyContent = {
  1: {
    title: 'Comenzando tu viaje',
    message: 'Hoy es el primer paso. Estás aquí, y eso ya es un logro.',
    videoTitle: 'Bienvenida al programa',
    audioTitle: 'Respiración consciente',
    downloadTitle: 'Guía de inicio rápido',
    practice: 'Toma 3 respiraciones profundas antes de cada comida hoy.',
  },
  // Add more days...
};

const defaultContent = {
  title: 'Un nuevo día de crecimiento',
  message: 'Cada día es una oportunidad para ser un poco mejor.',
  videoTitle: 'Reflexión del día',
  audioTitle: 'Momento de calma',
  downloadTitle: 'Material del día',
  practice: 'Practica la gratitud: escribe 3 cosas por las que estás agradecido hoy.',
};

export default function JourneyPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const { t, progress, completeDay, totalDays } = useApp();
  const { sendAchievement } = useNotificationContext();
  const { celebration, closeCelebration, checkAndTriggerCelebration } = useCelebration();
  const [currentStep, setCurrentStep] = useState<JourneyStep>('start');
  const [selectedMood, setSelectedMood] = useState<string>();
  const [completedSteps, setCompletedSteps] = useState<JourneyStep[]>([]);

  const dayNumber = parseInt(day || '1', 10);
  const content = journeyContent[dayNumber as keyof typeof journeyContent] || defaultContent;

  const markStepComplete = (step: JourneyStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const nextStep = () => {
    const steps: JourneyStep[] = ['start', 'video', 'audio', 'download', 'survey', 'closure'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = () => {
    // Complete the day first
    completeDay(dayNumber);
    sendAchievement(dayNumber);
    
    // Calculate what the new streak will be after completion
    const today = new Date().toISOString().split('T')[0];
    let newStreak = progress.streak;
    if (progress.lastCompletedDate) {
      const lastDate = new Date(progress.lastCompletedDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak = progress.streak + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    
    const newCompletedDays = progress.completedDays.includes(dayNumber)
      ? progress.completedDays
      : [...progress.completedDays, dayNumber];
    
    // Trigger celebration based on achievements
    checkAndTriggerCelebration(newCompletedDays, newStreak, dayNumber, totalDays);
  };

  const handleCelebrationClose = () => {
    closeCelebration();
    navigate('/');
  };

  return (
    <>
      <CelebrationModal
        type={celebration.type}
        isOpen={celebration.isOpen}
        onClose={handleCelebrationClose}
        streakCount={celebration.streakCount}
        dayNumber={celebration.dayNumber}
      />
      
      <div className="min-h-screen bg-background">
        <Header />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Back Button & Day */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {t('journey.day')} {dayNumber}
          </span>
        </div>

        {/* Step Indicator */}
        {currentStep !== 'start' && currentStep !== 'closure' && (
          <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Start Screen */}
            {currentStep === 'start' && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 rounded-full gradient-warm flex items-center justify-center mx-auto mb-8 shadow-soft"
                >
                  <span className="text-4xl font-bold text-primary-foreground">{dayNumber}</span>
                </motion.div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {content.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  {content.message}
                </p>
                
                <Button size="lg" onClick={nextStep} className="gap-2 rounded-full px-8">
                  {t('journey.start')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Video Screen */}
            {currentStep === 'video' && (
              <div className="py-6">
                <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
                  {t('content.video')}
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  {content.videoTitle}
                </p>
                
                <VideoPlayer
                  title={content.videoTitle}
                  duration="1:30"
                  onComplete={() => markStepComplete('video')}
                />
                
                <div className="flex justify-center mt-8">
                  <Button onClick={nextStep} className="gap-2 rounded-full px-8">
                    {t('video.next')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Audio Screen */}
            {currentStep === 'audio' && (
              <div className="py-6">
                <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
                  {t('content.audio')}
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  {content.audioTitle}
                </p>
                
                <AudioPlayer
                  title={content.audioTitle}
                  subtitle={t('audio.title')}
                  duration="5:00"
                  onComplete={() => markStepComplete('audio')}
                />
                
                <div className="flex justify-center mt-8">
                  <Button onClick={nextStep} className="gap-2 rounded-full px-8">
                    {t('audio.next')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Download Screen */}
            {currentStep === 'download' && (
              <div className="py-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                  {t('content.download')}
                </h2>
                
                <Card className="shadow-card">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Download className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <CardTitle>{content.downloadTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-6">
                      Material complementario para tu práctica
                    </p>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Descargar PDF
                    </Button>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center mt-8">
                  <Button onClick={nextStep} className="gap-2 rounded-full px-8">
                    {t('common.next')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Survey Screen */}
            {currentStep === 'survey' && (
              <div className="py-6">
                <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
                  {t('survey.title')}
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  {t('survey.subtitle')}
                </p>
                
                <MoodSelector
                  onSelect={setSelectedMood as any}
                  selectedMood={selectedMood as any}
                />
                
                <div className="flex justify-center mt-10">
                  <Button 
                    onClick={nextStep} 
                    disabled={!selectedMood}
                    className="gap-2 rounded-full px-8"
                  >
                    {t('survey.submit')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Closure Screen */}
            {currentStep === 'closure' && (
              <div className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {t('closure.title')}
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {t('closure.subtitle')} {dayNumber}
                </p>
                
                {/* Practice Card */}
                <Card className="shadow-card mb-8 text-left">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-lg">{t('closure.practice.title')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-3">{content.practice}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('closure.practice.reminder')}
                    </p>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleComplete} size="lg" className="gap-2 rounded-full px-8">
                    {t('closure.next')}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2 rounded-full">
                    <Share2 className="h-4 w-4" />
                    {t('closure.share')}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      </div>
    </>
  );
}
