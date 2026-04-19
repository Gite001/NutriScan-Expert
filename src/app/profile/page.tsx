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
        toast({ title: "Profil mis à jour", description: "Informations enregistrées localement." });
      }, 500);
      return;
    }

    if (!profileRef) return;
    setDoc(profileRef, data, { merge: true })
      .then(() => {
        toast({ title: "Profil synchronisé", description: "Vos paramètres ont été mis à jour." });
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
      <header className="flex flex-col gap-8 glass p-8 rounded-[3rem] border-primary/20 shadow-xl relative overflow-hidden bg-white/40">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-primary"><Fingerprint size={120} /></div>
        <div className="flex flex-col items-center text-center gap-6 relative z-10">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/30 shadow-2xl">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-primary text-white text-3xl font-headline font-bold">{user?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold text-primary-950 tracking-tighter uppercase">{user?.displayName}</h1>
            <p className="text-[10px] font-black text-primary-950/60 uppercase tracking-widest">{user?.email}</p>
            {isGuest && <Badge className="bg-accent text-primary-950 text-[10px] font-black uppercase tracking-widest border-none px-4 py-1.5 rounded-full mt-2">Mode Démo</Badge>}
          </div>
          <Button variant="outline" onClick={logout} className="rounded-full gap-2 border-red-500/30 text-red-700 hover:bg-red-50 hover:text-red-800 font-bold uppercase text-[10px] tracking-widest px-8 h-12 shadow-sm">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      {isGuest && (
        <div className="bg-primary/10 border border-primary/30 p-6 rounded-[2.5rem] flex items-center gap-4 text-primary-950 text-xs shadow-inner bg-white/40">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
             <Database className="w-6 h-6" />
          </div>
          <p className="font-bold leading-relaxed">Système SENSOR-X en mode autonome : vos séquences sont stockées localement.</p>
        </div>
      )}

      <div className="flex flex-col gap-12">
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <Settings className="text-primary-950 w-6 h-6 shrink-0" />
            <h2 className="text-xl font-headline font-bold tracking-tight uppercase text-primary-950">Bio-Configuration</h2>
          </div>
          <Card className="rounded-[3rem] overflow-hidden border-primary/20 shadow-xl glass bg-white/60">
            <CardContent className="p-8 space-y-8">
              <form onSubmit={handleSave} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Âge Biologique</Label>
                    <Input 
                      type="number" 
                      value={formState.age} 
                      onChange={(e) => setFormState({...formState, age: e.target.value})}
                      className="rounded-2xl border-primary/20 h-14 bg-white/80 text-primary-950 font-bold text-lg px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Sexe</Label>
                    <Select value={formState.sex} onValueChange={(val) => setFormState({...formState, sex: val})}>
                      <SelectTrigger className="rounded-2xl border-primary/20 h-14 bg-white/80 text-primary-950 font-bold px-6">
                        <SelectValue />
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Intensité d'Activité</Label>
                  <Select value={formState.activityLevel} onValueChange={(val) => setFormState({...formState, activityLevel: val})}>
                    <SelectTrigger className="rounded-2xl border-primary/20 h-14 bg-white/80 text-primary-950 font-bold px-6">
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Objectifs Cellulaires</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Perte de poids', 'Gain de muscle', 'Énergie', 'Sommeil'].map(goal => (
                      <div key={goal} className="flex items-center space-x-4 glass p-5 rounded-2xl border-primary/10 bg-white/40 hover:border-primary/40 transition-all cursor-pointer">
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
                        <label htmlFor={goal} className="text-xs font-black cursor-pointer uppercase tracking-tight flex-1 text-primary-950">{goal}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  disabled={saving} 
                  className="w-full rounded-2xl bg-primary text-white hover:bg-primary/90 min-h-16 py-4 px-8 gap-4 shadow-xl shadow-primary/20 text-xs font-black uppercase tracking-widest transition-all active:scale-95 whitespace-normal h-auto leading-tight"
                >
                  {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                  <span>Mettre à jour les paramètres</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6 pb-12">
          <div className="flex items-center gap-3 px-4">
            <History className="text-primary-950 w-6 h-6 shrink-0" />
            <h2 className="text-xl font-headline font-bold tracking-tight uppercase text-primary-950">Archives Tactiques</h2>
          </div>
          <div className="flex flex-col gap-4">
            {!history || history.length === 0 ? (
              <div className="text-center py-20 glass rounded-[3rem] border-dashed border-primary/30 bg-white/40">
                <Apple className="w-16 h-16 text-primary-950/20 mx-auto mb-4 animate-bounce" />
                <p className="text-primary-950/40 font-black uppercase tracking-widest text-[10px]">Aucune archive détectée</p>
              </div>
            ) : (
              history.map((scan, idx) => (
                <div 
                  key={scan.id || idx} 
                  className="glass p-6 rounded-[2.5rem] border-primary/10 flex items-center justify-between hover:border-primary/40 transition-all card-shine cursor-pointer bg-white/60 shadow-md"
                  onClick={() => {
                    localStorage.setItem('lastScanResult', scan.result);
                    window.location.href = '/scan/results';
                  }}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl text-xl flex items-center justify-center font-black text-white shrink-0 shadow-lg",
                      scan.nutriScore === 'A' ? "bg-emerald-600" :
                      scan.nutriScore === 'B' ? "bg-green-600" :
                      scan.nutriScore === 'C' ? "bg-yellow-600" :
                      scan.nutriScore === 'D' ? "bg-orange-600" : "bg-red-600"
                    )}>
                      {scan.nutriScore}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline font-bold text-lg text-primary-950 truncate tracking-tighter">{scan.productName}</h4>
                      <div className="flex items-center gap-3 mt-1">
                         <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary-950 px-2 py-0 uppercase tracking-widest">Score: {scan.globalScore}</Badge>
                         <p className="text-[8px] text-primary-950/60 font-black uppercase tracking-widest">
                          {scan.scannedAt && !isGuest ? format(scan.scannedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 
                           scan.scannedAt ? format(new Date(scan.scannedAt), 'dd MMM yyyy', { locale: fr }) : '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-primary-950/30 shrink-0" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
