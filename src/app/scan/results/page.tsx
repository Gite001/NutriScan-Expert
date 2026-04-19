"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NutriScanExpertOutput } from '@/ai/flows/ai-food-recognition-and-nutrition-report-flow';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  Quote,
  Flame,
  Zap,
  Droplets,
  Bean,
  ShieldAlert,
  Microscope,
  Droplet,
  Info,
  Sparkles,
  ExternalLink,
  Target
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<NutriScanExpertOutput | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('lastScanResult');
    if (raw) {
      setData(JSON.parse(raw));
    } else {
      router.push('/scan');
    }
  }, [router]);

  if (!data) return null;

  const scoreColors = {
    A: "bg-emerald-500 shadow-emerald-500/50",
    B: "bg-green-500 shadow-green-500/50",
    C: "bg-yellow-500 shadow-yellow-500/50",
    D: "bg-orange-500 shadow-orange-500/50",
    E: "bg-red-500 shadow-red-500/50",
  };

  const aspectIcons = {
    'Protéines': Zap,
    'Énergie': Flame,
    'Matières grasses': Droplets,
    'Sucres': Bean,
  };

  const alertIcons = {
    'additif': ShieldAlert,
    'glycemie': Flame,
    'ultra-transformation': Microscope,
    'invisible': Droplet,
    'pesticide': AlertTriangle,
  };

  return (
    <div className="min-h-screen pb-24 animate-in fade-in duration-1000">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-12">
        <header className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push('/scan')} className="rounded-full glass w-12 h-12">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-right">
            <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase mb-1">Analyse Terminée</p>
            <h1 className="text-2xl font-headline font-bold text-primary tracking-tighter">RAPPORT D'EXPERTISE</h1>
          </div>
        </header>

        {/* Artful Score Card */}
        <section className="glass rounded-[4rem] p-10 md:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <Target size={120} className="text-primary/5 group-hover:text-primary/10 transition-colors" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start space-y-8">
              <div className="space-y-2">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold tracking-widest uppercase py-1 px-4 mb-4">
                  {data.personalizationIndicator}
                </Badge>
                <h2 className="text-4xl md:text-6xl font-headline font-bold leading-[0.9] tracking-tighter">{data.productName}</h2>
              </div>
              
              <div className="flex gap-4">
                <div className="glass p-6 rounded-[2.5rem] flex flex-col items-center min-w-[100px] border-primary/20">
                  <span className="text-3xl font-bold tracking-tighter">{data.globalScore}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Score Global</span>
                </div>
                <Badge className={cn("text-6xl w-24 h-24 rounded-[2.5rem] flex items-center justify-center font-bold text-white border-8 border-white/20 shadow-2xl transition-transform hover:scale-110", scoreColors[data.nutriScore])}>
                  {data.nutriScore}
                </Badge>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="110" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-primary/10" />
                <circle
                  cx="128" cy="128" r="110" fill="transparent" stroke="currentColor" strokeWidth="12"
                  strokeDasharray={691}
                  strokeDashoffset={691 - (691 * data.globalScore) / 100}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Sparkles className="text-accent w-8 h-8 mb-2 animate-pulse" />
                <span className="text-sm font-bold tracking-widest uppercase">Pureté</span>
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Whistleblower Alerts */}
        {data.scientificAlerts && data.scientificAlerts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <ShieldAlert className="text-white w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold tracking-tighter">RADAR SCIENTIFIQUE 2026</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {data.scientificAlerts.map((alert, idx) => {
                const Icon = (alertIcons as any)[alert.category] || Info;
                return (
                  <div key={idx} className="glass border-accent/20 p-8 rounded-[3rem] space-y-4 hover:shadow-2xl transition-all hover:-translate-y-1">
                    <div className="bg-accent/10 p-4 rounded-3xl text-accent w-fit">
                      <Icon size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight mb-2">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick Look Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-headline font-bold tracking-tighter px-2">ANALYSE MOLÉCULAIRE</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.quickLook.map((item, idx) => {
              const Icon = (aspectIcons as any)[item.name] || Zap;
              return (
                <div key={idx} className="glass p-8 rounded-[3rem] space-y-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-bold uppercase tracking-tighter px-2 mb-2 border-none",
                      item.level === 'Beaucoup' ? "text-red-500 bg-red-500/10" :
                      item.level === 'Peu' ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground bg-muted/20"
                    )}>
                      {item.level}
                    </Badge>
                    <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground leading-tight">{item.benefit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Expert Verdict */}
        <section className="bg-primary text-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden shadow-2xl shadow-primary/30">
          <Quote className="absolute -top-10 -right-10 w-48 h-48 text-white/10" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Microscope size={20} className="text-primary" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-accent">VERDICT EXPERT</h3>
            </div>
            <p className="text-2xl md:text-4xl italic font-headline font-bold leading-[1.1] tracking-tighter">
              "{data.expertVerdict}"
            </p>
          </div>
        </section>

        {/* Optimisation Section */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <h3 className="text-2xl font-headline font-bold tracking-tighter px-2">OPTIMISATION SANTÉ</h3>
             <div className="space-y-4">
                {data.healthyAlternatives.map((alt, idx) => (
                  <div key={idx} className="glass border-emerald-500/20 p-8 rounded-[3rem] flex items-center gap-6 group hover:bg-emerald-500/5 transition-all">
                    <div className="bg-emerald-500 p-4 rounded-3xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/30">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg tracking-tight">{alt.productName}</h4>
                      <p className="text-xs text-muted-foreground">{alt.benefit}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-2xl font-headline font-bold tracking-tighter px-2">GUIDE PRATIQUE</h3>
             <Accordion type="single" collapsible className="w-full glass rounded-[3rem] overflow-hidden border-none px-6">
                <AccordionItem value="tips" className="border-b border-white/10">
                  <AccordionTrigger className="font-bold hover:no-underline py-8 text-lg">Bio-Hacking Tips</AccordionTrigger>
                  <AccordionContent className="pb-8">
                    <ul className="space-y-4 text-sm text-muted-foreground py-2">
                      {data.bonusTips.practicalTips.map((tip, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="recipe" className="border-none">
                  <AccordionTrigger className="font-bold hover:no-underline py-8 text-lg">Recette Express 120s</AccordionTrigger>
                  <AccordionContent className="space-y-6 pb-8">
                    <h4 className="font-bold text-primary text-xl tracking-tight">{data.bonusTips.expressRecipe.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                        <Badge key={i} className="rounded-2xl px-5 py-2 glass bg-primary/5 text-primary border-none text-xs font-bold">{ing}</Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
             </Accordion>
          </div>
        </section>

        <div className="pt-12 flex justify-center">
          <Button onClick={() => router.push('/scan')} className="h-20 px-12 rounded-[2.5rem] text-2xl font-headline font-bold gap-4 bg-primary hover:bg-primary/90 shadow-[0_25px_50px_-12px_rgba(34,197,94,0.4)] transition-all active:scale-95">
            <RotateCcw className="w-8 h-8" />
            NOUVELLE ANALYSE
          </Button>
        </div>
      </div>
    </div>
  );
}