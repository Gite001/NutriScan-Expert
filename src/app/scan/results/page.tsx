"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NutriScanExpertOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert,
  Microscope,
  Zap,
  Dna,
  Gem,
  Sparkles,
  Trophy,
  Target,
  Flame,
  Droplet,
  Info,
  Quote,
  Leaf,
  Globe,
  Utensils,
  Lightbulb,
  HeartPulse
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<NutriScanExpertOutput | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('lastScanResult');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (e) {
        router.push('/scan');
      }
    } else {
      router.push('/scan');
    }
  }, [router]);

  if (!data) return null;

  const scoreColors = {
    A: "bg-emerald-500", B: "bg-green-500", C: "bg-yellow-500", D: "bg-orange-500", E: "bg-red-500",
  };

  const rarityStyles = {
    'Commun': 'bg-muted text-muted-foreground',
    'Rare': 'bg-primary/20 text-primary',
    'Légendaire': 'bg-accent/20 text-accent animate-pulse border border-accent/40',
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-12">
        <header className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push('/scan')} className="rounded-full glass">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-right">
            <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">Rapport SENSOR-X</p>
            <h1 className="text-xl font-headline font-bold text-primary">ANALYSE SANS LIMITES</h1>
          </div>
        </header>

        {/* HERO CARD: Bio-Hacking Metrics */}
        <section className="glass rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-primary/10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase py-1 px-4">
                  {data.personalizationIndicator}
                </Badge>
                <h2 className="text-4xl font-headline font-bold tracking-tighter">{data.productName}</h2>
              </div>
              <div className="flex gap-4">
                <div className="glass p-5 rounded-[2rem] flex flex-col items-center min-w-[80px]">
                  <span className="text-2xl font-bold text-primary">{data.globalScore}</span>
                  <span className="text-[8px] font-bold opacity-50 uppercase">Bio-Score</span>
                </div>
                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center text-5xl font-bold text-white shadow-xl", scoreColors[data.nutriScore])}>
                  {data.nutriScore}
                </div>
              </div>
            </div>

            <div className="glass bg-primary/5 p-8 rounded-[2.5rem] space-y-6 relative border-primary/10">
              <div className="absolute -bottom-4 -right-4 opacity-5"><Dna size={100} /></div>
              <div className="flex justify-between items-end relative z-10">
                <span className="text-3xl font-headline font-bold">{data.caloricAnalysis.caloriesPerPortion} <span className="text-xs font-normal opacity-50">kcal</span></span>
                <span className="text-[10px] font-bold opacity-50 uppercase">Portion: {data.caloricAnalysis.estimatedPortion}</span>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                  <span>Impact Métabolique</span>
                  <span>{data.caloricAnalysis.dailyBudgetContribution}%</span>
                </div>
                <Progress value={data.caloricAnalysis.dailyBudgetContribution} className="h-2" />
              </div>
              <div className="flex flex-wrap gap-2 relative z-10">
                <Badge className={cn(
                  "border-none text-[9px] font-bold px-3 py-1 rounded-full",
                  data.caloricAnalysis.qualityVerdict === 'Nutritives' ? "bg-accent text-accent-foreground" : "bg-red-500 text-white"
                )}>
                  CALORIES {data.caloricAnalysis.qualityVerdict.toUpperCase()}
                </Badge>
                <Badge className="bg-primary/20 text-primary border-none text-[9px] font-bold px-3 py-1 rounded-full">
                  SYNERGIE CELLULAIRE
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* SYMBIOSE PLANÉTAIRE */}
        <section className="glass border-accent/20 rounded-[3rem] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe size={80} className="text-accent" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="text-accent w-6 h-6" />
            <h3 className="text-2xl font-headline font-bold tracking-tight">Symbiose Planétaire</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-3xl font-bold border border-accent/20">
                    {data.ecoIntelligence.ecoScore}
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">Indice Eco-Vision</p>
                    <p className="text-sm font-medium leading-tight">{data.ecoIntelligence.planetaryVerdict}</p>
                 </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.ecoIntelligence.footprintTags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-[8px] font-bold border-accent/30 text-accent/80">
                    {tag.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-white/50 p-6 rounded-2xl border border-accent/10">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold uppercase opacity-60">Durabilité Moléculaire</span>
                  <span className="text-[9px] font-black text-accent">{data.ecoIntelligence.ecoScore}%</span>
               </div>
               <Progress value={data.ecoIntelligence.ecoScore} className="h-1.5 bg-accent/10" />
            </div>
          </div>
        </section>

        {/* MOLECULAR TREASURES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Gem className="text-accent w-5 h-5" />
            <h3 className="text-xl font-headline font-bold tracking-tight">PÉPITES DÉNICHER</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.molecularTreasures.map((treasure, idx) => (
              <div key={idx} className="glass p-6 rounded-[2rem] hover:-translate-y-1 transition-all border-primary/5">
                <Badge className={cn("mb-3 border-none text-[7px] font-black uppercase", rarityStyles[treasure.rarity])}>
                  {treasure.rarity}
                </Badge>
                <h4 className="font-bold text-sm mb-1">{treasure.name}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{treasure.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ALCHIMIE & BIO-HACKING (THE UNLIMITED SECTION) */}
        <div className="grid md:grid-cols-2 gap-8">
           {/* Recette Alchimique */}
           <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Utensils className="text-primary w-5 h-5" />
                <h3 className="text-xl font-headline font-bold tracking-tight">ALCHIMIE EXPRESS</h3>
              </div>
              <Card className="rounded-[2.5rem] bg-primary text-white border-none shadow-xl relative overflow-hidden group">
                 <Sparkles size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                 <CardContent className="p-8 space-y-4">
                    <h4 className="text-2xl font-headline font-bold leading-tight">{data.bonusTips.expressRecipe.name}</h4>
                    <div className="space-y-2">
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Synergistes requis :</p>
                       <ul className="flex flex-wrap gap-2">
                          {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                            <li key={i} className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">{ing}</li>
                          ))}
                       </ul>
                    </div>
                 </CardContent>
              </Card>
           </section>

           {/* Bio-Hacking Tips */}
           <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Lightbulb className="text-accent w-5 h-5" />
                <h3 className="text-xl font-headline font-bold tracking-tight">RITUELS DE BIO-HACKING</h3>
              </div>
              <div className="space-y-3">
                 {data.bonusTips.practicalTips.map((tip, i) => (
                    <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4 hover:border-accent/40 transition-colors">
                       <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                          <HeartPulse size={16} />
                       </div>
                       <p className="text-[11px] font-medium leading-tight">{tip}</p>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {/* PIÈGES DU LABYRINTHE */}
        {data.scientificAlerts && data.scientificAlerts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <ShieldAlert className="text-red-500 w-5 h-5" />
              <h3 className="text-xl font-headline font-bold tracking-tight text-red-600">PIÈGES DU LABYRINTHE</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {data.scientificAlerts.map((alert, idx) => (
                <div key={idx} className="glass border-red-500/10 p-6 rounded-[2rem] flex gap-4">
                  <div className="bg-red-500/10 p-3 rounded-xl text-red-500 h-fit"><AlertTriangle size={20} /></div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">{alert.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERT VERDICT */}
        <section className="bg-primary text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
          <Quote className="absolute -top-10 -right-10 w-40 h-40 opacity-10" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Microscope size={16} className="text-accent" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-accent">L'Expert Scientifique</span>
            </div>
            <p className="text-xl italic font-headline font-bold leading-tight tracking-tight">
              "{data.expertVerdict}"
            </p>
          </div>
        </section>

        {/* FINAL BUTTON */}
        <div className="pt-8 flex justify-center">
          <Button onClick={() => router.push('/scan')} className="h-16 px-10 rounded-full text-xl font-headline font-bold gap-3 bg-primary shadow-xl hover:scale-105 transition-all">
            <RotateCcw className="w-6 h-6" />
            NOUVELLE EXPÉDITION
          </Button>
        </div>
      </div>
    </div>
  );
}
