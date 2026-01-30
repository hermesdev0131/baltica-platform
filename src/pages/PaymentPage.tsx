import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Check,
  Shield,
  Video,
  Headphones,
  FileText,
  Bell,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export default function PaymentPage() {
  const { t, userEmail, userName } = useApp();
  const { addUser, getUserStatus, addLog } = useAdmin();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

  const handlePayment = () => {
    setPaymentStatus('processing');

    // Simulate payment process
    setTimeout(() => {
      // For prototype, always succeed
      setPaymentStatus('success');
      localStorage.setItem('paymentCompleted', 'true');

      // Auto-register user in admin system on payment success
      const existingUser = getUserStatus(userEmail);
      if (!existingUser) {
        const paymentId = 'MP-' + Date.now().toString(36).toUpperCase();
        addUser({
          email: userEmail,
          name: userName || userEmail.split('@')[0],
          status: 'active',
          paymentId,
          notes: 'Auto-registrado por pago Mercado Pago',
        });
      } else {
        addLog({
          userId: existingUser.id,
          userEmail: existingUser.email,
          eventType: 'payment_event',
          eventDetail: 'Pago completado via Mercado Pago',
        });
      }

      // Redirect after success
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 2000);
  };

  const features = [
    { icon: Video, text: t('payment.plan.item2') },
    { icon: Headphones, text: t('payment.plan.item2') },
    { icon: FileText, text: t('payment.plan.item3') },
    { icon: Bell, text: t('payment.plan.item4') },
    { icon: Sparkles, text: t('payment.plan.item5') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            {t('payment.title')}
          </h1>
        </motion.div>

        {/* Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card mb-6 border-primary/20">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">{t('payment.plan.name')}</CardTitle>
              <CardDescription className="text-lg">
                <span className="text-3xl font-bold text-foreground">$29.900</span>
                <span className="text-muted-foreground"> COP</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3 mb-6">
                <p className="font-medium text-sm text-muted-foreground">
                  {t('payment.plan.includes')}:
                </p>
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Provider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mercado Pago</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {t('payment.provider')}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Seleccionado</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Messages */}
        {paymentStatus === 'processing' && (
          <Alert className="mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>{t('payment.processing')}</AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'success' && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              {t('payment.success')}
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'error' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t('payment.error')}</AlertDescription>
          </Alert>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            className="w-full py-6 text-lg rounded-full gap-2"
            onClick={handlePayment}
            disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
          >
            {paymentStatus === 'processing' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <Check className="h-5 w-5" />
                Completado
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                {t('payment.cta')}
              </>
            )}
          </Button>
        </motion.div>

        {/* Free Access Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {t('payment.note')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
