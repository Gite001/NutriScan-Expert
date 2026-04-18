"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NutriScanExpertOutput } from '@/ai/flows/ai-food-recognition-and-nutrition-report-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Bean
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

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/scan')}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-headline font-bold text-primary">Résultats de l'analyse</h1>
      </header>

      {/* Main Score Section */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-4 border-primary space-y-6 text-center">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80" cy="80" r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted"
              />
              <circle
                cx="80" cy="80" r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * data.globalScore) / 100}
                strokeLinecap="round"
                className="text-primary"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-bold text-primary">{data.globalScore}</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Score / 100</span>
            </div>
          </div>
          <Badge className={cn("mt-6 text-4xl w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg", scoreColors[data.nutriScore])}>
            {data.nutriScore}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold">{data.productName}</h2>
          <p className="text-sm font-medium text-primary bg-primary/5 inline-block px-3 py-1 rounded-full">
            {data.personalizationIndicator}
          </p>
        </div>

        {data.mainAlert && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-pulse border border-red-100">
            <AlertTriangle className="shrink-0" />
            <span className="font-bold text-sm text-left">{data.mainAlert}</span>
          </div>
        )}
      </section>

      {/* Quick Look Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-headline font-bold px-2">D'un coup d'œil</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.quickLook.map((item, idx) => {
            const Icon = (aspectIcons as any)[item.name] || Zap;
            return (
              <div key={idx} className="bg-white p-4 rounded-3xl border shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <Icon size={20} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase">{item.level}</Badge>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground leading-tight">{item.benefit}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alternatives Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-headline font-bold px-2">Alternatives Saines</h3>
        <div className="space-y-3">
          {data.healthyAlternatives.map((alt, idx) => (
            <div key={idx} className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-emerald-900">{alt.productName}</h4>
                <p className="text-xs text-emerald-700">{alt.benefit}</p>
              </div>
              <ChevronRight className="text-emerald-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Expert Verdict */}
      <section className="bg-primary text-white p-8 rounded-[2.5rem] relative overflow-hidden">
        <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/10" />
        <h3 className="text-lg font-headline font-bold mb-3">Le Verdict de l'Expert</h3>
        <p className="text-lg italic font-medium leading-relaxed opacity-95">
          "{data.expertVerdict}"
        </p>
      </section>

      {/* Bonus Tips Accordion */}
      <section className="space-y-4">
        <h3 className="text-xl font-headline font-bold px-2">Conseils Bonus</h3>
        <Accordion type="single" collapsible className="w-full bg-white rounded-3xl shadow-sm border overflow-hidden">
          <AccordionItem value="tips" className="border-b px-6">
            <AccordionTrigger className="font-bold hover:no-underline">Astuces pratiques</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4 py-2">
                {data.bonusTips.practicalTips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="benefits" className="border-b px-6">
            <AccordionTrigger className="font-bold hover:no-underline">Bénéfices santé</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4 py-2">
                {data.bonusTips.healthBenefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="recipe" className="px-6 border-none">
            <AccordionTrigger className="font-bold hover:no-underline">Recette express</AccordionTrigger>
            <AccordionContent className="space-y-3 pb-6">
              <h4 className="font-bold text-primary">{data.bonusTips.expressRecipe.name}</h4>
              <div className="flex gap-2">
                {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                  <Badge key={i} variant="secondary" className="rounded-lg">{ing}</Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <div className="pt-4 pb-8">
        <Button onClick={() => router.push('/scan')} className="w-full h-14 rounded-full text-lg gap-2 bg-primary hover:bg-primary/90">
          <RotateCcw className="w-5 h-5" />
          Scanner un autre article
        </Button>
      </div>
    </div>
  );
}