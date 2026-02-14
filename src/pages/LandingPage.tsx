import { useApp } from '@/contexts/AppContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Heart, Sparkles, ArrowRight, Globe, Moon, Sun, Calendar, Package, Rocket, Brain, Timer, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import BalticaLogo from '@/components/brand/BalticaLogo';
import { EthicalNote } from '@/components/EthicalNote';
import { locales } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { t, locale, setLocale, theme, setTheme } = useApp();
  const navigate = useNavigate();
  usePageTitle('Programa de Bienestar en 3 Días');

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
      icon: Brain,
      title: t('landing.feature3.title'),
      desc: t('landing.feature3.desc'),
    },
    {
      icon: Sparkles,
      title: t('landing.feature4.title'),
      desc: t('landing.feature4.desc'),
    },
    {
      icon: Package,
      title: t('landing.feature5.title'),
      desc: t('landing.feature5.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <BalticaLogo variant="header" size={56} />
          </Link>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {locales.map(loc => (
                  <DropdownMenuItem
                    key={loc.code}
                    onClick={() => setLocale(loc.code)}
                    className={cn(locale === loc.code && 'bg-accent')}
                  >
                    <span className="mr-2">{loc.flag}</span>
                    {loc.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth?mode=login')}>
              {t('auth.login.cta')}
            </Button>
            <Button size="sm" onClick={() => navigate('/auth?mode=register')}>
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
            <BalticaLogo variant="full" size={200} className="mx-auto drop-shadow-lg" />
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
        <motion.div
          className="py-12 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {features.slice(0, 3).map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Card className="shadow-card h-full">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-base mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {features.slice(3).map((feature, i) => (
              <motion.div
                key={i + 3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <Card className="shadow-card h-full">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-base mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

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

        {/* Why It Works - Teaser Section */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              {t('methodology.teaser.title' as any)}
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/40">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">3 días</p>
                  <p className="text-sm text-muted-foreground">{t('methodology.teaser.3days' as any)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/40">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">10 minutos</p>
                  <p className="text-sm text-muted-foreground">{t('methodology.teaser.10min' as any)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/40">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">ACT</p>
                  <p className="text-sm text-muted-foreground">{t('methodology.teaser.act' as any)}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate('/metodologia')}
                className="text-primary"
              >
                {t('methodology.teaser.cta' as any)} →
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Coming Soon Section */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('landing.comingSoon.title')}
            </h2>
            <p className="text-muted-foreground mb-10">
              {t('landing.comingSoon.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 7-Day Challenge */}
              <Card className="shadow-card border-dashed border-2 bg-muted/20 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {t('landing.comingSoon.title')}
                  </span>
                </div>
                <CardContent className="p-6 pt-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('landing.comingSoon.7day')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('landing.comingSoon.7dayDesc')}
                  </p>
                </CardContent>
              </Card>

              {/* 14-Day Challenge */}
              <Card className="shadow-card border-dashed border-2 bg-muted/20 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {t('landing.comingSoon.title')}
                  </span>
                </div>
                <CardContent className="p-6 pt-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Rocket className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('landing.comingSoon.14day')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('landing.comingSoon.14dayDesc')}
                  </p>
                </CardContent>
              </Card>

              {/* Special Combos */}
              <Card className="shadow-card border-dashed border-2 bg-muted/20 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {t('landing.comingSoon.title')}
                  </span>
                </div>
                <CardContent className="p-6 pt-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('landing.comingSoon.combos')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('landing.comingSoon.combosDesc')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col items-center gap-6">
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/help" className="hover:text-foreground transition-colors">
                {t('nav.help')}
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-foreground transition-colors">
                    {t('ethical.title')}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <EthicalNote variant="card" />
                </DialogContent>
              </Dialog>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                {t('settings.legal.terms')}
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                {t('settings.legal.privacy')}
              </Link>
            </nav>
            <div className="w-12 h-px bg-border/60" />
            <p className="text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} Báltica Education. {locale.startsWith('es') ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
