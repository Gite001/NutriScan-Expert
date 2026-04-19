"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NutriScanExpertOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Quote,
  Flame,
  ShieldAlert,
  Microscope,
  Droplet,
  Info,
  Target,
  Scale,
  TrendingUp,
  Zap,
  Dna,
  Gem,
  Sparkles,
  Trophy
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<NutriScanExpertOutput | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('lastScanResult');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse scan result", e);
        router.push('/scan');
      }
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

  const alertIcons = {
    'additif': ShieldAlert,
    'glycemie': Flame,
    'ultra-transformation': Microscope,
    'invisible': Droplet,
    'pesticide': AlertTriangle,
  };

  const rarityColors = {
    'Commun': 'text-muted-foreground bg-muted/20',
    'Rare': 'text-primary bg-primary/20',
    'Légendaire': 'text-accent bg-accent/20 animate-pulse',
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
            <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase mb-1">Radar d'Exploration</p>
            <h1 className="text-2xl font-headline font-bold text-primary tracking-tighter">TRÉSORS MOLÉCULAIRES</h1>
          </div>
        </header>

        {/* Score Card & Bio-Hacking Metrics */}
        <section className="glass rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <Target size={100} className="text-primary/5 group-hover:text-primary/10 transition-colors" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start space-y-8">
              <div className="space-y-2 text-center md:text-left">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold tracking-widest uppercase py-1 px-4 mb-2">
                  {data.personalizationIndicator}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-bold leading-[1] tracking-tighter">{data.productName}</h2>
              </div>
              
              <div className="flex gap-6">
                <div className="glass p-6 rounded-[2.5rem] flex flex-col items-center min-w-[100px] border-primary/20 shadow-inner">
                  <span className="text-3xl font-bold tracking-tighter text-primary">{data.globalScore}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Bio-Score</span>
                </div>
                <Badge className={cn("text-6xl w-24 h-24 rounded-[2.5rem] flex items-center justify-center font-bold text-white border-4 border-white/20 shadow-2xl", scoreColors[data.nutriScore])}>
                  {data.nutriScore}
                </Badge>
              </div>
            </div>

            {/* BIO-HACKING CONTENT BLOCK */}
            <div className="glass bg-primary/5 p-8 rounded-[3rem] space-y-6 border-primary/10 relative overflow-hidden">
               <div className="absolute -bottom-6 -right-6 opacity-5">
                  <Dna size={120} />
               </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Énergie Cellulaire</span>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-headline font-bold">{data.caloricAnalysis.caloriesPerPortion} <span className="text-sm font-normal text-muted-foreground">kcal</span></span>
                  <span className="text-[10px] font-bold text-muted-foreground">/ {data.caloricAnalysis.estimatedPortion}</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-tight">
                    <span>Impact Métabolique</span>
                    <span>{data.caloricAnalysis.dailyBudgetContribution}%</span>
                  </div>
                  <Progress value={data.caloricAnalysis.dailyBudgetContribution} className="h-2 bg-white/50" />
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge className={cn(
                    "border-none text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full shadow-sm",
                    data.caloricAnalysis.qualityVerdict === 'Nutritives' ? "bg-accent text-accent-foreground" :
                    data.caloricAnalysis.qualityVerdict === 'Vides' ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                  )}>
                    CALORIES {data.caloricAnalysis.qualityVerdict.toUpperCase()}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-none text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full">
                    SYNERGIE BIO
                  </Badge>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/40 relative z-10">
                <p className="text-[10px] leading-relaxed italic text-primary/80 font-medium">
                   <TrendingUp className="inline w-3 h-3 mr-1.5" />
                   {data.caloricAnalysis.expertAdvice}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Molecular Treasures Section - THE "TREASURES" */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Gem className="text-white w-5 h-5" />
            </div>
            <h3 className="text-2xl font-headline font-bold tracking-tighter">PÉPITES DÉNICHER</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.molecularTreasures && data.molecularTreasures.length > 0 ? (
              data.molecularTreasures.map((treasure, idx) => (
                <div key={idx} className="glass border-primary/10 p-6 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-1 transition-all">
                  <div className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors">
                    <Sparkles size={32} />
                  </div>
                  <Badge className={cn("mb-4 border-none text-[8px] font-black uppercase tracking-widest", rarityColors[treasure.rarity])}>
                    {treasure.rarity}
                  </Badge>
                  <h4 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{treasure.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{treasure.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 glass p-8 rounded-[2.5rem] text-center border-dashed border-primary/20">
                <p className="text-sm text-muted-foreground italic">Aucun trésor moléculaire spécifique détecté dans ce labyrinthe... Continuez l'exploration !</p>
              </div>
            )}
          </div>
        </section>

        {/* Scientific Alerts */}
        {data.scientificAlerts && data.scientificAlerts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <ShieldAlert className="text-white w-5 h-5" />
              </div>
              <h3 className="text-2xl font-headline font-bold tracking-tighter">PIÈGES DU LABYRINTHE</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {data.scientificAlerts.map((alert, idx) => {
                const Icon = (alertIcons as any)[alert.category] || Info;
                return (
                  <div key={idx} className="glass border-red-500/10 p-6 rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all">
                    <div className="bg-red-500/10 p-3 rounded-2xl text-red-500 w-fit">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight mb-2">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Expert Verdict */}
        <section className="bg-primary text-white p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-primary/30">
          <Quote className="absolute -top-10 -right-10 w-40 h-40 text-white/10" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Microscope size={16} className="text-primary" />
              </div>
              <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent">RAPPORT D'EXPLORATION</h3>
            </div>
            <p className="text-xl md:text-3xl italic font-headline font-bold leading-[1.2] tracking-tighter">
              "{data.expertVerdict}"
            </p>
          </div>
        </section>

        {/* Alternatives and Tips */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <h3 className="text-2xl font-headline font-bold tracking-tighter px-2">CHEMINS ALTERNATIFS</h3>
             <div className="space-y-4">
                {data.healthyAlternatives.map((alt, idx) => (
                  <div key={idx} className="glass border-emerald-500/20 p-6 rounded-[2.5rem] flex items-center gap-5 group hover:bg-emerald-500/5 transition-all">
                    <div className="bg-emerald-500 p-3 rounded-2xl text-white group-hover:rotate-12 transition-transform">
                      <Trophy size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base tracking-tight">{alt.productName}</h4>
                      <p className="text-[10px] text-muted-foreground leading-tight">{alt.benefit}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-2xl font-headline font-bold tracking-tighter px-2">GUIDE DE SURVIE</h3>
             <Accordion type="single" collapsible className="w-full glass rounded-[2.5rem] overflow-hidden border-none px-6">
                <AccordionItem value="tips" className="border-b border-white/10">
                  <AccordionTrigger className="font-bold hover:no-underline py-6 text-base">Bio-Secrets</AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <ul className="space-y-3 text-xs text-muted-foreground py-1">
                      {data.bonusTips.practicalTips.map((tip, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="recipe" className="border-none">
                  <AccordionTrigger className="font-bold hover:no-underline py-6 text-base">Alchimie Culinaire</AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-6">
                    <h4 className="font-bold text-primary text-lg tracking-tight">{data.bonusTips.expressRecipe.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                        <Badge key={i} className="rounded-xl px-3 py-1 glass bg-primary/5 text-primary border-none text-[10px] font-bold">{ing}</Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
             </Accordion>
          </div>
        </section>

        <div className="pt-8 flex justify-center">
          <Button onClick={() => router.push('/scan')} className="h-16 px-10 rounded-[2rem] text-xl font-headline font-bold gap-3 bg-primary hover:bg-primary/90 shadow-xl transition-all active:scale-95">
            <RotateCcw className="w-6 h-6" />
            NOUVELLE EXPÉDITION
          </Button>
        </div>
      </div>
    </div>
  );
}
