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

// FAQ alineado con la identidad BÁLTICA: humano, claro, no clínico
const faqs = {
  en: [
    {
      question: 'What is Báltica?',
      answer: 'Báltica is a platform for daily micro-experiences of self-care and habit formation, designed to accompany you with brief, clear, and sustainable practices. Each session takes less than 10 minutes and is designed to fit easily into your daily routine.',
    },
    {
      question: 'Is Báltica a therapy or does it replace psychological care?',
      answer: 'No. Báltica is not a therapy and does not replace psychological or medical care. It is an educational and preventive tool that seeks to help you pause, reflect, and practice small self-care habits. If you are experiencing intense or persistent discomfort, it is always important to seek professional support.',
    },
    {
      question: 'How much time do I need per day?',
      answer: 'Very little. Each session is designed to last between 5 and 10 minutes, including video, audio, and a simple practice. The idea is not to demand, but to accompany you in a kind and realistic way.',
    },
    {
      question: 'What happens if I cannot complete a session one day?',
      answer: 'Nothing happens. Báltica does not work like an exam or an obligation. You can resume the session whenever you want, continue from where you left off, and progress at your own pace.',
    },
    {
      question: 'What type of content does Báltica include?',
      answer: 'Each session includes: a brief video, a guided audio, support material (PDF), and a concrete and simple practice. All content is designed with clear, human, and non-clinical language.',
    },
    {
      question: 'Are my responses and progress saved?',
      answer: 'Yes. Báltica saves your progress so you can resume your sessions, review what you have done, and continue without losing information. Accesses and progress are also recorded securely for the proper functioning of the service.',
    },
    {
      question: 'What type of records does the platform keep?',
      answer: 'Basically and responsibly, we record: access dates and times, sessions started and completed, and content usage (for example, audio or video playback). These records serve to improve the experience and as backup for service usage. They are not used for clinical or diagnostic purposes.',
    },
    {
      question: 'How do reminders work?',
      answer: 'You can activate friendly daily reminders, at the time you choose, to help you maintain the habit. They are not invasive or mandatory, and you can deactivate them whenever you want.',
    },
    {
      question: 'Does Báltica have achievements or celebrations?',
      answer: 'Yes. The platform recognizes important milestones, such as consistency or usage streaks, with soft celebration messages and animations, designed to motivate without creating pressure.',
    },
    {
      question: 'Can I use Báltica from my phone?',
      answer: 'Yes. Báltica is designed to be used comfortably from your phone or computer, with a simple, clear design that adapts to different devices.',
    },
    {
      question: 'Is it available in other languages?',
      answer: 'Currently the main language is Spanish, and the platform is prepared to incorporate other languages in the future, such as English, without affecting the experience.',
    },
    {
      question: 'What if I have questions or need help?',
      answer: 'Báltica includes permanent access to a Help section, where you will find guidance and important reminders about responsible use of the platform and when to seek external professional support.',
    },
  ],
  'es-ES': [
    {
      question: '¿Qué es Báltica?',
      answer: 'Báltica es una plataforma de micro-experiencias diarias de autocuidado y formación de hábitos, pensada para acompañarte con prácticas breves, claras y sostenibles. Cada jornada dura menos de 10 minutos y está diseñada para integrarse fácilmente en tu rutina diaria.',
    },
    {
      question: '¿Báltica es una terapia o reemplaza atención psicológica?',
      answer: 'No. Báltica no es una terapia ni reemplaza atención psicológica o médica. Es una herramienta educativa y preventiva que busca ayudarte a pausar, reflexionar y practicar pequeños hábitos de autocuidado. Si estás atravesando un malestar intenso o persistente, siempre es importante buscar acompañamiento profesional.',
    },
    {
      question: '¿Cuánto tiempo necesito por día?',
      answer: 'Muy poco. Cada jornada está pensada para durar entre 5 y 10 minutos, incluyendo vídeo, audio y una práctica sencilla. La idea no es exigir, sino acompañar de forma amable y realista.',
    },
    {
      question: '¿Qué pasa si un día no puedo completar la jornada?',
      answer: 'No pasa nada. Báltica no funciona como un examen ni como una obligación. Puedes retomar la jornada cuando quieras, continuar desde donde la dejaste y avanzar a tu propio ritmo.',
    },
    {
      question: '¿Qué tipo de contenidos incluye Báltica?',
      answer: 'Cada jornada incluye: un vídeo breve, un audio guiado, un material de apoyo (PDF) y una práctica concreta y sencilla. Todo el contenido está diseñado con un lenguaje claro, humano y no clínico.',
    },
    {
      question: '¿Mis respuestas y avances quedan guardados?',
      answer: 'Sí. Báltica guarda tu progreso para que puedas retomar tus jornadas, revisar lo que hiciste y continuar sin perder información. También se registran accesos y avances de forma segura para el correcto funcionamiento del servicio.',
    },
    {
      question: '¿Qué tipo de registros guarda la plataforma?',
      answer: 'De forma básica y responsable, se registran: fechas y horas de acceso, jornadas iniciadas y completadas, y uso de contenidos (por ejemplo, reproducción de audios o vídeos). Estos registros sirven para mejorar la experiencia y como respaldo del uso del servicio. No se utilizan con fines clínicos ni diagnósticos.',
    },
    {
      question: '¿Cómo funcionan los recordatorios?',
      answer: 'Puedes activar recordatorios diarios amables, en el horario que elijas, para ayudarte a mantener el hábito. No son invasivos ni obligatorios, y puedes desactivarlos cuando quieras.',
    },
    {
      question: '¿Báltica tiene logros o celebraciones?',
      answer: 'Sí. La plataforma reconoce hitos importantes, como la constancia o las rachas de uso, con mensajes y animaciones de celebración suaves, pensadas para motivar sin generar presión.',
    },
    {
      question: '¿Puedo usar Báltica desde el móvil?',
      answer: 'Sí. Báltica está pensada para usarse cómodamente desde el móvil o el ordenador, con un diseño simple, claro y adaptable a distintos dispositivos.',
    },
    {
      question: '¿Está disponible en otros idiomas?',
      answer: 'Actualmente el idioma principal es español, y la plataforma está preparada para incorporar otros idiomas en el futuro, como inglés, sin afectar la experiencia.',
    },
    {
      question: '¿Qué pasa si tengo dudas o necesito ayuda?',
      answer: 'Báltica incluye un acceso permanente a una sección de Ayuda, donde encontrarás orientación y recordatorios importantes sobre el uso responsable de la plataforma y cuándo buscar apoyo profesional externo.',
    },
  ],
  'es-LATAM': [
    {
      question: '¿Qué es Báltica?',
      answer: 'Báltica es una plataforma de micro-experiencias diarias de autocuidado y formación de hábitos, pensada para acompañarte con prácticas breves, claras y sostenibles. Cada jornada dura menos de 10 minutos y está diseñada para integrarse fácilmente en tu rutina diaria.',
    },
    {
      question: '¿Báltica es una terapia o reemplaza atención psicológica?',
      answer: 'No. Báltica no es una terapia ni reemplaza atención psicológica o médica. Es una herramienta educativa y preventiva que busca ayudarte a pausar, reflexionar y practicar pequeños hábitos de autocuidado. Si estás atravesando un malestar intenso o persistente, siempre es importante buscar acompañamiento profesional.',
    },
    {
      question: '¿Cuánto tiempo necesito por día?',
      answer: 'Muy poco. Cada jornada está pensada para durar entre 5 y 10 minutos, incluyendo video, audio y una práctica sencilla. La idea no es exigir, sino acompañar de forma amable y realista.',
    },
    {
      question: '¿Qué pasa si un día no puedo completar la jornada?',
      answer: 'No pasa nada. Báltica no funciona como un examen ni como una obligación. Puedes retomar la jornada cuando quieras, continuar desde donde la dejaste y avanzar a tu propio ritmo.',
    },
    {
      question: '¿Qué tipo de contenidos incluye Báltica?',
      answer: 'Cada jornada incluye: un video breve, un audio guiado, un material de apoyo (PDF) y una práctica concreta y sencilla. Todo el contenido está diseñado con un lenguaje claro, humano y no clínico.',
    },
    {
      question: '¿Mis respuestas y avances quedan guardados?',
      answer: 'Sí. Báltica guarda tu progreso para que puedas retomar tus jornadas, revisar lo que hiciste y continuar sin perder información. También se registran accesos y avances de forma segura para el correcto funcionamiento del servicio.',
    },
    {
      question: '¿Qué tipo de registros guarda la plataforma?',
      answer: 'De forma básica y responsable, se registran: fechas y horas de acceso, jornadas iniciadas y completadas, y uso de contenidos (por ejemplo, reproducción de audios o videos). Estos registros sirven para mejorar la experiencia y como respaldo del uso del servicio. No se utilizan con fines clínicos ni diagnósticos.',
    },
    {
      question: '¿Cómo funcionan los recordatorios?',
      answer: 'Puedes activar recordatorios diarios amables, en el horario que elijas, para ayudarte a mantener el hábito. No son invasivos ni obligatorios, y puedes desactivarlos cuando quieras.',
    },
    {
      question: '¿Báltica tiene logros o celebraciones?',
      answer: 'Sí. La plataforma reconoce hitos importantes, como la constancia o las rachas de uso, con mensajes y animaciones de celebración suaves, pensadas para motivar sin generar presión.',
    },
    {
      question: '¿Puedo usar Báltica desde el celular?',
      answer: 'Sí. Báltica está pensada para usarse cómodamente desde el celular o la computadora, con un diseño simple, claro y adaptable a distintos dispositivos.',
    },
    {
      question: '¿Está disponible en otros idiomas?',
      answer: 'Actualmente el idioma principal es español, y la plataforma está preparada para incorporar otros idiomas en el futuro, como inglés, sin afectar la experiencia.',
    },
    {
      question: '¿Qué pasa si tengo dudas o necesito ayuda?',
      answer: 'Báltica incluye un acceso permanente a una sección de Ayuda, donde encontrarás orientación y recordatorios importantes sobre el uso responsable de la plataforma y cuándo buscar apoyo profesional externo.',
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
                  <p className="text-sm text-muted-foreground">help@Báltica.app</p>
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
