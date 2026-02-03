import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useCelebration } from '@/hooks/useCelebration';
import { useInactivity } from '@/hooks/useInactivity';
import { Header } from '@/components/layout/Header';
import { StepIndicator, Step } from '@/components/journey/StepIndicator';
import { VideoPlayer } from '@/components/journey/VideoPlayer';
import { AudioPlayer } from '@/components/journey/AudioPlayer';
import { MoodSelector } from '@/components/journey/MoodSelector';
import { EnergySelector, Energy } from '@/components/journey/EnergySelector';
import { EthicalNote } from '@/components/EthicalNote';
import { EthicalFooter } from '@/components/EthicalFooter';
import { FloatingHelp } from '@/components/FloatingHelp';
import { InactivityModal } from '@/components/InactivityModal';
import { CelebrationModal } from '@/components/celebrations/CelebrationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Download, CheckCircle, Share2, Sparkles } from 'lucide-react';
import BalticaLogo from '@/components/brand/BalticaLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { dayContents, actionOptions, valueOptions, timeSlotOptions } from '@/config/content';

type JourneyStep = Step;

export default function JourneyPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const { t, locale, progress, completeDay, totalDays, dayAnswers, saveDayAnswers } = useApp();
  const { sendAchievement } = useNotificationContext();
  const { celebration, closeCelebration, checkAndTriggerCelebration } = useCelebration();
  const [currentStep, setCurrentStep] = useState<JourneyStep>('start');
  const [completedSteps, setCompletedSteps] = useState<JourneyStep[]>([]);

  const dayNumber = parseInt(day || '0', 10);
  const dayContent = dayContents[dayNumber];
  const localeKey = locale as 'es-LATAM' | 'es-ES' | 'en';

  // Local form state for each day's exercises
  const [selectedMood, setSelectedMood] = useState<string>(
    dayNumber === 0 ? (dayAnswers.welcome?.mood || '') : (dayAnswers.day3?.mood || '')
  );
  const [words, setWords] = useState<[string, string, string]>(
    dayAnswers.day1?.words || ['', '', '']
  );
  const [selectedAction, setSelectedAction] = useState(dayAnswers.day1?.action || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(dayAnswers.day1?.timeSlot || '');
  const [selectedValue, setSelectedValue] = useState(dayAnswers.day2?.value || '');
  const [customValue, setCustomValue] = useState(dayAnswers.day2?.customValue || '');
  const [day2Action, setDay2Action] = useState(dayAnswers.day2?.action || '');
  const [day2TimeSlot, setDay2TimeSlot] = useState(dayAnswers.day2?.timeSlot || '');
  const [wordsAfter, setWordsAfter] = useState<[string, string, string]>(
    dayAnswers.day2?.wordsAfter || ['', '', '']
  );
  const [gratitudes, setGratitudes] = useState<[string, string, string]>(
    dayAnswers.day3?.gratitudes || ['', '', '']
  );
  const [kindPhrase, setKindPhrase] = useState(dayAnswers.day3?.kindPhrase || '');
  const [nextAction, setNextAction] = useState(dayAnswers.day3?.nextAction || '');

  // Energy state for Day 0 and Day 3 (second measurement item per client spec)
  const [selectedEnergy, setSelectedEnergy] = useState<Energy | ''>(
    dayNumber === 0 ? (dayAnswers.welcome?.energy || '') : (dayAnswers.day3?.energy || '')
  );

  // Inactivity modal state
  const [showInactivityModal, setShowInactivityModal] = useState(false);

  // Inactivity detection - show reminder after 5 minutes of inactivity
  const { resetTimer } = useInactivity({
    timeout: 5 * 60 * 1000, // 5 minutes
    onInactive: () => setShowInactivityModal(true),
    enabled: currentStep !== 'closure', // Don't track on closure step
  });

  const markStepComplete = (step: JourneyStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const nextStep = () => {
    // Day 0 (Block 0) per PDF spec: greeting → measurements → ethical → CTA (no video/audio/download)
    // Days 1-3: full flow with video, audio, download, survey
    const steps: JourneyStep[] = dayNumber === 0
      ? ['start', 'survey', 'closure']
      : ['start', 'video', 'audio', 'download', 'survey', 'closure'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const canProceedFromSurvey = (): boolean => {
    switch (dayNumber) {
      case 0:
        return !!selectedMood && !!selectedEnergy;
      case 1:
        return words.every(w => w.trim()) && !!selectedAction && !!selectedTimeSlot;
      case 2:
        return (!!selectedValue || !!customValue.trim()) && !!day2Action.trim() && !!day2TimeSlot;
      case 3:
        return !!selectedMood && !!selectedEnergy && gratitudes.every(g => g.trim()) && !!kindPhrase.trim() && !!nextAction.trim();
      default:
        return true;
    }
  };

  const saveCurrentAnswers = () => {
    const now = new Date().toISOString();
    switch (dayNumber) {
      case 0:
        saveDayAnswers({ welcome: { mood: selectedMood, energy: selectedEnergy as Energy, ethicalNoteViewed: true, completedAt: now } });
        break;
      case 1:
        saveDayAnswers({ day1: { words, action: selectedAction, timeSlot: selectedTimeSlot as any, videoWatched: true, audioCompleted: true, completedAt: now } });
        break;
      case 2:
        saveDayAnswers({ day2: { value: selectedValue || customValue, customValue, action: day2Action, timeSlot: day2TimeSlot as any, wordsAfter, videoWatched: true, audioCompleted: true, completedAt: now } });
        break;
      case 3:
        saveDayAnswers({ day3: { mood: selectedMood, energy: selectedEnergy as Energy, gratitudes, kindPhrase, nextAction, videoWatched: true, audioCompleted: true, completedAt: now } });
        break;
    }
  };

  const handleComplete = () => {
    saveCurrentAnswers();
    completeDay(dayNumber);
    sendAchievement(dayNumber);

    const today = new Date().toISOString().split('T')[0];
    let newStreak = progress.streak;
    if (progress.lastCompletedDate) {
      const lastDate = new Date(progress.lastCompletedDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak = progress.streak + 1;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    const newCompletedDays = progress.completedDays.includes(dayNumber)
      ? progress.completedDays
      : [...progress.completedDays, dayNumber];

    checkAndTriggerCelebration(newCompletedDays, newStreak, dayNumber, totalDays);
  };

  const handleCelebrationClose = () => {
    closeCelebration();
    navigate('/');
  };

  const getDayTitle = (): string => {
    if (dayContent) return dayContent.title[localeKey];
    return `${t('journey.day')} ${dayNumber}`;
  };

  const getDaySubtitle = (): string => {
    if (dayContent) return dayContent.subtitle[localeKey];
    return '';
  };

  const getDayLabel = (): string => {
    if (dayNumber === 0) return t('day.0.title');
    return `${t('journey.day')} ${dayNumber}`;
  };

  // Render survey content based on day
  const renderSurveyContent = () => {
    switch (dayNumber) {
      case 0: return renderWelcomeSurvey();
      case 1: return renderDay1Survey();
      case 2: return renderDay2Survey();
      case 3: return renderDay3Survey();
      default: return null;
    }
  };

  const renderWelcomeSurvey = () => (
    <div className="py-6 space-y-8">
      <EthicalNote variant="inline" />

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
          {t('day.0.checkin')}
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          {locale.startsWith('es')
            ? 'Tu respuesta es solo para ti. No hay respuestas correctas o incorrectas.'
            : 'Your answer is just for you. There are no right or wrong answers.'}
        </p>
        <MoodSelector onSelect={setSelectedMood as any} selectedMood={selectedMood as any} />
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4 text-center">
          {t('energy.title' as any)}
        </h3>
        <EnergySelector onSelect={setSelectedEnergy} selectedEnergy={selectedEnergy} />
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={nextStep} disabled={!canProceedFromSurvey()} className="gap-2 rounded-full px-8">
          {t('welcome.block0.ready')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDay1Survey = () => (
    <div className="py-6 space-y-8">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.1.words.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('day.1.words.instruction')}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map(i => (
            <Input
              key={i}
              placeholder={locale.startsWith('es')
                ? `${['Primera', 'Segunda', 'Tercera'][i]} palabra`
                : `${['First', 'Second', 'Third'][i]} word`}
              value={words[i]}
              onChange={e => {
                const newWords = [...words] as [string, string, string];
                newWords[i] = e.target.value;
                setWords(newWords);
              }}
              className="text-center"
            />
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.1.action.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAction} onValueChange={setSelectedAction}>
            {actionOptions[localeKey].map(option => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={option.value} id={`action-${option.value}`} />
                <Label htmlFor={`action-${option.value}`} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.1.timeslot')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
            {timeSlotOptions[localeKey].map(option => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={option.value} id={`time-${option.value}`} />
                <Label htmlFor={`time-${option.value}`} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button onClick={nextStep} disabled={!canProceedFromSurvey()} className="gap-2 rounded-full px-8">
          {t('survey.submit')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDay2Survey = () => (
    <div className="py-6 space-y-8">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.2.value.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('day.2.value.instruction')}</p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedValue} onValueChange={(v) => { setSelectedValue(v); setCustomValue(''); }}>
            {valueOptions[localeKey].map(option => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={option.value} id={`value-${option.value}`} />
                <Label htmlFor={`value-${option.value}`} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="other" id="value-other" />
              <Label htmlFor="value-other" className="cursor-pointer">{t('day.2.value.other')}</Label>
            </div>
          </RadioGroup>
          {selectedValue === 'other' && (
            <Input className="mt-3" placeholder={t('day.2.value.other')} value={customValue} onChange={e => setCustomValue(e.target.value)} />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.2.action.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('day.2.action.instruction')}</p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={locale.startsWith('es') ? 'Escribe tu acción...' : 'Write your action...'}
            value={day2Action} onChange={e => setDay2Action(e.target.value)} rows={3}
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.1.timeslot')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={day2TimeSlot} onValueChange={setDay2TimeSlot}>
            {timeSlotOptions[localeKey].map(option => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={option.value} id={`d2time-${option.value}`} />
                <Label htmlFor={`d2time-${option.value}`} className="cursor-pointer flex-1">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.2.words.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('day.2.words.instruction')}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map(i => (
            <Input
              key={i}
              placeholder={locale.startsWith('es')
                ? `${['Primera', 'Segunda', 'Tercera'][i]} palabra`
                : `${['First', 'Second', 'Third'][i]} word`}
              value={wordsAfter[i]}
              onChange={e => {
                const newWords = [...wordsAfter] as [string, string, string];
                newWords[i] = e.target.value;
                setWordsAfter(newWords);
              }}
              className="text-center"
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button onClick={nextStep} disabled={!canProceedFromSurvey()} className="gap-2 rounded-full px-8">
          {t('survey.submit')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDay3Survey = () => (
    <div className="py-6 space-y-8">
      {/* 3.4: Ejercicio interactivo (gratitudes + phrase + action) - FIRST per PDF */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.3.gratitude.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('day.3.gratitude.instruction')}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map(i => (
            <Input
              key={i}
              placeholder={locale.startsWith('es')
                ? `${['Primera', 'Segunda', 'Tercera'][i]} gratitud...`
                : `${['First', 'Second', 'Third'][i]} gratitude...`}
              value={gratitudes[i]}
              onChange={e => {
                const g = [...gratitudes] as [string, string, string];
                g[i] = e.target.value;
                setGratitudes(g);
              }}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.3.phrase.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('day.3.phrase.instruction')}</p>
        </CardHeader>
        <CardContent>
          <Textarea placeholder={t('day.3.phrase.placeholder')} value={kindPhrase} onChange={e => setKindPhrase(e.target.value)} rows={3} />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('day.3.next.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('day.3.next.instruction')}</p>
        </CardHeader>
        <CardContent>
          <Textarea placeholder={t('day.3.next.placeholder')} value={nextAction} onChange={e => setNextAction(e.target.value)} rows={2} />
        </CardContent>
      </Card>

      {/* 3.5: Medición 1 (mood) - AFTER exercises per PDF */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2 text-center">{t('survey.title')}</h2>
        <MoodSelector onSelect={setSelectedMood as any} selectedMood={selectedMood as any} />
      </div>

      {/* 3.6: Medición 2 (energy) */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4 text-center">
          {t('energy.title' as any)}
        </h3>
        <EnergySelector onSelect={setSelectedEnergy} selectedEnergy={selectedEnergy} />
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={nextStep} disabled={!canProceedFromSurvey()} className="gap-2 rounded-full px-8">
          {t('survey.submit')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const getClosureMessage = (): string => {
    const isSpanish = locale.startsWith('es');
    switch (dayNumber) {
      case 0:
        return isSpanish
          ? 'Los próximos 3 días serán tu momento de pausa. No hay forma correcta de hacerlo. Solo estar presente.'
          : 'The next 3 days will be your moment of pause. There is no right way to do it. Just be present.';
      case 1:
        return isSpanish ? 'Cada pequeño paso cuenta. Nos vemos mañana.' : 'Every small step counts. See you tomorrow.';
      case 2:
        return isSpanish
          ? 'Actuar desde tus valores te conecta contigo. Nos vemos mañana para cerrar este viaje.'
          : 'Acting from your values connects you with yourself. See you tomorrow to close this journey.';
      case 3:
        return isSpanish
          ? 'Gracias por completar este viaje. Recuerda: este programa es educativo. Si necesitas apoyo profesional, no dudes en buscarlo.'
          : 'Thank you for completing this journey. Remember: this program is educational. If you need professional support, do not hesitate to seek it.';
      default:
        return '';
    }
  };

  const getClosureTitle = (): string => {
    if (dayNumber === 3) return t('day.complete.title');
    return t('closure.title');
  };

  // Handle inactivity - save progress and navigate home
  const handleInactivitySaveLater = () => {
    saveCurrentAnswers();
    setShowInactivityModal(false);
    navigate('/');
  };

  const handleInactivityContinue = () => {
    setShowInactivityModal(false);
    resetTimer();
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

      <InactivityModal
        isOpen={showInactivityModal}
        onContinue={handleInactivityContinue}
        onSaveLater={handleInactivitySaveLater}
      />

      <div className="min-h-screen bg-background pb-16">
        <Header />

        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
            <span className="text-sm font-medium text-muted-foreground">{getDayLabel()}</span>
          </div>

          {/* StepIndicator only for Days 1-3 which have video/audio/download steps */}
          {dayNumber !== 0 && currentStep !== 'start' && currentStep !== 'closure' && (
            <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'start' && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="mb-8"
                  >
                    {dayNumber === 0 ? (
                      <BalticaLogo variant="isotipo" size={96} className="mx-auto" />
                    ) : (
                      <div className="w-24 h-24 rounded-full gradient-warm flex items-center justify-center mx-auto shadow-soft">
                        <span className="text-4xl font-bold text-primary-foreground">{dayNumber}</span>
                      </div>
                    )}
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{getDayTitle()}</h1>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">{getDaySubtitle()}</p>
                  <Button size="lg" onClick={nextStep} className="gap-2 rounded-full px-8">
                    {t('journey.start')}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {currentStep === 'video' && (
                <div className="py-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2 text-center">{t('content.video')}</h2>
                  <p className="text-muted-foreground text-center mb-6">{dayContent?.video.title || t('video.title')}</p>
                  <VideoPlayer src={dayContent?.video.url} title={dayContent?.video.title || ''} duration={dayContent?.video.duration || '1:30'} onComplete={() => markStepComplete('video')} />
                  <div className="flex justify-center mt-8">
                    <Button onClick={nextStep} className="gap-2 rounded-full px-8">
                      {t('video.next')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'audio' && (
                <div className="py-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2 text-center">{t('content.audio')}</h2>
                  <p className="text-muted-foreground text-center mb-8">{dayContent?.audio.title || t('audio.title')}</p>
                  <AudioPlayer title={dayContent?.audio.title || ''} subtitle={t('audio.title')} duration={dayContent?.audio.duration || '5:00'} onComplete={() => markStepComplete('audio')} />
                  <div className="flex justify-center mt-8">
                    <Button onClick={nextStep} className="gap-2 rounded-full px-8">
                      {t('audio.next')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'download' && (
                <div className="py-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 text-center">{t('content.download')}</h2>
                  <Card className="shadow-card">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                        <Download className="h-8 w-8 text-secondary-foreground" />
                      </div>
                      <CardTitle>{dayContent?.pdf.title || ''}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-6">
                        {locale.startsWith('es') ? 'Material complementario para tu práctica' : 'Complementary material for your practice'}
                      </p>
                      {dayContent?.pdf.url && (
                        <a href={dayContent.pdf.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            {locale.startsWith('es') ? 'Descargar PDF' : 'Download PDF'}
                          </Button>
                        </a>
                      )}
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

              {currentStep === 'survey' && renderSurveyContent()}

              {currentStep === 'closure' && (
                <div className="py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </motion.div>

                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{getClosureTitle()}</h1>

                  {dayNumber === 3 && (
                    <p className="text-lg text-muted-foreground mb-4">{t('day.complete.subtitle')}</p>
                  )}

                  <Card className="shadow-card mb-8 text-left">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BalticaLogo variant="isotipo" size={40} />
                        <CardTitle className="text-lg">
                          {dayNumber === 3
                            ? (locale.startsWith('es') ? 'Mensaje final' : 'Final message')
                            : t('closure.practice.title')}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-3">{getClosureMessage()}</p>
                      {dayContent && (
                        <p className="text-sm text-muted-foreground">{dayContent.practice[localeKey]}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Before/after emotional comparison for Day 3 */}
                  {dayNumber === 3 && dayAnswers.welcome?.mood && selectedMood && (
                    <Card className="shadow-card mb-8 text-left">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {locale.startsWith('es') ? 'Tu viaje emocional' : 'Your emotional journey'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-around">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                              {locale.startsWith('es') ? 'Al comenzar' : 'At the start'}
                            </p>
                            <p className="text-lg font-medium">{t(`mood.${dayAnswers.welcome.mood}` as any)}</p>
                            {dayAnswers.welcome.energy && (
                              <p className="text-sm text-muted-foreground">{t(`energy.${dayAnswers.welcome.energy}` as any)}</p>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                              {locale.startsWith('es') ? 'Al finalizar' : 'At the end'}
                            </p>
                            <p className="text-lg font-medium">{t(`mood.${selectedMood}` as any)}</p>
                            {selectedEnergy && (
                              <p className="text-sm text-muted-foreground">{t(`energy.${selectedEnergy}` as any)}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ethical note for Day 3 closure (node 3.8 per PDF spec) */}
                  {dayNumber === 3 && (
                    <div className="mb-8">
                      <EthicalNote variant="inline" />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleComplete} size="lg" className="gap-2 rounded-full px-8">
                      {dayNumber === 3
                        ? (locale.startsWith('es') ? 'Ver mi progreso completo' : 'See my full progress')
                        : t('closure.next')}
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

        <FloatingHelp />
        <EthicalFooter />
      </div>
    </>
  );
}
