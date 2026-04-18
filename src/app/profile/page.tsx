"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Save, History, Settings, User as UserIcon, Loader2, ChevronRight, Apple } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    age: '',
    sex: 'male',
    activityLevel: 'sédentaire',
    healthGoals: [] as string[],
    allergies: [] as string[],
    dietaryPreferences: [] as string[],
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Profile
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as any);
        }

        // Fetch History
        const q = query(
          collection(db, 'scans'),
          where('userId', '==', user.uid),
          orderBy('scannedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'profiles', user.uid), profile);
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées avec succès." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'enregistrer le profil." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border shadow-sm">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary/10">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-primary text-white text-3xl">{user?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold text-primary">{user?.displayName}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="rounded-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Settings */}
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
                      value={profile.age} 
                      onChange={(e) => setProfile({...profile, age: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sexe</Label>
                    <Select value={profile.sex} onValueChange={(val) => setProfile({...profile, sex: val})}>
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
                  <Select value={profile.activityLevel} onValueChange={(val) => setProfile({...profile, activityLevel: val})}>
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
                          checked={profile.healthGoals.includes(goal)}
                          onCheckedChange={(checked) => {
                            const newGoals = checked 
                              ? [...profile.healthGoals, goal]
                              : profile.healthGoals.filter(g => g !== goal);
                            setProfile({...profile, healthGoals: newGoals});
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

        {/* History Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <History className="text-primary w-5 h-5" />
            <h2 className="text-2xl font-headline font-bold">Historique</h2>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {history.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[2.5rem] border border-dashed">
                <Apple className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun scan récent.</p>
              </div>
            ) : (
              history.map((scan) => (
                <div 
                  key={scan.id} 
                  className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => {
                    localStorage.setItem('lastScanResult', scan.result);
                    window.location.href = '/scan/results';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Badge className={cn(
                      "w-10 h-10 rounded-xl text-lg flex items-center justify-center font-bold text-white",
                      scan.nutriScore === 'A' ? "bg-emerald-500" :
                      scan.nutriScore === 'B' ? "bg-green-500" :
                      scan.nutriScore === 'C' ? "bg-yellow-500" :
                      scan.nutriScore === 'D' ? "bg-orange-500" : "bg-red-500"
                    )}>
                      {scan.nutriScore}
                    </Badge>
                    <div>
                      <h4 className="font-bold text-sm leading-none group-hover:text-primary transition-colors">{scan.productName}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {scan.scannedAt ? format(scan.scannedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 'Date inconnue'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-muted w-4 h-4 group-hover:text-primary transition-colors" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}