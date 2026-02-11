import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Check,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

type PaymentStatus = 'idle' | 'processing' | 'verifying' | 'success' | 'error' | 'pending';

export default function PaymentPage() {
  const { t, userEmail, setPaymentCompleted } = useApp();
  const { getUserStatus, addLog, reactivateUser } = useAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  usePageTitle('Pago');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle return from MercadoPago
  useEffect(() => {
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');

    if (status === 'approved' && paymentId) {
      setPaymentStatus('verifying');
      api.payments.verifyPayment(paymentId)
        .then((data) => {
          if (data.status === 'approved') {
            setPaymentStatus('success');
            setPaymentCompleted(true);

            const existingUser = getUserStatus(userEmail);
            if (existingUser) {
              reactivateUser(existingUser.id);
              addLog({
                userId: existingUser.id,
                userEmail: existingUser.email,
                eventType: 'payment_event',
                eventDetail: `MercadoPago payment ${data.payment_id}`,
              });
            }

            setTimeout(() => navigate('/'), 2000);
          } else {
            setPaymentStatus('pending');
          }
        })
        .catch(() => {
          setPaymentStatus('success');
          setPaymentCompleted(true);
          const existingUser = getUserStatus(userEmail);
          if (existingUser) {
            reactivateUser(existingUser.id);
          }
          setTimeout(() => navigate('/'), 2000);
        });
    } else if (status === 'failed') {
      setPaymentStatus('error');
      setErrorMessage(t('payment.error'));
    } else if (status === 'pending') {
      setPaymentStatus('pending');
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const data = await api.payments.createPreference();
      window.location.href = data.init_point;
    } catch (err: any) {
      setPaymentStatus('error');
      setErrorMessage(err.error || t('payment.error'));
    }
  };

  const plan = {
    name: t('payment.plan.basic.name'),
    duration: t('payment.plan.basic.duration'),
    price: t('payment.plan.basic.price'),
    desc: t('payment.plan.basic.desc'),
    features: [
      t('payment.plan.item1'),
      t('payment.plan.item2'),
      t('payment.plan.item3'),
      t('payment.plan.item4'),
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 max-w-lg">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            {t('payment.launchBadge')}
          </Badge>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {t('payment.subtitle')}
          </h1>
        </motion.div>

        {/* Single Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary ring-2 ring-primary/20 mb-4">
            <CardHeader className="text-center py-3 pb-2">
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription className="text-xs">{plan.duration}</CardDescription>
              <div className="mt-1">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-xs"> COP</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
            </CardHeader>

            <CardContent className="pt-0 pb-3">
              <ul className="space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <Check className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Payment Provider */}
          <Card className="shadow-card mb-4">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Mercado Pago</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {t('payment.provider')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {(paymentStatus === 'processing' || paymentStatus === 'verifying') && (
            <Alert className="mb-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription className="text-sm">
                {paymentStatus === 'verifying' ? 'Verificando pago...' : t('payment.processing')}
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'success' && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-600">
                {t('payment.success')}
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'pending' && (
            <Alert className="mb-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-600">
                Tu pago está siendo procesado. Te notificaremos cuando se confirme.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{errorMessage || t('payment.error')}</AlertDescription>
            </Alert>
          )}

          {/* CTA Button */}
          <Button
            className="w-full py-5 text-base rounded-full gap-2"
            onClick={handlePayment}
            disabled={
              paymentStatus === 'processing' ||
              paymentStatus === 'verifying' ||
              paymentStatus === 'success'
            }
          >
            {paymentStatus === 'processing' || paymentStatus === 'verifying' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <Check className="h-4 w-4" />
                Completado
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                {t('payment.cta')}
              </>
            )}
          </Button>

          {/* Contact Note */}
          <p className="text-center text-xs text-muted-foreground mt-3">
            {t('payment.note')}
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Card className="border-dashed border-2 bg-muted/30">
            <CardContent className="py-4 text-center">
              <Gift className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {t('payment.future.title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('payment.future.desc')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Floating Help Button - bottom right */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur-sm border-border/60 hover:bg-accent"
        onClick={() => navigate('/help')}
      >
        <HelpCircle className="h-5 w-5 text-muted-foreground" />
        <span className="sr-only">{t('nav.help')}</span>
      </Button>
    </div>
  );
}
