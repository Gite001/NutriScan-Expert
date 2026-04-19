"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Scan, ShieldAlert, Sparkles, ArrowRight, Apple, Heart, Microscope, UserRound, Globe, Leaf } from 'lucide-react';
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Le futur de la nutrition est ici</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-headline font-bold text-primary leading-[1] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          L'ART DE MANGER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">EN CONSCIENCE</span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500">
          Bienvenue dans l'ère de la transparence radicale. <br />
          Découvrez la vérité derrière chaque étiquette.
        </p>
      </section>

      {/* Bento Grid Features */}
      <section className="px-6 pb-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* IA Analysis Card */}
          <div className="md:col-span-8">
            <div className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col justify-end space-y-4 overflow-hidden relative min-h-[300px] h-full transition-all duration-500 border-primary/10 hover:border-primary/40 hover:shadow-xl group select-none">
              <div className="absolute top-8 right-8 md:top-12 md:right-12 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
                <Scan size={120} />
              </div>
              <h3 className="text-3xl md:text-4xl font-headline font-bold leading-tight group-hover:text-primary transition-colors text-foreground">Bio-Hacking Nutritionnel</h3>
              <p className="text-foreground/80 font-medium max-w-md text-sm md:text-base leading-relaxed">Décryptez la densité en nutriments et évitez les calories vides. Identifiez instantanément les molécules qui optimisent votre biologie.</p>
              <div className="flex gap-2 mt-2">
                 <Badge className="bg-primary text-primary-foreground border-none text-[8px] font-black tracking-widest px-3">CALORIES NUTRITIVES</Badge>
                 <Badge className="bg-accent text-accent-foreground border-none text-[8px] font-black tracking-widest px-3">SYNERGIE CELLULAIRE</Badge>
              </div>
            </div>
          </div>
          
          {/* Scientist Persona Card */}
          <div className="md:col-span-4">
            <div className="h-full bg-accent text-accent-foreground p-8 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col justify-between shadow-2xl shadow-accent/20 relative overflow-hidden min-h-[300px] transition-all duration-500 border border-transparent hover:border-white/40 group select-none">
              <div className="absolute -right-6 -top-6 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <UserRound size={220} />
              </div>

              <div className="relative z-10 bg-white/30 p-4 rounded-2xl w-fit backdrop-blur-md border border-white/40 shadow-inner group-hover:scale-110 transition-transform">
                <Microscope size={32} className="text-accent-foreground" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-headline font-bold leading-tight">L'Expert en Mission</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-90">Révélateur de Vérité</p>
                </div>
                
                <div className="w-full rounded-2xl bg-white/95 text-accent-foreground shadow-xl border border-white/40 p-3 flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] leading-none">Intelligence Active</span>
                  </div>
                  <p className="text-[8px] opacity-70 font-bold uppercase tracking-tight text-center leading-none">Prêt pour l'expédition moléculaire</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Card */}
          <div className="md:col-span-5 glass p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col justify-between group min-h-[260px] transition-all duration-500 border-primary/10 hover:border-destructive/40 hover:shadow-xl select-none">
            <div className="w-16 h-16 rounded-2xl bg-destructive text-destructive-foreground flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-destructive/20">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold mb-2 group-hover:text-destructive transition-colors text-foreground">Pièges du Labyrinthe</h3>
              <p className="text-foreground/80 font-medium text-sm leading-relaxed">Débusquez les additifs toxiques et les molécules interdites. Ne soyez plus la victime du marketing ultra-transformé.</p>
            </div>
          </div>

          {/* Planetary Symbiosis Card */}
          <div className="md:col-span-7 glass p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col justify-end space-y-6 relative group overflow-hidden min-h-[320px] transition-all duration-500 border-primary/10 hover:border-primary/40 hover:shadow-xl select-none">
             <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
              <Globe size={280} />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl md:text-4xl font-headline font-bold leading-tight text-primary">
                Symbiose <br /> Planétaire
              </h3>
              <p className="text-foreground/80 font-medium text-sm md:text-lg max-w-md leading-relaxed">
                Parce que manger propre exige un environnement propre. Découvrez comment vos choix protègent la terre qui fabrique vos cellules.
              </p>
              <div className="flex flex-wrap items-start gap-2.5 mt-2">
                <Badge className="bg-emerald-600 text-white border-none text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full">
                  ÉCO-INTELLIGENCE
                </Badge>
                <Badge className="bg-primary text-white border-none text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full">
                  SANTÉ CIRCULAIRE
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 w-full flex flex-col items-center space-y-8">
        <div className="relative group animate-in zoom-in duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.6rem] blur opacity-30 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
          
          <Link href="/scan" className="relative">
            <Button size="lg" className="h-20 px-12 rounded-[2.5rem] text-xl font-headline font-bold gap-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl transition-all hover:scale-105 active:scale-95">
              <Scan className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              ACTIVER LE RADAR
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
        <p className="text-[10px] font-black text-foreground/50 uppercase tracking-[0.4em] opacity-80">L'aventure commence ici</p>
      </section>

      <footer className="w-full py-12 px-6 border-t glass mt-auto border-primary/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-2xl shadow-lg">
              <Apple className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight text-primary">NutriScan <span className="text-accent">Expert</span></span>
          </div>
          <p className="text-sm text-foreground/60 font-bold">© 2025 – La science pour tous. Propulsé par GenAI.</p>
          <div className="flex gap-6">
            <Heart className="w-5 h-5 text-primary/60 hover:text-primary transition-colors cursor-pointer" />
            <Leaf className="w-5 h-5 text-accent/60 hover:text-accent transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border", className)}>
      {children}
    </span>
  );
}