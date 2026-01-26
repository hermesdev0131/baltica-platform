import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const faqs = {
  en: [
    {
      question: 'How long does each session take?',
      answer: 'Each daily session takes less than 10 minutes. We designed it to fit easily into your routine.',
    },
    {
      question: 'What if I miss a day?',
      answer: 'No problem! You can pick up where you left off. Progress is about consistency, not perfection.',
    },
    {
      question: 'Can I repeat a day?',
      answer: 'Absolutely! You can revisit any completed day whenever you want.',
    },
    {
      question: 'Is this a medical program?',
      answer: 'No, this is an educational wellbeing program focused on self-care habits. It is not medical or clinical.',
    },
  ],
  'es-ES': [
    {
      question: '¿Cuánto dura cada sesión?',
      answer: 'Cada sesión diaria dura menos de 10 minutos. Lo diseñamos para que encaje fácilmente en tu rutina.',
    },
    {
      question: '¿Qué pasa si me salto un día?',
      answer: '¡Sin problema! Puedes retomar donde lo dejaste. El progreso se trata de constancia, no de perfección.',
    },
    {
      question: '¿Puedo repetir un día?',
      answer: '¡Por supuesto! Puedes volver a visitar cualquier día completado cuando quieras.',
    },
    {
      question: '¿Es un programa médico?',
      answer: 'No, es un programa educativo de bienestar enfocado en hábitos de autocuidado. No es médico ni clínico.',
    },
  ],
  'es-LATAM': [
    {
      question: '¿Cuánto dura cada sesión?',
      answer: 'Cada sesión diaria dura menos de 10 minutos. Lo diseñamos para que encaje fácilmente en tu rutina.',
    },
    {
      question: '¿Qué pasa si me salto un día?',
      answer: '¡Sin problema! Puedes retomar donde lo dejaste. El progreso se trata de constancia, no de perfección.',
    },
    {
      question: '¿Puedo repetir un día?',
      answer: '¡Claro que sí! Puedes volver a revisar cualquier día completado cuando quieras.',
    },
    {
      question: '¿Es un programa médico?',
      answer: 'No, es un programa educativo de bienestar enfocado en hábitos de autocuidado. No es médico ni clínico.',
    },
  ],
};

export default function HelpPage() {
  const { t, locale } = useApp();
  
  const currentFaqs = faqs[locale] || faqs.en;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Title */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('help.title')}
          </h1>
        </motion.div>

        {/* FAQ */}
        <motion.section 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('help.faq')}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {currentFaqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`faq-${i}`}
                className="bg-card rounded-xl border shadow-card px-4"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('help.contact')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground">help@baltica.app</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Chat</h3>
                  <p className="text-sm text-muted-foreground">Disponible 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
