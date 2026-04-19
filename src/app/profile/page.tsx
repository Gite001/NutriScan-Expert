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

  const [formState, setFormState] = useState({
    age: '',
    sex: 'male',
    activityLevel: 'sédentaire',
    healthGoals: [] as string[],
  });
  const [localHistory, setLocalHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isGuest) {
      const savedProfile = localStorage.getItem('guestProfile');
      if (savedProfile) {
        setFormState(JSON.parse(savedProfile));
      }
      const savedHistory = localStorage.getItem('guestScans');
      if (savedHistory) {
        setLocalHistory(JSON.parse(savedHistory).reverse());
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
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-primary/20 shadow-xl relative overflow-hidden card-shine">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-primary"><Fingerprint size={120} /></div>
        <div className="flex items-center gap-4 md:gap-6 min-w-0 relative z-10">
          <Avatar className="w-16 h-16 md:w-24 md:h-24 border-4 border-primary/30 shrink-0 shadow-lg animate-float">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl md:text-3xl font-headline font-bold">{user?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-3xl font-headline font-bold text-primary truncate max-w-full tracking-tighter">
                {user?.displayName}
              </h1>
              {isGuest && <Badge className="bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-widest border-none px-3 py-1">Mode Démo</Badge>}
            </div>
            <p className="text-foreground/70 text-[10px] font-black truncate uppercase tracking-widest">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="rounded-full gap-2 border-red-500 text-red-700 hover:bg-red-50 hover:text-red-800 w-fit relative z-10 font-bold uppercase text-[10px] tracking-widest px-6 h-10">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </header>

      {isGuest && (
        <div className="bg-primary/10 border border-primary/30 p-5 rounded-[2rem] flex items-center gap-4 text-primary text-xs shadow-inner card-shine">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
             <Database className="w-5 h-5" />
          </div>
          <p className="font-bold leading-relaxed">En mode démo, vos séquences sont stockées uniquement sur ce terminal.</p>
        </div>
      )}

      <div className="space-y-12">
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Settings className="text-primary w-6 h-6" />
            <h2 className="text-xl font-headline font-bold tracking-tight uppercase text-foreground">Configuration Bio</h2>
          </div>
          <Card className="rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-primary/20 shadow-2xl glass card-shine">
            <CardContent className="p-6 md:p-8 space-y-8">
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 ml-1">Âge Biologique</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      value={formState.age} 
                      onChange={(e) => setFormState({...formState, age: e.target.value})}
                      className="rounded-2xl border-primary/20 focus:border-primary focus:ring-primary/20 h-12 bg-white/50 text-foreground font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 ml-1">Sexe</Label>
                    <Select value={formState.sex} onValueChange={(val) => setFormState({...formState, sex: val})}>
                      <SelectTrigger className="rounded-2xl border-primary/20 h-12 bg-white/50 text-foreground font-bold">
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/60 ml-1">Intensité d'Activité</Label>
                  <Select value={formState.activityLevel} onValueChange={(val) => setFormState({...formState, activityLevel: val})}>
                    <SelectTrigger className="rounded-2xl border-primary/20 h-12 bg-white/50 text-foreground font-bold">
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/60 ml-1">Objectifs Cellulaires</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Perte de poids', 'Gain de muscle', 'Plus d\'énergie', 'Sommeil'].map(goal => (
                      <div key={goal} className="flex items-center space-x-3 glass p-4 rounded-2xl border-primary/10 hover:border-primary/40 transition-all cursor-pointer bg-white/40">
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
                        <label htmlFor={goal} className="text-[11px] font-black cursor-pointer uppercase tracking-tight flex-1 text-foreground">{goal}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  disabled={saving} 
                  className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 h-auto min-h-14 py-4 px-6 gap-3 shadow-xl shadow-primary/20 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 leading-tight"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 shrink-0" />}
                  <span className="flex-1">Mettre à jour les paramètres</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6 pb-12">
          <div className="flex items-center gap-2 px-2">
            <History className="text-primary w-6 h-6" />
            <h2 className="text-xl font-headline font-bold tracking-tight uppercase text-foreground">Archives Tactiques</h2>
          </div>
          <div className="space-y-4">
            {!history || history.length === 0 ? (
              <div className="text-center py-16 glass rounded-[2.5rem] border-dashed border-primary/30">
                <Apple className="w-12 h-12 text-primary/20 mx-auto mb-4 animate-float" />
                <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px]">Aucune archive détectée</p>
              </div>
            ) : (
              history.map((scan, idx) => (
                <div 
                  key={scan.id || idx} 
                  className="glass p-5 rounded-[2rem] border-primary/10 flex items-center justify-between history-card-hover group card-shine cursor-pointer"
                  onClick={() => {
                    localStorage.setItem('lastScanResult', scan.result);
                    window.location.href = '/scan/results';
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl text-lg flex items-center justify-center font-black text-white shrink-0 shadow-lg group-hover:rotate-6 transition-transform",
                      scan.nutriScore === 'A' ? "bg-emerald-600" :
                      scan.nutriScore === 'B' ? "bg-green-600" :
                      scan.nutriScore === 'C' ? "bg-yellow-600" :
                      scan.nutriScore === 'D' ? "bg-orange-600" : "bg-red-600"
                    )}>
                      {scan.nutriScore}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline font-bold text-base leading-tight group-hover:text-primary transition-colors truncate tracking-tighter text-foreground">{scan.productName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <Badge variant="outline" className="text-[7px] font-black border-primary/20 text-primary px-1.5 py-0 uppercase tracking-tighter">Score: {scan.globalScore}</Badge>
                         <p className="text-[8px] text-foreground/60 font-black uppercase tracking-widest">
                          {scan.scannedAt && !isGuest ? format(scan.scannedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 
                           scan.scannedAt ? format(new Date(scan.scannedAt), 'dd MMM yyyy', { locale: fr }) : 'Date inconnue'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}