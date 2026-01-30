import { useState } from 'react';
import { useAdmin, ManagedUser } from '@/contexts/AdminContext';
import { useApp } from '@/contexts/AppContext';
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
} from 'lucide-react';
import { motion } from 'framer-motion';

function StatusBadge({ status }: { status: ManagedUser['status'] }) {
  const config = {
    active: { label: 'Activo', variant: 'default' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    suspended: { label: 'Suspendido', variant: 'secondary' as const, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    expired: { label: 'Expirado', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  };
  const c = config[status];
  return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
}

function AddUserDialog() {
  const { addUser, defaultAccessDays } = useAdmin();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [days, setDays] = useState(String(defaultAccessDays));
  const [paymentId, setPaymentId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    addUser({
      email,
      name,
      status: 'active',
      accessDurationDays: parseInt(days, 10) || defaultAccessDays,
      paymentId: paymentId || undefined,
      notes: notes || undefined,
    });
    setName(''); setEmail(''); setDays(String(defaultAccessDays)); setPaymentId(''); setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><UserPlus className="h-4 w-4" /> Agregar usuario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar nuevo usuario</DialogTitle>
          <DialogDescription>Crea una cuenta con acceso al programa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-name">Nombre</Label>
            <Input id="add-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-email">Email</Label>
            <Input id="add-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-days">Días de acceso</Label>
            <Input id="add-days" type="number" min={1} value={days} onChange={e => setDays(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-payment">ID de pago (opcional)</Label>
            <Input id="add-payment" value={paymentId} onChange={e => setPaymentId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-notes">Notas (opcional)</Label>
            <Input id="add-notes" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit">Crear usuario</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserRow({ user }: { user: ManagedUser }) {
  const { suspendUser, reactivateUser, removeUser } = useAdmin();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const daysLeft = Math.max(0, Math.ceil((new Date(user.accessExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

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
              <span>Día {user.currentDay}/3</span>
              <span>{user.completedDays.length} completados</span>
              <span>Racha: {user.streak}</span>
              <span>{daysLeft} días restantes</span>
              {user.paymentId && <span>Pago: {user.paymentId}</span>}
            </div>
            {user.notes && <p className="text-xs text-muted-foreground mt-1 italic">{user.notes}</p>}
          </div>

          <div className="flex gap-2 shrink-0">
            {user.status === 'active' ? (
              <Button variant="outline" size="sm" className="gap-1 text-red-600" onClick={() => suspendUser(user.id)}>
                <Ban className="h-3 w-3" /> Suspender
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1 text-green-600" onClick={() => reactivateUser(user.id)}>
                <RefreshCw className="h-3 w-3" /> Reactivar
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'expired'>('all');
  const [newDefaultDays, setNewDefaultDays] = useState(String(defaultAccessDays));

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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestión de usuarios y accesos</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" /> Usuarios</TabsTrigger>
            <TabsTrigger value="logs" className="gap-2"><Activity className="h-4 w-4" /> Logs</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Config</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { label: 'Total', value: stats.total, color: 'text-foreground' },
                { label: 'Activos', value: stats.active, color: 'text-green-600' },
                { label: 'Suspendidos', value: stats.suspended, color: 'text-red-600' },
                { label: 'Expirados', value: stats.expired, color: 'text-yellow-600' },
                { label: 'Completaron', value: stats.completed, color: 'text-primary' },
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
                  placeholder="Buscar por nombre o email..."
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
                    {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : f === 'suspended' ? 'Suspendidos' : 'Expirados'}
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
                    {users.length === 0 ? 'No hay usuarios registrados aún.' : 'No se encontraron usuarios con ese filtro.'}
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
                <CardTitle className="text-lg">Registros de actividad</CardTitle>
                <CardDescription>Historial de acciones administrativas y de usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                {accessLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hay registros aún.</p>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {accessLogs.slice(0, 100).map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground">{log.eventDetail}</p>
                          <p className="text-xs text-muted-foreground">{log.userEmail} — {new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">{log.eventType}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="shadow-card max-w-md">
              <CardHeader>
                <CardTitle className="text-lg">Configuración de acceso</CardTitle>
                <CardDescription>Valores por defecto para nuevos usuarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-days">Días de acceso por defecto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="default-days"
                      type="number"
                      min={1}
                      value={newDefaultDays}
                      onChange={e => setNewDefaultDays(e.target.value)}
                    />
                    <Button onClick={() => setDefaultAccessDays(parseInt(newDefaultDays, 10) || 60)}>
                      Guardar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Actualmente: {defaultAccessDays} días</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Admin email: <span className="font-mono">admin@baltica.app</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
