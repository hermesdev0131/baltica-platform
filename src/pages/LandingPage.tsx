import { useApp } from '@/contexts/AppContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowDown, Globe, Moon, Sun, Check, Focus, Target, Heart } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { t, locale, setLocale, theme, setTheme } = useApp();
  const navigate = useNavigate();
  usePageTitle('Reto de 3 Días de Bienestar y Gestión del Estrés | Metodología Báltica');

  const goToRegister = () => navigate('/auth?mode=register');

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
            <Button size="sm" onClick={goToRegister}>
              {t('landing.cta')}
            </Button>
          </div>
        </div>
      </header>

      {/* ===== SECTION 1: HERO ===== */}
      <motion.section
        className="container mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          {/* Left: Text */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-6">
              {t('landing.pretitle' as any)}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {t('landing.headline' as any)}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
              {t('landing.subtitle')}
            </p>

            <Button
              size="lg"
              className="gap-2 px-8 py-6 text-base font-semibold rounded-full shadow-soft"
              onClick={goToRegister}
            >
              {t('landing.cta')}
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              {t('landing.microcopy' as any)}
            </p>
          </div>

          {/* Right: Hero image */}
          <div className="hidden md:flex items-center justify-center">
            <img
              src="/hero-img.jpg"
              alt="Persona en calma con audífonos"
              className="w-full rounded-2xl object-cover shadow-soft"
            />
          </div>
        </div>
      </motion.section>

      {/* ===== SECTION 2: EL PROBLEMA ===== */}
      <motion.section
        className="py-16 md:py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
            {t('landing.problem.title' as any)}
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            {t('landing.problem.intro' as any)}
          </p>

          <div className="space-y-4 mb-10">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/40">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {t(`landing.problem.point${i}` as any)}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-base font-medium text-primary mb-4">
              {t('landing.problem.transition' as any)}
            </p>
            <ArrowDown className="h-6 w-6 text-primary mx-auto animate-bounce" />
          </div>
        </div>
      </motion.section>

      {/* ===== SECTION 3: LA SOLUCIÓN ===== */}
      <motion.section
        className="py-16 md:py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
            {t('landing.solution.title' as any)}
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {t('landing.solution.intro' as any)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Focus, day: 1, label: 'DÍA 1', titleKey: 'landing.solution.day1.title', descKey: 'landing.solution.day1.desc' },
              { icon: Target, day: 2, label: 'DÍA 2', titleKey: 'landing.solution.day2.title', descKey: 'landing.solution.day2.desc' },
              { icon: Heart, day: 3, label: 'DÍA 3', titleKey: 'landing.solution.day3.title', descKey: 'landing.solution.day3.desc' },
            ].map((item, i) => (
              <motion.div
                key={item.day}
                className="text-center p-6 rounded-2xl bg-card border border-border/40 shadow-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-semibold tracking-wider uppercase text-primary mb-2 block">
                  {item.label}
                </span>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(item.titleKey as any)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(item.descKey as any)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== SECTION 4: AUTORIDAD ===== */}
      <motion.section
        className="py-16 md:py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            {t('landing.authority.title' as any)}
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            {t('landing.authority.body' as any)}
          </p>

          <blockquote className="relative px-8 py-6 bg-card rounded-2xl border border-primary/20 shadow-card">
            <span className="absolute -top-3 left-6 text-4xl text-primary/30">"</span>
            <p className="text-base md:text-lg font-medium text-foreground italic">
              {t('landing.authority.quote' as any)}
            </p>
          </blockquote>
        </div>
      </motion.section>

      {/* ===== SECTION 5: FORMATO ===== */}
      <motion.section
        className="py-16 md:py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
            {t('landing.format.title' as any)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3 días */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-card text-center">
              <span className="text-6xl md:text-7xl font-bold text-primary block">3</span>
              <span className="text-xl font-semibold text-foreground block mb-3">
                {t('landing.format.3days.label' as any)}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.format.3days.desc' as any)}
              </p>
            </div>

            {/* 10 minutos */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-card text-center">
              <span className="text-6xl md:text-7xl font-bold text-primary block">10</span>
              <span className="text-xl font-semibold text-foreground block mb-3">
                {t('landing.format.10min.label' as any)}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.format.10min.desc' as any)}
              </p>
            </div>

            {/* Secuencia estratégica */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-card">
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t('landing.format.sequence.title' as any)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.format.sequence.desc' as any)}
              </p>
            </div>

            {/* A tu ritmo */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-card">
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t('landing.format.pace.title' as any)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.format.pace.desc' as any)}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== SECTION 6: OFERTA IRRESISTIBLE ===== */}
      <motion.section
        className="py-16 md:py-24 bg-baltica-navy text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('landing.offer.title' as any)}
          </h2>

          <p className="text-base text-white/80 leading-relaxed mb-10">
            {t('landing.offer.body' as any)}
          </p>

          {/* Pricing */}
          <div className="mb-8">
            <p className="text-sm text-white/60 mb-1">
              {t('landing.offer.originalLabel' as any)}
            </p>
            <p className="text-2xl text-white/50 line-through mb-2">
              {t('landing.offer.originalPrice' as any)}
            </p>
            <p className="text-sm text-white/80 mb-1">
              {t('landing.offer.priceLabel' as any)}
            </p>
            <p className="text-5xl md:text-6xl font-bold text-primary">
              {t('landing.offer.price' as any)}
            </p>
          </div>

          <p className="text-base text-white/80 italic mb-10">
            {t('landing.offer.closing' as any)}
          </p>

          <Button
            size="lg"
            className="gap-2 px-10 py-6 text-base font-semibold rounded-full shadow-soft bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={goToRegister}
          >
            {t('landing.offer.cta' as any)}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-0">
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
