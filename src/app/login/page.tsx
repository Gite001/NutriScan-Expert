"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Apple, LogIn, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { login, loading } = useAuth();

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
          <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">NutriScan Expert</h1>
          <p className="text-muted-foreground max-w-[280px] mx-auto font-medium">Votre guide expert pour une alimentation saine et transparente.</p>
        </div>

        <Card className="glass border-primary/20 shadow-2xl bg-white/40">
          <CardHeader className="text-center">
            <CardTitle className="font-headline font-bold text-primary-950">Bienvenue</CardTitle>
            <CardDescription className="text-primary/70 font-bold uppercase tracking-widest text-[10px]">
              Expédition Moléculaire 2026
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={login} 
              disabled={loading}
              className="w-full h-14 text-sm font-black uppercase tracking-widest gap-3 bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              Se connecter avec Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-[8px] text-primary/60 font-black uppercase tracking-[0.4em] px-6 leading-relaxed">
          Accès sécurisé via Firebase Intelligence
        </p>
      </div>
    </div>
  );
}
