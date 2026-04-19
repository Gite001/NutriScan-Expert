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
  Info
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
    A: "bg-emerald-500",
    B: "bg-green-500",
    C: "bg-yellow-500",
    D: "bg-orange-500",
    E: "bg-red-500",
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
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 pb-24 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/scan')} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-headline font-bold text-primary">Radar Nutritionnel</h1>
      </header>

      {/* Main Score Section */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-primary space-y-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="flex flex-col items-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-muted/30" />
              <circle
                cx="88" cy="88" r="80" fill="transparent" stroke="currentColor" strokeWidth="12"
                strokeDasharray={502}
                strokeDashoffset={502 - (502 * data.globalScore) / 100}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl font-bold text-primary tracking-tighter">{data.globalScore}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Indice Santé</span>
            </div>
          </div>
          <Badge className={cn("mt-8 text-5xl w-20 h-20 rounded-3xl flex items-center justify-center font-bold text-white shadow-2xl border-4 border-white", scoreColors[data.nutriScore])}>
            {data.nutriScore}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold leading-tight">{data.productName}</h2>
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{data.personalizationIndicator}</span>
          </div>
        </div>
      </section>

      {/* Scientific Whistleblower Alerts */}
      {data.scientificAlerts && data.scientificAlerts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ShieldAlert className="text-accent w-6 h-6" />
            <h3 className="text-xl font-headline font-bold">Alertes Scientifiques (2025-2026)</h3>
          </div>
          <div className="grid gap-3">
            {data.scientificAlerts.map((alert, idx) => {
              const Icon = (alertIcons as any)[alert.category] || Info;
              return (
                <div key={idx} className="bg-accent/10 border border-accent/20 p-5 rounded-[2rem] flex items-start gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-white p-3 rounded-2xl text-accent shadow-sm shrink-0">
                    <Icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-accent-foreground leading-snug">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Look Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-headline font-bold px-2">Analyse Moléculaire</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.quickLook.map((item, idx) => {
            const Icon = (aspectIcons as any)[item.name] || Zap;
            return (
              <div key={idx} className="bg-white p-5 rounded-[2rem] border shadow-sm space-y-3 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 p-2.5 rounded-2xl text-primary">
                    <Icon size={22} />
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter px-2",
                    item.level === 'Beaucoup' ? "border-red-200 text-red-600 bg-red-50" :
                    item.level === 'Peu' ? "border-emerald-200 text-emerald-600 bg-emerald-50" : "border-muted"
                  )}>
                    {item.level}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-1">{item.benefit}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Expert Verdict */}
      <section className="bg-primary text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <Quote className="absolute -top-6 -right-6 w-32 h-32 text-white/10" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Microscope size={16} className="text-primary" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Le Verdict de l'Expert</h3>
          </div>
          <p className="text-xl italic font-medium leading-relaxed">
            "{data.expertVerdict}"
          </p>
        </div>
      </section>

      {/* Alternatives Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-headline font-bold px-2">Optimisation Santé</h3>
        <div className="space-y-3">
          {data.healthyAlternatives.map((alt, idx) => (
            <div key={idx} className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[2.5rem] flex items-center gap-5 group hover:bg-emerald-50 transition-colors">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-emerald-900 text-lg">{alt.productName}</h4>
                <p className="text-sm text-emerald-700/80">{alt.benefit}</p>
              </div>
              <ChevronRight className="text-emerald-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Bonus Tips Accordion */}
      <section className="space-y-4">
        <h3 className="text-xl font-headline font-bold px-2">Guide Pratique</h3>
        <Accordion type="single" collapsible className="w-full bg-white rounded-[2rem] shadow-sm border overflow-hidden">
          <AccordionItem value="tips" className="border-b px-8">
            <AccordionTrigger className="font-bold hover:no-underline py-6">Astuces Bio-Hacking</AccordionTrigger>
            <AccordionContent className="pb-6">
              <ul className="space-y-3 text-sm text-muted-foreground list-none py-2">
                {data.bonusTips.practicalTips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="benefits" className="border-b px-8">
            <AccordionTrigger className="font-bold hover:no-underline py-6">Bénéfices Cellulaires</AccordionTrigger>
            <AccordionContent className="pb-6">
              <ul className="space-y-3 text-sm text-muted-foreground list-none py-2">
                {data.bonusTips.healthBenefits.map((benefit, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="recipe" className="px-8 border-none">
            <AccordionTrigger className="font-bold hover:no-underline py-6">Recette Express 120s</AccordionTrigger>
            <AccordionContent className="space-y-4 pb-8">
              <h4 className="font-bold text-primary text-lg">{data.bonusTips.expressRecipe.name}</h4>
              <div className="flex flex-wrap gap-2">
                {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                  <Badge key={i} variant="secondary" className="rounded-xl px-4 py-1.5 bg-primary/5 text-primary border-none">{ing}</Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <div className="pt-6 pb-12 px-2">
        <Button onClick={() => router.push('/scan')} className="w-full h-16 rounded-3xl text-xl font-headline font-bold gap-3 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95">
          <RotateCcw className="w-6 h-6" />
          Nouvelle Analyse
        </Button>
      </div>
    </div>
  );
}