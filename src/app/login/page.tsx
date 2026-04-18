"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Apple, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { login, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-white mb-4 shadow-xl shadow-primary/20">
            <Apple size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">NutriScan Expert</h1>
          <p className="text-muted-foreground max-w-[280px] mx-auto">Votre guide expert pour une alimentation saine et transparente.</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-headline">Bienvenue</CardTitle>
            <CardDescription>
              Connectez-vous pour commencer à analyser vos aliments et recevoir des conseils personnalisés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={login} 
              disabled={loading}
              className="w-full h-12 text-lg gap-2 bg-primary hover:bg-primary/90 rounded-xl"
            >
              <LogIn className="w-5 h-5" />
              Se connecter avec Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground px-6 leading-relaxed">
          En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
}