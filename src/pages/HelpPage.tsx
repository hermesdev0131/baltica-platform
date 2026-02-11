import { useApp } from '@/contexts/AppContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Mail, MessageCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// FAQ estructurado por secciones - RETO DE 3 DÍAS
type FaqSection = {
  title: string;
  faqs: { question: string; answer: string }[];
};

const faqSections: Record<string, FaqSection[]> = {
  'es-LATAM': [
    // 1. INSCRIPCIÓN - PRIMERO
    {
      title: 'Inscripción',
      faqs: [
        {
          question: '¿Cómo ingreso al RETO DE 3 DÍAS?',
          answer: 'Primero, regístrate ingresando tu correo electrónico y creando una contraseña. Luego, realiza el pago de forma segura a través de Mercado Pago. Una vez confirmado el pago, ya puedes comenzar el reto de inmediato.',
        },
        {
          question: '¿Cómo creo mi cuenta?',
          answer: 'Simplemente ingresa tu correo electrónico y crea una contraseña. Después de registrarte, puedes comenzar con el curso.',
        },
        {
          question: '¿Qué pasa cuando mi acceso expira?',
          answer: 'Cuando tu período termine, tu cuenta quedará bloqueada y no podrás acceder al contenido. Puedes renovar en cualquier momento para empezar nuevamente TU RETO DE 3 DÍAS.',
        },
        {
          question: '¿Hay reembolsos disponibles?',
          answer: 'Después de registrarte con tu correo electrónico no hay derecho a reembolso.',
        },
      ],
    },
    // 2. ¿QUÉ ES EL RETO DE 3 DÍAS?
    {
      title: '¿Qué es el Reto de 3 Días?',
      faqs: [
        {
          question: '¿Qué es el RETO DE 3 DÍAS?',
          answer: 'El RETO DE 3 DÍAS es un programa de micro-experiencias diarias de autocuidado y formación de hábitos, pensado para acompañarte con prácticas breves, claras y sostenibles. Incluye 3 días completos de contenido bajo la misma estructura (Video – Audio – PDF), una bienvenida y una introducción que muestra el contenido y desarrollo del programa.',
        },
        {
          question: '¿El RETO DE 3 DÍAS es una terapia médica?',
          answer: 'No, es un programa educativo y preventivo que busca ayudarte a pausar, reflexionar y practicar pequeños hábitos de autocuidado. Sí estás atravesando un malestar intenso o persistente, siempre es importante buscar acompañamiento profesional.',
        },
        {
          question: '¿Cuánto tiempo necesito por día?',
          answer: 'Muy poco. Cada jornada está pensada para durar entre 10 y 15 minutos, incluyendo video, audio y una práctica sencilla. La idea no es exigir, sino acompañar de forma amable y realista.',
        },
        {
          question: '¿Qué pasa si un día no puedo completar la jornada?',
          answer: 'No pasa nada. Puedes retomar en cualquier momento, o repetir el día. Este ejercicio es para ti. Continúa desde donde lo dejaste y avanza a tu propio ritmo. Esto es para TI.',
        },
        {
          question: '¿Qué tipo de contenidos incluye?',
          answer: 'Cada día incluye: un video breve, un audio guiado, un material de apoyo (PDF) y una práctica concreta y sencilla. Todo el contenido está desarrollado con las mejores y más avanzadas técnicas psicológicas, con lenguaje claro, humano y no clínico.',
        },
        {
          question: '¿Puedo usar el RETO DE 3 DÍAS en el celular o Tablet?',
          answer: 'Pensamos en todo. Este programa está diseñado para usarse cómodamente desde el celular o la computadora, con un diseño simple, claro y adaptable a distintos dispositivos.',
        },
        {
          question: '¿Mis avances quedan guardados?',
          answer: 'Sí. Guardamos tu progreso para que puedas retomar tus jornadas, revisar lo que hiciste y continuar sin perder información. Esta información es para tu conocimiento.',
        },
        {
          question: '¿Qué incluye el plan de 2 meses?',
          answer: 'El plan de 2 meses incluye acceso completo al Reto de 3 Días con todos los videos, audios guiados, materiales PDF y la posibilidad de repetir el contenido las veces que quieras durante ese período.',
        },
        {
          question: '¿El programa tiene logros o celebraciones?',
          answer: 'Sí, la plataforma reconoce tus hitos con mensajes y animaciones de celebración suaves, pensadas para motivar sin generar presión. Por ejemplo: al completar cada día recibes una felicitación, al llegar a la mitad del programa se reconoce tu avance, al completar rachas de días consecutivos se celebra tu constancia, y al finalizar el reto completo recibes una celebración especial.',
        },
      ],
    },
    // 3. FORMAS DE PAGO - DETALLADO
    {
      title: 'Formas de Pago',
      faqs: [
        {
          question: '¿Cómo pago este programa "RETO DE 3 DÍAS"?',
          answer: 'Los pagos se realizan de forma segura a través de Mercado Pago, que ofrece las siguientes opciones:\n\n• Tarjetas de Crédito y Débito\n• Transferencias Bancarias (PSE)\n• Nequi y Daviplata\n• Efectivo (Efecty)',
        },
        {
          question: '¿Puedo pagar con Nequi o Daviplata?',
          answer: 'Sí. Puedes pagar con Nequi o Daviplata a través de la opción PSE. Al momento de pagar, selecciona PSE y luego elige "Nequi" o "Daviplata" en la lista de bancos.',
        },
        {
          question: '¿Puedo pagar con tarjeta de crédito?',
          answer: 'Sí. Aceptamos las principales tarjetas de crédito: Visa, Mastercard, American Express, Diners Club y Codensa. La acreditación es instantánea.',
        },
        {
          question: '¿Puedo pagar en Efecty?',
          answer: 'Sí. Al seleccionar pago en efectivo, el sistema genera un número de convenio y una referencia. Ve a cualquier punto Efecty del país, paga en efectivo y el sistema te notificará automáticamente cuando el pago sea exitoso.',
        },
        {
          question: '¿Puedo pagar por transferencia bancaria?',
          answer: 'Sí. Mediante el botón PSE puedes pagar desde cualquier cuenta de ahorros o corriente de todos los bancos del país.',
        },
        {
          question: '¿Qué pasa si mi pago falla?',
          answer: 'Si tu pago falla, verifica los datos de tu tarjeta, asegúrate de tener fondos suficientes e intenta de nuevo. Si el problema persiste, prueba con otro método de pago. Mercado Pago te mostrará el error específico para ayudarte a resolverlo.',
        },
        {
          question: '¿Mi información de pago está segura?',
          answer: 'Sí. Usamos Mercado Pago, una de las plataformas de pago más confiables de Latinoamérica. Nunca almacenamos los datos de tu tarjeta - todo el procesamiento de pagos lo maneja directamente Mercado Pago con seguridad de nivel bancario.',
        },
        {
          question: '¿Recibiré un comprobante?',
          answer: 'Sí. Mercado Pago enviará un comprobante a tu correo electrónico después de cada pago exitoso. También puedes ver tu historial de pagos en tu cuenta de Mercado Pago.',
        },
      ],
    },
    // 4. PRÓXIMOS CURSOS
    {
      title: 'Próximos Cursos',
      faqs: [
        {
          question: '¿Qué otros cursos tienen?',
          answer: 'Se vienen próximamente retos de 7 y 14 días, cápsulas informativas, y combinaciones especiales para profundizar en tu proceso de autocuidado.',
        },
      ],
    },
    // 5. CONTACTO Y AYUDA
    {
      title: 'Contacto',
      faqs: [
        {
          question: '¿Qué pasa si tengo dudas o necesito ayuda?',
          answer: 'Puedes contactarnos directamente por WhatsApp al +57 3182644725. Estaremos encantados de ayudarte.',
        },
      ],
    },
    // 6. IDIOMAS - ÚLTIMO
    {
      title: 'Idiomas',
      faqs: [
        {
          question: '¿Está disponible en otros idiomas?',
          answer: 'Actualmente el idioma principal es español, y la plataforma está preparada para incorporar otros idiomas en el futuro, como inglés, sin afectar la experiencia.',
        },
      ],
    },
  ],
  'es-ES': [
    // Same structure for es-ES
    {
      title: 'Inscripción',
      faqs: [
        {
          question: '¿Cómo ingreso al RETO DE 3 DÍAS?',
          answer: 'Primero, regístrate ingresando tu correo electrónico y creando una contraseña. Luego, realiza el pago de forma segura a través de Mercado Pago. Una vez confirmado el pago, ya puedes comenzar el reto de inmediato.',
        },
        {
          question: '¿Cómo creo mi cuenta?',
          answer: 'Simplemente ingresa tu correo electrónico y crea una contraseña. Después de registrarte, puedes comenzar con el curso.',
        },
        {
          question: '¿Qué pasa cuando mi acceso expira?',
          answer: 'Cuando tu período termine, tu cuenta quedará bloqueada y no podrás acceder al contenido. Puedes renovar en cualquier momento para empezar nuevamente TU RETO DE 3 DÍAS.',
        },
        {
          question: '¿Hay reembolsos disponibles?',
          answer: 'Después de registrarte con tu correo electrónico no hay derecho a reembolso.',
        },
      ],
    },
    {
      title: '¿Qué es el Reto de 3 Días?',
      faqs: [
        {
          question: '¿Qué es el RETO DE 3 DÍAS?',
          answer: 'El RETO DE 3 DÍAS es un programa de micro-experiencias diarias de autocuidado y formación de hábitos, pensado para acompañarte con prácticas breves, claras y sostenibles. Incluye 3 días completos de contenido bajo la misma estructura (Video – Audio – PDF), una bienvenida y una introducción que muestra el contenido y desarrollo del programa.',
        },
        {
          question: '¿El RETO DE 3 DÍAS es una terapia médica?',
          answer: 'No, es un programa educativo y preventivo que busca ayudarte a pausar, reflexionar y practicar pequeños hábitos de autocuidado. Sí estás atravesando un malestar intenso o persistente, siempre es importante buscar acompañamiento profesional.',
        },
        {
          question: '¿Cuánto tiempo necesito por día?',
          answer: 'Muy poco. Cada jornada está pensada para durar entre 10 y 15 minutos, incluyendo vídeo, audio y una práctica sencilla. La idea no es exigir, sino acompañar de forma amable y realista.',
        },
        {
          question: '¿Qué pasa si un día no puedo completar la jornada?',
          answer: 'No pasa nada. Puedes retomar en cualquier momento, o repetir el día. Este ejercicio es para ti. Continúa desde donde lo dejaste y avanza a tu propio ritmo. Esto es para TI.',
        },
        {
          question: '¿Qué tipo de contenidos incluye?',
          answer: 'Cada jornada incluye: un vídeo breve, un audio guiado, un material de apoyo (PDF) y una práctica concreta y sencilla. Todo el contenido está diseñado con un lenguaje claro, humano y no clínico.',
        },
        {
          question: '¿Puedo usar el RETO DE 3 DÍAS en el celular o Tablet?',
          answer: 'Pensamos en todo. Este programa está diseñado para usarse cómodamente desde el móvil o el ordenador, con un diseño simple, claro y adaptable a distintos dispositivos.',
        },
        {
          question: '¿Mis avances quedan guardados?',
          answer: 'Sí. Guardamos tu progreso para que puedas retomar tus jornadas, revisar lo que hiciste y continuar sin perder información. Esta información es para tu conocimiento.',
        },
        {
          question: '¿Qué incluye el plan de 2 meses?',
          answer: 'El plan de 2 meses incluye acceso completo al Reto de 3 Días con todos los vídeos, audios guiados, materiales PDF y la posibilidad de repetir el contenido las veces que quieras durante ese período.',
        },
        {
          question: '¿El programa tiene logros o celebraciones?',
          answer: 'Sí, la plataforma reconoce tus hitos con mensajes y animaciones de celebración suaves, pensadas para motivar sin generar presión. Por ejemplo: al completar cada día recibes una felicitación, al llegar a la mitad del programa se reconoce tu avance, al completar rachas de días consecutivos se celebra tu constancia, y al finalizar el reto completo recibes una celebración especial.',
        },
      ],
    },
    {
      title: 'Formas de Pago',
      faqs: [
        {
          question: '¿Cómo pago el RETO DE 3 DÍAS?',
          answer: 'Los pagos se realizan de forma segura a través de Mercado Pago, que ofrece múltiples opciones de pago incluyendo tarjetas de crédito, débito y otros métodos disponibles en tu país.',
        },
        {
          question: '¿Qué pasa si mi pago falla?',
          answer: 'Si tu pago falla, verifica los datos de tu tarjeta, asegúrate de tener fondos suficientes e intenta de nuevo. Si el problema persiste, prueba con otro método de pago.',
        },
        {
          question: '¿Mi información de pago está segura?',
          answer: 'Sí. Usamos Mercado Pago, una de las plataformas de pago más confiables. Nunca almacenamos los datos de tu tarjeta.',
        },
        {
          question: '¿Recibiré un comprobante?',
          answer: 'Sí. Mercado Pago enviará un comprobante a tu correo electrónico después de cada pago exitoso.',
        },
      ],
    },
    {
      title: 'Próximos Cursos',
      faqs: [
        {
          question: '¿Qué otros cursos tienen?',
          answer: 'Se vienen próximamente retos de 7 y 14 días, cápsulas informativas, y combinaciones especiales para profundizar en tu proceso de autocuidado.',
        },
      ],
    },
    {
      title: 'Contacto',
      faqs: [
        {
          question: '¿Qué pasa si tengo dudas o necesito ayuda?',
          answer: 'Puedes contactarnos directamente por WhatsApp al +57 3182644725. Estaremos encantados de ayudarte.',
        },
      ],
    },
    {
      title: 'Idiomas',
      faqs: [
        {
          question: '¿Está disponible en otros idiomas?',
          answer: 'Actualmente el idioma principal es español, y la plataforma está preparada para incorporar otros idiomas en el futuro, como inglés, sin afectar la experiencia.',
        },
      ],
    },
  ],
  en: [
    {
      title: 'Registration',
      faqs: [
        {
          question: 'How do I access the 3-DAY CHALLENGE?',
          answer: 'First, register by entering your email and creating a password. Then, complete your payment securely through Mercado Pago. Once the payment is confirmed, you can start the challenge right away.',
        },
        {
          question: 'How do I create my account?',
          answer: 'Simply enter your email and create a password. After registering, you can start with the course.',
        },
        {
          question: 'What happens when my access expires?',
          answer: 'When your period ends, your account will be blocked and you will not be able to access the content. You can renew at any time to start your 3-DAY CHALLENGE again.',
        },
        {
          question: 'Are refunds available?',
          answer: 'After registering with your email, there is no right to a refund.',
        },
      ],
    },
    {
      title: 'What is the 3-Day Challenge?',
      faqs: [
        {
          question: 'What is the 3-DAY CHALLENGE?',
          answer: 'The 3-DAY CHALLENGE is a program of daily micro-experiences of self-care and habit formation, designed to accompany you with brief, clear, and sustainable practices. It includes 3 complete days of content following the same structure (Video – Audio – PDF), a welcome, and an introduction that shows the content and development of the program.',
        },
        {
          question: 'Is the 3-DAY CHALLENGE a medical therapy?',
          answer: 'No, it is an educational and preventive program that seeks to help you pause, reflect, and practice small self-care habits. If you are experiencing intense or persistent discomfort, it is always important to seek professional support.',
        },
        {
          question: 'How much time do I need per day?',
          answer: 'Very little. Each session is designed to last between 10 and 15 minutes, including video, audio, and a simple practice. The idea is not to demand, but to accompany you in a kind and realistic way.',
        },
        {
          question: 'What happens if I cannot complete a session one day?',
          answer: 'Nothing happens. You can resume at any time, or repeat the day. This exercise is for you. Continue from where you left off and progress at your own pace. This is for YOU.',
        },
        {
          question: 'What type of content does it include?',
          answer: 'Each day includes: a brief video, a guided audio, support material (PDF), and a concrete and simple practice. All content is developed with the best and most advanced psychological techniques, with clear, human, and non-clinical language.',
        },
        {
          question: 'Can I use the 3-DAY CHALLENGE on my phone or Tablet?',
          answer: 'We thought of everything. This program is designed to be used comfortably from your phone or computer, with a simple, clear design that adapts to different devices.',
        },
        {
          question: 'Is my progress saved?',
          answer: 'Yes. We save your progress so you can resume your sessions, review what you did, and continue without losing information. This information is for your knowledge.',
        },
        {
          question: 'What does the 2-month plan include?',
          answer: 'The 2-month plan includes full access to the 3-Day Challenge with all videos, guided audios, PDF materials, and the ability to repeat the content as many times as you want during that period.',
        },
        {
          question: 'Does the program have achievements or celebrations?',
          answer: 'Yes, the platform recognizes your milestones with soft celebration messages and animations, designed to motivate without creating pressure. For example: you receive a congratulation when completing each day, your progress is recognized at the halfway point, streaks of consecutive days celebrate your consistency, and completing the full challenge triggers a special celebration.',
        },
      ],
    },
    {
      title: 'Payment Methods',
      faqs: [
        {
          question: 'How do I pay for the 3-DAY CHALLENGE?',
          answer: 'Payments are made securely through Mercado Pago, which offers the following options:\n\n• Credit and Debit Cards\n• Bank Transfers (PSE)\n• Nequi and Daviplata\n• Cash (Efecty)',
        },
        {
          question: 'What if my payment fails?',
          answer: 'If your payment fails, verify your card details, ensure you have sufficient funds, and try again. If the problem persists, try a different payment method. Mercado Pago will show you the specific error to help resolve it.',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes. We use Mercado Pago, one of the most trusted payment platforms in Latin America. We never store your card details - all payment processing is handled directly by Mercado Pago with bank-level security.',
        },
        {
          question: 'Will I receive a receipt?',
          answer: 'Yes. Mercado Pago will send a receipt to your email after each successful payment. You can also view your payment history in your Mercado Pago account.',
        },
      ],
    },
    {
      title: 'Coming Courses',
      faqs: [
        {
          question: 'What other courses do you have?',
          answer: 'Coming soon: 7-day and 14-day challenges, informative capsules, and special combinations to deepen your self-care process.',
        },
      ],
    },
    {
      title: 'Contact',
      faqs: [
        {
          question: 'What if I have questions or need help?',
          answer: 'You can contact us directly via WhatsApp at +57 3182644725. We will be happy to help you.',
        },
      ],
    },
    {
      title: 'Languages',
      faqs: [
        {
          question: 'Is it available in other languages?',
          answer: 'Currently the main language is Spanish, and the platform is prepared to incorporate other languages in the future, such as English, without affecting the experience.',
        },
      ],
    },
  ],
};

export default function HelpPage() {
  const { t, locale } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  usePageTitle('Ayuda');
  const currentSections = faqSections[locale] || faqSections.en;

  // Get return path from navigation state
  const returnTo = (location.state as { returnTo?: string })?.returnTo;

  const handleReturn = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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

        {/* FAQ Sections */}
        <motion.section
          className="mb-10 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {currentSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                  {sectionIndex + 1}
                </span>
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`section-${sectionIndex}-faq-${faqIndex}`}
                    className="bg-card rounded-xl border shadow-card px-4"
                  >
                    <AccordionTrigger className="text-left text-sm hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </motion.section>

      </main>

      {/* Floating Back Button - top left */}
      <Button
        variant="default"
        className="fixed top-4 left-4 h-10 rounded-full shadow-lg gap-2 px-4"
        onClick={handleReturn}
      >
        <ArrowLeft className="h-4 w-4" />
        {locale.startsWith('es') ? 'Volver' : 'Back'}
      </Button>

      {/* Floating WhatsApp Button - bottom right */}
      <a
        href="https://wa.me/573182644725"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-colors z-50"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
