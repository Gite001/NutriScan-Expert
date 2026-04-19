
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Apple, LogIn, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithEmail(email, password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerWithEmail(email, password, name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-white mb-4 shadow-xl shadow-primary/20">
            <Apple size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-headline font-bold tracking-tight text-primary-950">NutriScan Expert</h1>
          <p className="text-primary-950/70 max-w-[280px] mx-auto font-black uppercase tracking-widest text-[10px]">Votre guide expert pour 2026</p>
        </div>

        <Card className="glass border-primary/30 shadow-2xl bg-white/40 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-headline font-bold text-primary-950 text-2xl uppercase tracking-tighter">Identité Moléculaire</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 rounded-2xl glass mb-8 p-1 border border-primary/20">
                <TabsTrigger value="signin" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all">Connexion</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all">S'inscrire</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="animate-in fade-in duration-500">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Email Radar</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-950/40 w-5 h-5" />
                      <Input 
                        type="email" 
                        placeholder="expert@lab.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white/80 text-primary-950 font-bold focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Séquence d'Accès</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-950/40 w-5 h-5" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white/80 text-primary-950 font-bold focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                    Accéder au Terminal
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="animate-in fade-in duration-500">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Nom de l'Expert</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-950/40 w-5 h-5" />
                      <Input 
                        placeholder="Dr. Maurice" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white/80 text-primary-950 font-bold focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Email Radar</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-950/40 w-5 h-5" />
                      <Input 
                        type="email" 
                        placeholder="expert@lab.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white/80 text-primary-950 font-bold focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary-950/70 ml-2">Séquence d'Accès</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-950/40 w-5 h-5" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white/80 text-primary-950 font-bold focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Initialiser mon Profil
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-primary/20"></span></div>
              <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.5em]"><span className="bg-white/40 px-4 text-primary-950/40">OU</span></div>
            </div>

            <Button 
              onClick={loginWithGoogle} 
              disabled={loading}
              variant="outline"
              className="w-full h-14 rounded-2xl border-primary/30 text-primary-950 font-black uppercase tracking-widest gap-3 hover:bg-white/60 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              Continuer avec Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-[8px] text-primary-950/60 font-black uppercase tracking-[0.4em] px-6 leading-relaxed">
          Accès sécurisé via Firebase Intelligence 2026
        </p>
      </div>
    </div>
  );
}
