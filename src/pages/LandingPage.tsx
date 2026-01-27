import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

export default function LandingPage() {
  const { t } = useApp();
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: t('landing.feature1.title'),
      desc: t('landing.feature1.desc'),
    },
    {
      icon: Heart,
      title: t('landing.feature2.title'),
      desc: t('landing.feature2.desc'),
    },
    {
      icon: Sparkles,
      title: t('landing.feature3.title'),
      desc: t('landing.feature3.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-warm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-lg">BÁLTICA</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/auth?mode=login')}>
              {t('auth.login.cta')}
            </Button>
            <Button onClick={() => navigate('/auth?mode=register')}>
              {t('landing.cta')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <motion.section
          className="text-center py-20 md:py-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-8"
          >
            <div className="h-24 w-24 rounded-full gradient-warm flex items-center justify-center mx-auto shadow-soft">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-3xl mx-auto">
            {t('landing.headline')}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('landing.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="gap-2 px-8 py-6 text-lg rounded-full shadow-soft"
              onClick={() => navigate('/auth?mode=register')}
            >
              {t('landing.cta')}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            {t('landing.tagline')}
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Card className="shadow-card h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* How It Works Preview */}
        <motion.section
          className="py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              3 días que transforman
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((day) => (
                <div key={day} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-secondary-foreground">{day}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {day === 1 && 'Anclaje'}
                    {day === 2 && 'Propósito'}
                    {day === 3 && 'Autocompasión'}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/how-it-works')}
              className="rounded-full"
            >
              Conoce más
            </Button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full gradient-warm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">B</span>
              </div>
              <span className="font-semibold">BÁLTICA</span>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/how-it-works" className="hover:text-foreground transition-colors">
                Cómo funciona
              </Link>
              <Link to="/help" className="hover:text-foreground transition-colors">
                Ayuda
              </Link>
              <button
                onClick={() => {/* Open ethical note modal */}}
                className="hover:text-foreground transition-colors"
              >
                Nota ética
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
