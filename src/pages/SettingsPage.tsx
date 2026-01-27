import { useApp } from '@/contexts/AppContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { Header } from '@/components/layout/Header';
import { EthicalNote } from '@/components/EthicalNote';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales } from '@/lib/i18n';
import {
  User,
  Bell,
  Palette,
  FileText,
  LogOut,
  Mail,
  Smartphone,
  MessageCircle,
  Sun,
  Moon,
  Monitor,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

export default function SettingsPage() {
  const { t, locale, setLocale, theme, setTheme, userName, setUserName } = useApp();
  const { settings, updateSettings } = useNotificationContext();
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail') || 'usuario@ejemplo.com';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/landing');
  };

  const themeOptions = [
    { value: 'light', label: t('settings.theme.light'), icon: Sun },
    { value: 'dark', label: t('settings.theme.dark'), icon: Moon },
    { value: 'system', label: t('settings.theme.system'), icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-foreground mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('settings.title')}
        </motion.h1>

        <div className="space-y-6">
          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  {t('settings.account')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.account.name')}</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('settings.account.email')}</Label>
                  <Input value={userEmail} disabled className="bg-muted" />
                </div>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  {t('settings.account.logout')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reminders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5" />
                  {t('settings.reminders')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.reminders.daily')}</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe un recordatorio diario
                    </p>
                  </div>
                  <Switch
                    checked={settings.dailyReminder}
                    onCheckedChange={(checked) => updateSettings({ dailyReminder: checked })}
                  />
                </div>

                {settings.dailyReminder && (
                  <div className="flex items-center gap-4">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t('settings.reminders.time')}
                    </Label>
                    <Input
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                      className="w-32"
                    />
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <Label>{t('settings.reminders.channel')}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{t('settings.reminders.email')}</span>
                      </div>
                      <Badge variant="secondary">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>{t('settings.reminders.push')}</span>
                      </div>
                      <Badge variant="outline">Próximamente</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{t('settings.reminders.whatsapp')}</span>
                      </div>
                      <Badge variant="outline">Próximamente</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-5 w-5" />
                  {t('settings.appearance')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('settings.language')}</Label>
                  <Select value={locale} onValueChange={(value: any) => setLocale(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locales.map((loc) => (
                        <SelectItem key={loc.code} value={loc.code}>
                          <span className="flex items-center gap-2">
                            <span>{loc.flag}</span>
                            <span>{loc.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('settings.theme')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.value}
                          variant={theme === option.value ? 'default' : 'outline'}
                          className="flex-col h-auto py-3 gap-2"
                          onClick={() => setTheme(option.value as any)}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{option.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  {t('settings.legal')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/activity-log">
                  <Button variant="ghost" className="w-full justify-between">
                    {t('nav.activityLog')}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-between">
                  {t('settings.legal.terms')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  {t('settings.legal.privacy')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ethical Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EthicalNote variant="inline" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
