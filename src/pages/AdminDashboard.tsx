import { useState } from 'react';
import { useAdmin, ManagedUser } from '@/contexts/AdminContext';
import { useApp } from '@/contexts/AppContext';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  UserPlus,
  Shield,
  Clock,
  Activity,
  Ban,
  RefreshCw,
  Trash2,
  Settings,
  Search,
  Calendar,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

function StatusBadge({ status }: { status: ManagedUser['status'] }) {
  const { t } = useApp();
  const config = {
    active: { label: t('admin.status.active'), variant: 'default' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    suspended: { label: t('admin.status.suspended'), variant: 'secondary' as const, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    expired: { label: t('admin.status.expired'), variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  };
  const c = config[status];
  return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
}

function AddUserDialog() {
  const { addUser, defaultAccessDays } = useAdmin();
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [days, setDays] = useState(String(defaultAccessDays));
  const [paymentId, setPaymentId] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;
    addUser({
      email,
      name,
      password,
      status: 'active',
      accessDurationDays: parseInt(days, 10) || defaultAccessDays,
      paymentId: paymentId || undefined,
      notes: notes || undefined,
    });
    setName(''); setEmail(''); setPassword(''); setDays(String(defaultAccessDays)); setPaymentId(''); setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><UserPlus className="h-4 w-4" /> {t('admin.addUser')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('admin.addUser.title')}</DialogTitle>
          <DialogDescription>{t('admin.addUser.desc')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-name">{t('admin.addUser.name')}</Label>
            <Input id="add-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-email">{t('admin.addUser.email')}</Label>
            <Input id="add-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-password">{t('admin.addUser.password')}</Label>
            <div className="relative">
              <Input id="add-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-9" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-days">{t('admin.addUser.days')}</Label>
            <Input id="add-days" type="number" min={1} value={days} onChange={e => setDays(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-payment">{t('admin.addUser.payment')}</Label>
            <Input id="add-payment" value={paymentId} onChange={e => setPaymentId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-notes">{t('admin.addUser.notes')}</Label>
            <Input id="add-notes" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit">{t('admin.addUser.submit')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserRow({ user }: { user: ManagedUser }) {
  const { suspendUser, reactivateUser, removeUser, accessLogs, updateAccessDuration } = useAdmin();
  const { t } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showExpiration, setShowExpiration] = useState(false);
  const [newDays, setNewDays] = useState(String(user.accessDurationDays));

  const daysLeft = Math.max(0, Math.ceil((new Date(user.accessExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const userLogs = accessLogs.filter(log => log.userId === user.id);

  const translateDetail = (detail: string) => {
    const [key, param] = detail.split(':');
    const tKey = `admin.logs.event.${key}.detail` as any;
    const translated = t(tKey);
    if (translated === tKey) return detail;
    return param ? translated.replace('{days}', param) : translated;
  };
  const translateType = (type: string) => {
    const tKey = `admin.logs.event.${type}` as any;
    const translated = t(tKey);
    return translated === tKey ? type : translated;
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-foreground truncate">{user.name}</p>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span>{t('admin.user.day')} {user.currentDay}/3</span>
              <span>{user.completedDays.length} {t('admin.user.completed')}</span>
              <span>{t('admin.user.streak')}: {user.streak}</span>
              <span>{daysLeft} {t('admin.user.daysLeft')}</span>
              {user.paymentId && <span>{t('admin.user.payment')}: {user.paymentId}</span>}
            </div>
            {user.notes && <p className="text-xs text-muted-foreground mt-1 italic">{user.notes}</p>}
          </div>

          <div className="flex gap-2 shrink-0">
            <Dialog open={showLogs} onOpenChange={setShowLogs}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Activity className="h-3 w-3" /> {t('admin.user.logs')} ({userLogs.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>{t('admin.user.logs')} — {user.name}</DialogTitle>
                  <DialogDescription>{user.email}</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 overflow-y-auto max-h-[50vh]">
                  {userLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">{t('admin.user.noLogs')}</p>
                  ) : (
                    userLogs.map(log => (
                      <div key={log.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground">{translateDetail(log.eventDetail)}</p>
                          <p className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[10px]">{translateType(log.eventType)}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showExpiration} onOpenChange={setShowExpiration}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-3 w-3" /> {daysLeft}d
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>{t('admin.user.editExpiration')}</DialogTitle>
                  <DialogDescription>{user.name} — {user.email}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>{t('admin.user.newDays')}</Label>
                    <Input type="number" min={1} value={newDays} onChange={e => setNewDays(e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={() => { updateAccessDuration(user.id, parseInt(newDays, 10) || 30); setShowExpiration(false); }}>
                    {t('admin.settings.save')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {user.status === 'active' ? (
              <Button variant="outline" size="sm" className="gap-1 text-red-600" onClick={() => suspendUser(user.id)}>
                <Ban className="h-3 w-3" /> {t('admin.user.suspend')}
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1 text-green-600" onClick={() => reactivateUser(user.id)}>
                <RefreshCw className="h-3 w-3" /> {t('admin.user.reactivate')}
              </Button>
            )}
            {confirmDelete ? (
              <div className="flex gap-1">
                <Button variant="destructive" size="sm" onClick={() => { removeUser(user.id); setConfirmDelete(false); }}>Sí</Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>No</Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { users, accessLogs, defaultAccessDays, setDefaultAccessDays } = useAdmin();
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'users';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'expired'>('all');
  const [newDefaultDays, setNewDefaultDays] = useState(String(defaultAccessDays));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    expired: users.filter(u => u.status === 'expired').length,
    completed: users.filter(u => u.completedDays.length >= 3).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('admin.title')}</h1>
              <p className="text-muted-foreground">{t('admin.subtitle')}</p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={v => setSearchParams({ tab: v })}>
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" /> {t('admin.tabs.users')}</TabsTrigger>
            <TabsTrigger value="logs" className="gap-2"><Activity className="h-4 w-4" /> {t('admin.tabs.logs')}</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> {t('admin.tabs.settings')}</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { label: t('admin.stats.total'), value: stats.total, color: 'text-foreground' },
                { label: t('admin.stats.active'), value: stats.active, color: 'text-green-600' },
                { label: t('admin.stats.suspended'), value: stats.suspended, color: 'text-red-600' },
                { label: t('admin.stats.expired'), value: stats.expired, color: 'text-yellow-600' },
                { label: t('admin.stats.completed'), value: stats.completed, color: 'text-primary' },
              ].map(s => (
                <Card key={s.label} className="shadow-card">
                  <CardContent className="p-3 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.search')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'active', 'suspended', 'expired'] as const).map(f => (
                  <Button
                    key={f}
                    variant={statusFilter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(f)}
                  >
                    {t(`admin.filter.${f}`)}
                  </Button>
                ))}
              </div>
              <AddUserDialog />
            </div>

            {/* User list */}
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    {users.length === 0 ? t('admin.user.noUsers') : t('admin.user.noResults')}
                  </CardContent>
                </Card>
              ) : (
                filteredUsers.map(user => <UserRow key={user.id} user={user} />)
              )}
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{t('admin.logs.title')}</CardTitle>
                <CardDescription>{t('admin.logs.desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {accessLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t('admin.logs.empty')}</p>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {accessLogs.slice(0, 100).map(log => {
                      const translateDetail = (detail: string) => {
                        const [key, param] = detail.split(':');
                        const tKey = `admin.logs.event.${key}.detail` as any;
                        const translated = t(tKey);
                        if (translated === tKey) return detail;
                        return param ? translated.replace('{days}', param) : translated;
                      };
                      const translateType = (type: string) => {
                        const tKey = `admin.logs.event.${type}` as any;
                        const translated = t(tKey);
                        return translated === tKey ? type : translated;
                      };
                      return (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground">{translateDetail(log.eventDetail)}</p>
                            <p className="text-xs text-muted-foreground">{log.userEmail} — {new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs">{translateType(log.eventType)}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{t('admin.settings.title')}</CardTitle>
                <CardDescription>{t('admin.settings.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-days">{t('admin.settings.defaultDays')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="default-days"
                      type="number"
                      min={1}
                      value={newDefaultDays}
                      onChange={e => setNewDefaultDays(e.target.value)}
                    />
                    <Button onClick={() => setDefaultAccessDays(parseInt(newDefaultDays, 10) || 60)}>
                      {t('admin.settings.save')}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('admin.settings.current')}: {defaultAccessDays} días</p>
                </div>

              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {t('admin.settings.changePassword')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('admin.settings.currentPassword')}</Label>
                  <Input type={showPasswords ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.settings.newPassword')}</Label>
                  <Input type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.settings.confirmPassword')}</Label>
                  <Input type={showPasswords ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="gap-1 text-xs"
                  >
                    {showPasswords ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showPasswords ? t('admin.settings.hidePasswords') : t('admin.settings.showPasswords')}
                  </Button>
                </div>
                {passwordMsg && (
                  <p className={`text-sm ${passwordMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordMsg.text}
                  </p>
                )}
                <Button
                  className="w-full"
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                  onClick={async () => {
                    if (newPassword !== confirmPassword) {
                      setPasswordMsg({ type: 'error', text: t('admin.settings.passwordMismatch') });
                      return;
                    }
                    if (newPassword.length < 6) {
                      setPasswordMsg({ type: 'error', text: t('admin.settings.passwordTooShort') });
                      return;
                    }
                    try {
                      await api.auth.changePassword({ currentPassword, newPassword });
                      setPasswordMsg({ type: 'success', text: t('admin.settings.passwordChanged') });
                      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
                    } catch {
                      setPasswordMsg({ type: 'error', text: t('admin.settings.passwordError') });
                    }
                  }}
                >
                  {t('admin.settings.changePassword')}
                </Button>
              </CardContent>
            </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
