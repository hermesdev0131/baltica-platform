import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
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
  Star,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';

type PaymentStatus = 'idle' | 'processing' | 'verifying' | 'success' | 'error' | 'pending';
type PlanType = 'basic' | 'medium' | 'premium';

export default function PaymentPage() {
  const { t, userEmail, setPaymentCompleted } = useApp();
  const { getUserStatus, addLog, reactivateUser } = useAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('basic');
  const [showComingSoonAlert, setShowComingSoonAlert] = useState(false);

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
    // Show coming soon alert for non-basic plans
    if (selectedPlan !== 'basic') {
      setShowComingSoonAlert(true);
      setTimeout(() => setShowComingSoonAlert(false), 4000);
      return;
    }

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

  const plans = [
    {
      id: 'basic' as PlanType,
      name: t('payment.plan.basic.name'),
      duration: t('payment.plan.basic.duration'),
      price: t('payment.plan.basic.price'),
      desc: t('payment.plan.basic.desc'),
      active: true,
      badge: null,
      bonus: null,
      icon: Zap,
      features: [
        t('payment.plan.item1'),
        t('payment.plan.item2'),
        t('payment.plan.item3'),
        t('payment.plan.item4'),
      ],
    },
    {
      id: 'medium' as PlanType,
      name: t('payment.plan.medium.name'),
      duration: t('payment.plan.medium.duration'),
      price: t('payment.plan.medium.price'),
      desc: t('payment.plan.medium.desc'),
      active: false,
      badge: t('payment.plan.medium.badge'),
      bonus: t('payment.plan.medium.bonus'),
      icon: Star,
      features: [
        t('payment.plan.item1'),
        t('payment.plan.item2'),
        t('payment.plan.item3'),
        t('payment.plan.item4'),
        t('payment.plan.medium.bonus'),
      ],
    },
    {
      id: 'premium' as PlanType,
      name: t('payment.plan.premium.name'),
      duration: t('payment.plan.premium.duration'),
      price: t('payment.plan.premium.price'),
      desc: t('payment.plan.premium.desc'),
      active: false,
      badge: t('payment.plan.premium.badge'),
      bonus: t('payment.plan.premium.bonus'),
      icon: Rocket,
      features: [
        t('payment.plan.item1'),
        t('payment.plan.item2'),
        t('payment.plan.item3'),
        t('payment.plan.item4'),
        t('payment.plan.premium.bonus'),
        t('payment.plan.premium.updates'),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            {t('payment.launchBadge')}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('payment.title')}
          </h1>
          <p className="text-lg text-primary font-semibold">{t('payment.subtitle')}</p>
          <p className="text-sm text-muted-foreground mt-2">{t('payment.launchNote')}</p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/50'
                } ${plan.id === 'medium' ? 'md:-mt-4 md:mb-4' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Selected indicator */}
                {selectedPlan === plan.id && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-primary/10">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm"> COP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span className={feature === plan.bonus ? 'text-primary font-medium' : ''}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          {/* Payment Provider */}
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
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {(paymentStatus === 'processing' || paymentStatus === 'verifying') && (
            <Alert className="mb-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                {paymentStatus === 'verifying' ? 'Verificando pago...' : t('payment.processing')}
              </AlertDescription>
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

          {paymentStatus === 'pending' && (
            <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-600">
                Tu pago está siendo procesado. Te notificaremos cuando se confirme.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'error' && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage || t('payment.error')}</AlertDescription>
            </Alert>
          )}

          {showComingSoonAlert && (
            <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-600">
                {t('payment.planComingSoon')}
              </AlertDescription>
            </Alert>
          )}

          {/* CTA Button */}
          <Button
            className="w-full py-6 text-lg rounded-full gap-2"
            onClick={handlePayment}
            disabled={
              paymentStatus === 'processing' ||
              paymentStatus === 'verifying' ||
              paymentStatus === 'success'
            }
          >
            {paymentStatus === 'processing' || paymentStatus === 'verifying' ? (
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
                {t('payment.cta')} - {plans.find(p => p.id === selectedPlan)?.price}
              </>
            )}
          </Button>

          {/* Contact Note */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t('payment.note')}
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="border-dashed border-2 bg-muted/30">
            <CardContent className="py-8">
              <Gift className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('payment.future.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('payment.future.desc')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
