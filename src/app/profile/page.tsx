
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, collection, query, where, orderBy } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Save, History, Settings, Loader2, ChevronRight, Apple, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  const isGuest = user?.uid === 'guest-user-123';

  // Firestore sync - only for non-guest users
  const profileRef = useMemo(() => !isGuest && user && db ? doc(db, 'profiles', user.uid) : null, [db, user, isGuest]);
  const { data: profileData, loading: profileLoading } = useDoc(profileRef);

  const historyQuery = useMemo(() => {
    if (isGuest || !db || !user) return null;
    return query(
      collection(db, 'scans'),
      where('userId', '==', user.uid),
      orderBy('scannedAt', 'desc')
    );
  }, [db, user, isGuest]);
  const { data: firestoreHistory, loading: historyLoading } = useCollection(historyQuery);

  // Local state for guest mode or form management
  const [formState, setFormState] = useState({
    age: '',
    sex: 'male',
    activityLevel: 'sédentaire',
    healthGoals: [] as string[],
  });
  const [localHistory, setLocalHistory] = useState<any[]>([]);

  // Initialize data from LocalStorage (Guest) or Firestore
  useEffect(() => {
    if (isGuest) {
      const savedProfile = localStorage.getItem('guestProfile');
      if (savedProfile) {
        setFormState(JSON.parse(savedProfile));
      }
      const savedHistory = localStorage.getItem('guestScans');
      if (savedHistory) {
        setLocalHistory(JSON.parse(savedHistory).reverse()); // Show newest first
      }
    } else if (profileData) {
      setFormState({
        age: profileData.age?.toString() || '',
        sex: profileData.sex || 'male',
        activityLevel: profileData.activityLevel || 'sédentaire',
        healthGoals: profileData.healthGoals || [],
      });
    }
  }, [profileData, isGuest]);

  const history = isGuest ? localHistory : firestoreHistory;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...formState,
      age: parseInt(formState.age) || 0,
    };

    if (isGuest) {
      localStorage.setItem('guestProfile', JSON.stringify(data));
      setTimeout(() => {
        setSaving(false);
        toast({ title: "Profil (Local) mis à jour", description: "Vos informations ont été enregistrées localement." });
      }, 500);
      return;
    }

    if (!profileRef) return;
    setDoc(profileRef, data, { merge: true })
      .then(() => {
        toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées avec succès." });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: profileRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setSaving(false));
  };

  if ((!isGuest && profileLoading) || (!isGuest && historyLoading)) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[2.5rem] border shadow-sm">
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-primary/10 shrink-0">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-primary text-white text-2xl md:text-3xl">{user?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary truncate max-w-full">
                {user?.displayName}
              </h1>
              {isGuest && <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-[10px]">Démo</Badge>}
            </div>
            <p className="text-muted-foreground text-sm truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="rounded-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-fit">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </header>

      {isGuest && (
        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-center gap-3 text-primary text-sm">
          <Database className="w-5 h-5 shrink-0" />
          <p className="leading-tight">En mode démo, vos données sont enregistrées uniquement sur votre navigateur.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Settings className="text-primary w-5 h-5" />
            <h2 className="text-2xl font-headline font-bold">Paramètres</h2>
          </div>
          <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl bg-white/70 backdrop-blur-sm">
            <CardContent className="pt-8 space-y-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Âge</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      value={formState.age} 
                      onChange={(e) => setFormState({...formState, age: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sexe</Label>
                    <Select value={formState.sex} onValueChange={(val) => setFormState({...formState, sex: val})}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Niveau d'activité</Label>
                  <Select value={formState.activityLevel} onValueChange={(val) => setFormState({...formState, activityLevel: val})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sédentaire">Sédentaire</SelectItem>
                      <SelectItem value="peu actif">Peu actif</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="sportif">Sportif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Objectifs Santé</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Perte de poids', 'Gain de muscle', 'Plus d\'énergie', 'Sommeil'].map(goal => (
                      <div key={goal} className="flex items-center space-x-2 bg-background p-2 rounded-lg border">
                        <Checkbox 
                          id={goal} 
                          checked={formState.healthGoals.includes(goal)}
                          onCheckedChange={(checked) => {
                            const newGoals = checked 
                              ? [...formState.healthGoals, goal]
                              : formState.healthGoals.filter(g => g !== goal);
                            setFormState({...formState, healthGoals: newGoals});
                          }}
                        />
                        <label htmlFor={goal} className="text-xs font-medium cursor-pointer">{goal}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button disabled={saving} className="w-full rounded-xl bg-primary hover:bg-primary/90 h-12 gap-2 shadow-lg shadow-primary/10">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Enregistrer les modifications
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <History className="text-primary w-5 h-5" />
            <h2 className="text-2xl font-headline font-bold">Historique</h2>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {!history || history.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[2.5rem] border border-dashed">
                <Apple className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun scan récent.</p>
              </div>
            ) : (
              history.map((scan, idx) => (
                <div 
                  key={scan.id || idx} 
                  className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => {
                    localStorage.setItem('lastScanResult', scan.result);
                    window.location.href = '/scan/results';
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Badge className={cn(
                      "w-10 h-10 rounded-xl text-lg flex items-center justify-center font-bold text-white shrink-0",
                      scan.nutriScore === 'A' ? "bg-emerald-500" :
                      scan.nutriScore === 'B' ? "bg-green-500" :
                      scan.nutriScore === 'C' ? "bg-yellow-500" :
                      scan.nutriScore === 'D' ? "bg-orange-500" : "bg-red-500"
                    )}>
                      {scan.nutriScore}
                    </Badge>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm leading-none group-hover:text-primary transition-colors truncate">{scan.productName}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {scan.scannedAt && !isGuest ? format(scan.scannedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 
                         scan.scannedAt ? format(new Date(scan.scannedAt), 'dd MMM yyyy', { locale: fr }) : 'Date inconnue'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-muted w-4 h-4 group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
