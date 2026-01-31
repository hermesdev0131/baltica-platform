import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Smartphone, Server, Shield, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorksPage() {
  const { t } = useApp();

  const sections = [
    {
      icon: Smartphone,
      title: t('howItWorks.section1.title'),
      text: t('howItWorks.section1.text'),
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Server,
      title: t('howItWorks.section2.title'),
      text: t('howItWorks.section2.text'),
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      icon: Shield,
      title: t('howItWorks.section3.title'),
      text: t('howItWorks.section3.text'),
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
  ];

  const faqs = [
    { q: t('howItWorks.faq1.q'), a: t('howItWorks.faq1.a') },
    { q: t('howItWorks.faq2.q'), a: t('howItWorks.faq2.a') },
    { q: t('howItWorks.faq3.q'), a: t('howItWorks.faq3.a') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {t('howItWorks.title')}
          </h1>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4 mb-10">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${section.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">
                          {section.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {section.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 text-center">
                Arquitectura simplificada
              </h3>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Tu navegador</p>
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                    <Server className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Hostinger</p>
                </div>
                <div className="text-2xl text-muted-foreground">↔</div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center mx-auto mb-2">
                    <Server className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Media CDN</p>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Todo se ve igual desde tu perspectiva, sin importar dónde esté el contenido.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-base font-semibold text-foreground mb-4">
            Preguntas frecuentes
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl border shadow-card px-4"
              >
                <AccordionTrigger className="text-left text-sm hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </main>
    </div>
  );
}
