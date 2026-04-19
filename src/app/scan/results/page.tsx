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
  Gem,
  Sparkles,
  Target,
  Flame,
  Quote,
  Globe,
  Utensils,
  Lightbulb,
  HeartPulse,
  Activity,
  Layers,
  ChevronRight,
  Fingerprint,
  Leaf,
  WifiOff
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<NutriScanExpertOutput | null>(null);
  const [activeTab, setActiveTab] = useState("vitality");

  useEffect(() => {
    const raw = localStorage.getItem('lastScanResult');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setData(parsed);
      } catch (e) {
        console.error("Erreur parsing scan result:", e);
        router.push('/scan');
      }
    } else {
      router.push('/scan');
    }
  }, [router]);

  if (!data) return null;

  const scoreColors = {
    A: "bg-emerald-600 shadow-[0_0_20px_rgba(5,150,105,0.4)]", 
    B: "bg-green-600 shadow-[0_0_20px_rgba(22,163,74,0.4)]", 
    C: "bg-yellow-600 shadow-[0_0_20px_rgba(202,138,4,0.4)]", 
    D: "bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.4)]", 
    E: "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]",
  };

  const rarityStyles = {
    'Commun': 'bg-muted text-primary-950 font-bold',
    'Rare': 'bg-primary/30 text-primary-950 border border-primary/50 font-black',
    'Légendaire': 'bg-accent text-primary-950 border border-accent/60 shadow-[0_0_15px_rgba(163,230,53,0.3)] font-black',
  };

  const UnavailableState = ({ icon: Icon, title, reason }: { icon: any, title: string, reason: string }) => (
    <div className="glass rounded-[2.5rem] p-8 md:p-12 flex flex-col items-start text-left gap-6 border-dashed border-primary/50 animate-in fade-in duration-700 w-full bg-white/60 shadow-lg">
      <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
        <Icon size={32} />
      </div>
      <div className="space-y-3 w-full">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-950 opacity-80">Diagnostic Sensor-X</h4>
        <p className="text-xl md:text-2xl font-headline font-bold text-primary-950">{title}</p>
        <div className="flex items-center gap-2 text-[10px] font-black text-primary-950 uppercase tracking-widest bg-primary/20 px-5 py-2.5 rounded-full border border-primary/40 w-fit">
          <WifiOff size={14} className="text-primary-950" />
          {reason}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-background selection:bg-accent/30">
      <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-10">
        
        <header className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <Button variant="ghost" size="icon" onClick={() => router.push('/scan')} className="rounded-full glass hover:bg-white/40 border-primary/30">
            <ArrowLeft className="w-6 h-6 text-primary-950" />
          </Button>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-[9px] font-black text-primary-950 tracking-[0.4em] uppercase">
              <Fingerprint size={12} className="text-primary-950 animate-pulse" />
              Sensor-X Active
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary-950 tracking-tighter uppercase">Rapport Expert</h1>
          </div>
        </header>

        <section className="animate-in zoom-in-95 duration-1000">
          <Card className="glass rounded-[3rem] p-6 md:p-12 relative overflow-hidden border-primary/40 shadow-xl bg-white/50">
            <div className="flex flex-col gap-10">
              <div className="space-y-6 text-center md:text-left">
                <Badge className="bg-primary text-white border-none text-[10px] font-black uppercase py-1.5 px-6 rounded-full tracking-widest shadow-md">
                  {data.personalizationIndicator || "ANALYSE PERSONNALISÉE"}
                </Badge>
                <h2 className="text-4xl md:text-7xl font-headline font-bold tracking-tighter leading-none text-primary-950">
                  {data.productName}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <div className="glass p-5 rounded-[2rem] flex flex-col items-center min-w-[100px] border-primary/50 bg-white/70">
                    <span className="text-4xl font-black text-primary-950">{data.globalScore || 0}</span>
                    <span className="text-[9px] font-black text-primary-950 uppercase tracking-widest">Bio-Score</span>
                  </div>
                  <div className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center text-5xl md:text-6xl font-black text-white shadow-xl", 
                    scoreColors[data.nutriScore || 'C']
                  )}>
                    {data.nutriScore || '-'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {(data.quickLook || []).map((item, i) => (
                   <div key={i} className="glass p-6 rounded-3xl border-primary/30 flex flex-col items-start gap-4 bg-white/70 w-full shadow-sm">
                      <div className="flex flex-col">
                        <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest opacity-80">{item.name}</p>
                        <span className="text-2xl font-black text-primary-950">{item.level}</span>
                      </div>
                      <Badge variant="outline" className="text-xs border-primary/50 px-4 py-2 font-black rounded-xl bg-primary/20 text-primary-950 w-full text-left leading-relaxed shadow-inner">
                        {item.benefit}
                      </Badge>
                   </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-16 rounded-[2rem] glass p-2 gap-2 border-primary/40 shadow-md">
            <TabsTrigger value="vitality" className="rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black transition-all">
              <Activity size={18} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Vitalité</span>
            </TabsTrigger>
            <TabsTrigger value="molecular" className="rounded-[1.5rem] data-[state=active]:bg-accent data-[state=active]:text-primary-950 font-black transition-all">
              <Layers size={18} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Moléculaire</span>
            </TabsTrigger>
            <TabsTrigger value="symbiosis" className="rounded-[1.5rem] data-[state=active]:bg-emerald-800 data-[state=active]:text-white font-black transition-all">
              <Globe size={18} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Symbiose</span>
            </TabsTrigger>
            <TabsTrigger value="alchemy" className="rounded-[1.5rem] data-[state=active]:bg-amber-700 data-[state=active]:text-white font-black transition-all">
              <Sparkles size={18} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Alchimie</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px] animate-in slide-in-from-bottom-8 duration-700">
            <TabsContent value="vitality" className="space-y-8 mt-0">
              <div className="flex flex-col gap-8">
                <Card className="glass rounded-[3rem] p-8 md:p-12 border-primary/40 bg-white/70 shadow-lg relative overflow-hidden">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-950 mb-8 flex items-center gap-2">
                      <Target className="text-primary-950 shrink-0" size={16} /> Budget Énergétique
                   </h3>
                   {data.caloricAnalysis ? (
                     <div className="space-y-10">
                        <div className="flex flex-col gap-1">
                          <span className="text-5xl md:text-7xl font-black text-primary-950 leading-none">{data.caloricAnalysis.caloriesPerPortion} <span className="text-sm font-bold text-primary-950 uppercase tracking-widest">kcal</span></span>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary-950 mt-2">Portion: {data.caloricAnalysis.estimatedPortion}</p>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary-950">
                              <span>Impact Journalier</span>
                              <span className="text-primary-950 font-black">{data.caloricAnalysis.dailyBudgetContribution}%</span>
                           </div>
                           <Progress value={data.caloricAnalysis.dailyBudgetContribution} className="h-4 bg-primary/30" />
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-primary/20 border border-primary/40 space-y-6">
                           <h4 className="text-[10px] font-black text-primary-950 uppercase tracking-widest">Verdict de Qualité</h4>
                           <div className="flex flex-col gap-6">
                              <Badge className={cn(
                                "text-[11px] font-black px-8 py-3 rounded-full border-none w-fit shadow-md",
                                data.caloricAnalysis.qualityVerdict === 'Nutritives' ? "bg-accent text-primary-950" : "bg-red-800 text-white"
                              )}>
                                CALORIES {(data.caloricAnalysis.qualityVerdict || 'INC').toUpperCase()}
                              </Badge>
                              <p className="text-lg md:text-2xl font-black leading-relaxed italic text-primary-950 border-l-4 border-primary/50 pl-8">
                                "{data.caloricAnalysis.expertAdvice}"
                              </p>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <UnavailableState 
                        icon={Target} 
                        title="Analyse Calorique Indisponible" 
                        reason="Signal Sensor-X insuffisant pour un séquençage calorique" 
                     />
                   )}
                </Card>

                <div className="glass p-8 md:p-12 rounded-[3rem] border-primary/40 bg-white/70 relative overflow-hidden shadow-lg">
                   <Quote className="absolute -top-6 -right-6 w-32 h-32 opacity-10 text-primary-950" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-950 mb-6 flex items-center gap-2">
                     <Microscope size={16} className="shrink-0" /> Le Mot de l'Expert
                   </h4>
                   <p className="text-xl md:text-3xl font-headline font-bold leading-tight italic text-primary-950">
                     "{data.expertVerdict || "Analyse terminée. Synchronisation des données en cours."}"
                   </p>
                </div>
                
                <div className="flex flex-col gap-4">
                   {(data.bonusTips?.healthBenefits || []).map((benefit, i) => (
                     <div key={i} className="glass p-8 rounded-[2.5rem] border-primary/30 flex flex-col items-start gap-4 bg-white/70 shadow-sm w-full">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
                           <HeartPulse size={24} />
                        </div>
                        <p className="text-xs md:text-base font-black leading-relaxed uppercase tracking-widest text-primary-950 text-left w-full">{benefit}</p>
                     </div>
                   ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="molecular" className="space-y-10 mt-0">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 px-2">
                  <Gem className="text-primary-950 w-6 h-6 shrink-0" />
                  <h3 className="text-2xl font-headline font-bold tracking-tight uppercase text-primary-950">Trésors Débusqués</h3>
                </div>
                {data.molecularTreasures && data.molecularTreasures.length > 0 ? (
                  data.molecularTreasures.map((treasure, idx) => (
                    <Card key={idx} className="glass rounded-[2.5rem] p-8 md:p-10 border-primary/30 bg-white/70 shadow-sm flex flex-col items-start gap-5 w-full">
                      <Badge className={cn("border-none text-[10px] font-black uppercase tracking-widest py-1.5 px-6 rounded-full shadow-sm", rarityStyles[treasure.rarity || 'Commun'])}>
                        {treasure.rarity}
                      </Badge>
                      <h4 className="text-xl md:text-3xl font-black text-primary-950">{treasure.name}</h4>
                      <p className="text-sm md:text-lg text-primary-950 font-black leading-relaxed italic border-l-2 border-primary/40 pl-6">"{treasure.description}"</p>
                    </Card>
                  ))
                ) : (
                  <UnavailableState 
                      icon={Gem} 
                      title="Aucun Trésor Détecté" 
                      reason="Densité moléculaire standard - Pas de pépite identifiée" 
                  />
                )}
              </div>

              {data.scientificAlerts && data.scientificAlerts.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 px-2">
                    <ShieldAlert className="text-red-900 w-6 h-6 shrink-0" />
                    <h3 className="text-xl md:text-2xl font-headline font-bold tracking-tight text-red-900 uppercase italic">Pièges du Labyrinthe</h3>
                  </div>
                  {data.scientificAlerts.map((alert, idx) => (
                    <div key={idx} className="glass border-red-900/40 bg-red-600/10 p-8 md:p-10 rounded-[2.5rem] flex flex-col items-start gap-6 shadow-md w-full">
                      <div className="bg-red-800 text-white p-4 rounded-2xl shrink-0 shadow-lg shadow-red-900/30">
                        <AlertTriangle size={24} />
                      </div>
                      <div className="space-y-4 w-full">
                        <Badge className="bg-red-800 text-white text-[10px] font-black tracking-widest py-1.5 px-6 uppercase rounded-full border-none">
                          {(alert.category || 'INCONNU').toUpperCase()}
                        </Badge>
                        <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-red-950">{alert.title}</h4>
                        <p className="text-sm md:text-base text-red-950 font-black leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="symbiosis" className="space-y-8 mt-0">
               {data.ecoIntelligence ? (
                 <Card className="glass border-emerald-900/40 rounded-[3rem] p-8 md:p-12 bg-white/70 shadow-lg flex flex-col gap-10 w-full">
                    <div className="flex flex-col items-start gap-8 w-full">
                       <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-800 text-white flex items-center justify-center text-5xl font-black shadow-xl shrink-0">
                             {data.ecoIntelligence.ecoScore || 0}
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950">Impact Planétaire</p>
                             <h3 className="text-2xl md:text-4xl font-headline font-bold text-emerald-950 uppercase tracking-tighter">Eco-Vision</h3>
                          </div>
                       </div>
                       <p className="text-lg md:text-2xl font-black leading-relaxed text-emerald-950 italic border-l-4 border-emerald-800/40 pl-8">
                          "{data.ecoIntelligence.planetaryVerdict || "Analyse environnementale en cours."}"
                       </p>
                       <div className="flex flex-wrap gap-3">
                          {(data.ecoIntelligence.footprintTags || []).map((tag, i) => (
                             <Badge key={i} className="bg-emerald-900 text-white border-none text-[10px] font-black tracking-widest px-6 py-3 rounded-full uppercase shadow-md">
                                {tag.toUpperCase()}
                             </Badge>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-8 bg-emerald-800/20 p-8 rounded-[2.5rem] border border-emerald-800/40 shadow-inner w-full">
                       <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-950">
                             <span>Durabilité SENSOR-X</span>
                             <span className="font-black">{data.ecoIntelligence.ecoScore || 0}%</span>
                          </div>
                          <Progress value={data.ecoIntelligence.ecoScore || 0} className="h-4 bg-emerald-800/40" />
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                             <Leaf size={20} />
                          </div>
                          <p className="text-sm md:text-lg font-black text-emerald-950 italic">Environnement pur = Nutriments purs.</p>
                       </div>
                    </div>
                 </Card>
               ) : (
                 <UnavailableState 
                    icon={Globe} 
                    title="Données Éco-Intelligence Absentes" 
                    reason="Base de données planétaire non synchronisée pour ce produit" 
                 />
               )}
            </TabsContent>

            <TabsContent value="alchemy" className="space-y-8 mt-0">
               <div className="flex flex-col gap-8 w-full">
                  {data.bonusTips?.expressRecipe ? (
                    <Card className="rounded-[3rem] bg-primary text-white p-8 md:p-16 border-none shadow-2xl relative overflow-hidden flex flex-col gap-10 w-full">
                       <div className="relative z-10 space-y-8">
                          <Badge className="bg-white text-primary-950 border-none text-[10px] font-black tracking-widest px-8 py-3 rounded-full uppercase shadow-md">Alchimie Culinaire</Badge>
                          <h3 className="text-3xl md:text-6xl font-headline font-bold leading-none">{data.bonusTips.expressRecipe.name}</h3>
                          <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">Ingrédients Synergiques :</p>
                             <div className="flex flex-wrap gap-3">
                                {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                                  <div key={i} className="bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl text-[12px] font-black border border-white/40 shadow-sm text-white">
                                     {ing}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </Card>
                  ) : (
                    <UnavailableState 
                        icon={Utensils} 
                        title="Alchimie Culinaire Bloquée" 
                        reason="Profil de saveur trop complexe pour une recette express" 
                    />
                  )}

                  <div className="flex flex-col gap-6 w-full">
                     <div className="flex items-center gap-3 px-4">
                        <Lightbulb className="text-primary-950 w-6 h-6 shrink-0" />
                        <h3 className="text-xl font-headline font-bold tracking-tight uppercase text-primary-950">Bio-Hacking</h3>
                     </div>
                     {(data.bonusTips?.practicalTips || []).map((tip, i) => (
                        <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col items-start gap-5 bg-white/70 border-primary/40 shadow-sm w-full">
                           <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
                              <Activity size={24} />
                           </div>
                           <p className="text-sm md:text-lg font-black leading-relaxed tracking-tight text-primary-950 text-left w-full">{tip}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="pt-12 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Button 
            onClick={() => router.push('/scan')} 
            className="w-full md:w-auto h-20 px-12 rounded-full text-xl font-headline font-bold gap-4 bg-primary text-white shadow-2xl transition-all hover:scale-105 active:scale-95 py-4 leading-tight border-none"
          >
            <RotateCcw className="w-8 h-8 shrink-0" />
            NOUVELLE EXPÉDITION
          </Button>
          <p className="text-[10px] font-black text-primary-950 uppercase tracking-[0.4em] text-center">Science & Vérité - NutriScan 2026</p>
        </div>

      </div>
    </div>
  );
}
