"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Scan, ShieldAlert, Award, Sparkles, ArrowRight, Apple, Heart, Biohazard } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-24 max-w-5xl mx-auto text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Le futur de la nutrition est ici</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-headline font-bold text-primary leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          L'ART DE MANGER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">EN CONSCIENCE</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500">
          Bienvenue dans l'ère de la transparence radicale. <br />
          Scannez, apprenez, et libérez votre potentiel de santé.
        </p>

        <div className="pt-8 flex flex-col md:flex-row gap-6 justify-center items-center animate-in fade-in zoom-in-95 duration-1000 delay-700">
          <Button asChild size="lg" className="h-16 px-12 text-xl font-headline font-bold bg-primary hover:bg-primary/90 rounded-full shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] group">
            <Link href="/scan" className="flex items-center">
              LANCER LE RADAR
              <Scan className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
            </Link>
          </Button>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            ou <Link href="/profile" className="text-primary hover:underline underline-offset-4">explorer votre historique</Link>
            <ArrowRight className="w-4 h-4" />
          </p>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
          <div className="md:col-span-8 glass p-10 rounded-[3rem] flex flex-col justify-end space-y-4 group overflow-hidden relative">
            <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Scan size={120} />
            </div>
            <h3 className="text-3xl font-headline font-bold">Analyse Moléculaire par IA</h3>
            <p className="text-muted-foreground max-w-md">Détectez les additifs, les sucres cachés et les micro-plastiques instantanément grâce à notre moteur de vision artificielle.</p>
          </div>
          
          <div className="md:col-span-4 bg-primary text-white p-10 rounded-[3rem] flex flex-col justify-between shadow-2xl shadow-primary/20">
            <Award size={48} className="animate-bounce" />
            <div>
              <h3 className="text-2xl font-headline font-bold mb-2">Score Expert</h3>
              <p className="text-white/80 text-sm">Un indice santé 2025 basé sur votre métabolisme unique.</p>
            </div>
          </div>

          <div className="md:col-span-4 glass p-10 rounded-[3rem] flex flex-col justify-between group">
            <ShieldAlert size={48} className="text-destructive group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-2xl font-headline font-bold mb-2">Lanceur d'Alerte</h3>
              <p className="text-muted-foreground text-sm">La science de 2026 à votre service : California Safety Act & Pesticides.</p>
            </div>
          </div>

          <div className="md:col-span-8 glass p-10 rounded-[3rem] flex flex-col justify-end space-y-4 relative group overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Apple size={200} />
            </div>
            <h3 className="text-3xl font-headline font-bold">Bio-Hacking Nutritionnel</h3>
            <p className="text-muted-foreground">Apprenez à optimiser chaque cellule de votre corps avec des conseils d'experts personnalisés.</p>
          </div>
        </div>
      </section>

      <footer className="w-full py-12 px-6 border-t glass mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-2xl shadow-lg">
              <Apple className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight text-primary">NutriScan <span className="text-accent">Expert</span></span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2025 – La science pour tous. Propulsé par GenAI.</p>
          <div className="flex gap-6">
            <Heart className="w-5 h-5 text-primary/40 hover:text-primary transition-colors cursor-pointer" />
            <Biohazard className="w-5 h-5 text-primary/40 hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}