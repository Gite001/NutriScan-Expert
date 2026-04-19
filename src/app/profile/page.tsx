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
import { LogOut, Save, History, Settings, Loader2, ChevronRight, Apple, Database, Fingerprint } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-[3rem] border-primary/10 shadow-xl relative overflow-hidden card-shine">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Fingerprint size={120} /></div>
        <div className="flex items-center gap-4 md:gap-6 min-w-0 relative z-10">
          <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-primary/20 shrink-0 shadow-lg animate-float">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-primary text-white text-2xl md:text-3xl font-headline font-bold">{user?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary truncate max-w-full tracking-tighter">
                {user?.displayName}
              </h1>
              {isGuest && <Badge className="bg-accent text-accent-foreground text-[8px] font-black uppercase tracking-widest border-none">Mode Démo</Badge>}
            </div>
            <p className="text-muted-foreground text-xs font-medium truncate uppercase tracking-widest opacity-60">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="rounded-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-fit relative z-10 font-bold uppercase text-[10px] tracking-widest">
          <LogOut className="w-4 h-4" />
          Quitter la Session
        </Button>
      </header>

      {isGuest && (
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-3xl flex items-center gap-3 text-primary text-sm shadow-inner card-shine">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
             <Database className="w-5 h-5" />
          </div>
          <p className="font-medium">En mode démo, vos séquences moléculaires sont stockées uniquement dans ce navigateur.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Settings className="text-primary w-5 h-5" />
            <h2 className="text-2xl font-headline font-bold tracking-tight uppercase">Configuration Bio</h2>
          </div>
          <Card className="rounded-[3rem] overflow-hidden border-primary/10 shadow-2xl glass card-shine">
            <CardContent className="pt-8 space-y-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Âge Biologique</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      value={formState.age} 
                      onChange={(e) => setFormState({...formState, age: e.target.value})}
                      className="rounded-2xl border-primary/10 focus:border-primary focus:ring-primary/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sexe</Label>
                    <Select value={formState.sex} onValueChange={(val) => setFormState({...formState, sex: val})}>
                      <SelectTrigger className="rounded-2xl border-primary/10 h-12">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intensité d'Activité</Label>
                  <Select value={formState.activityLevel} onValueChange={(val) => setFormState({...formState, activityLevel: val})}>
                    <SelectTrigger className="rounded-2xl border-primary/10 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="sédentaire">Sédentaire</SelectItem>
                      <SelectItem value="peu actif">Peu actif</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="sportif">Sportif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Objectifs Cellulaires</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Perte de poids', 'Gain de muscle', 'Plus d\'énergie', 'Sommeil'].map(goal => (
                      <div key={goal} className="flex items-center space-x-2 glass p-3 rounded-2xl border-primary/5 hover:border-primary/20 transition-all cursor-pointer">
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
                        <label htmlFor={goal} className="text-[11px] font-bold cursor-pointer uppercase tracking-tight">{goal}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button disabled={saving} className="w-full rounded-[1.5rem] bg-primary hover:bg-primary/90 h-14 gap-3 shadow-xl shadow-primary/20 text-[12px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Mettre à jour les paramètres
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <History className="text-primary w-5 h-5" />
            <h2 className="text-2xl font-headline font-bold tracking-tight uppercase">Archives Tactiques</h2>
          </div>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {!history || history.length === 0 ? (
              <div className="text-center py-20 glass rounded-[3rem] border-dashed border-primary/20">
                <Apple className="w-16 h-16 text-primary/10 mx-auto mb-6 animate-float" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-50">Aucune archive détectée</p>
              </div>
            ) : (
              history.map((scan, idx) => (
                <div 
                  key={scan.id || idx} 
                  className="glass p-6 rounded-[2.5rem] border-primary/5 flex items-center justify-between history-card-hover group card-shine"
                  onClick={() => {
                    localStorage.setItem('lastScanResult', scan.result);
                    window.location.href = '/scan/results';
                  }}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <Badge className={cn(
                      "w-12 h-12 rounded-2xl text-xl flex items-center justify-center font-black text-white shrink-0 shadow-lg group-hover:rotate-6 transition-transform",
                      scan.nutriScore === 'A' ? "bg-emerald-500 shadow-emerald-500/20" :
                      scan.nutriScore === 'B' ? "bg-green-500 shadow-green-500/20" :
                      scan.nutriScore === 'C' ? "bg-yellow-500 shadow-yellow-500/20" :
                      scan.nutriScore === 'D' ? "bg-orange-500 shadow-orange-500/20" : "bg-red-500 shadow-red-500/20"
                    )}>
                      {scan.nutriScore}
                    </Badge>
                    <div className="min-w-0">
                      <h4 className="font-headline font-bold text-lg leading-none group-hover:text-primary transition-colors truncate tracking-tighter">{scan.productName}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                         <Badge variant="outline" className="text-[7px] font-black border-primary/20 text-primary px-2 uppercase tracking-tighter">Score: {scan.globalScore}</Badge>
                         <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                          {scan.scannedAt && !isGuest ? format(scan.scannedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 
                           scan.scannedAt ? format(new Date(scan.scannedAt), 'dd MMM yyyy', { locale: fr }) : 'Date inconnue'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}