
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
    'Rare': 'bg-primary/20 text-primary-900 border border-primary/40 font-bold',
    'Légendaire': 'bg-accent text-primary-950 border border-accent/50 shadow-[0_0_15px_rgba(163,230,53,0.3)] font-black',
  };

  const UnavailableState = ({ icon: Icon, title, reason }: { icon: any, title: string, reason: string }) => (
    <div className="glass rounded-[2.5rem] p-8 md:p-12 flex flex-col items-start text-left gap-6 border-dashed border-primary/40 animate-in fade-in duration-700">
      <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
        <Icon size={32} />
      </div>
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Diagnostic Sensor-X</h4>
        <p className="text-xl md:text-2xl font-headline font-bold text-primary-950">{title}</p>
        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20">
          <WifiOff size={14} />
          {reason}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-background selection:bg-accent/30">
      <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-10">
        
        <header className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <Button variant="ghost" size="icon" onClick={() => router.push('/scan')} className="rounded-full glass hover:bg-white/40 transition-all active:scale-90 border-primary/20">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </Button>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-[9px] font-black text-primary tracking-[0.4em] uppercase">
              <Fingerprint size={12} className="animate-pulse" />
              Signature Sensor-X 2.6
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary tracking-tighter uppercase">ANALYSE SANS LIMITES</h1>
          </div>
        </header>

        <section className="relative group animate-in zoom-in-95 duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000" />
          <Card className="glass rounded-[3rem] p-6 md:p-12 relative overflow-hidden border-primary/30 transition-all duration-500 hover:shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              <div className="space-y-6">
                <div className="space-y-3 text-center md:text-left">
                  <Badge className="bg-primary text-white border-none text-[10px] font-black uppercase py-1.5 px-6 rounded-full tracking-widest animate-pulse shadow-lg shadow-primary/20">
                    {data.personalizationIndicator || "ANALYSE PERSONNALISÉE"}
                  </Badge>
                  <h2 className="text-3xl md:text-6xl font-headline font-bold tracking-tighter leading-none text-primary-950">
                    {data.productName}
                  </h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <div className="glass p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center min-w-[80px] md:min-w-[100px] border-primary/40 hover:scale-110 transition-transform shadow-md">
                    <span className="text-3xl md:text-4xl font-black text-primary leading-none">{data.globalScore || 0}</span>
                    <span className="text-[9px] font-black text-primary/80 uppercase tracking-widest mt-1">Bio-Score</span>
                  </div>
                  <div className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-5xl md:text-6xl font-black text-white transition-all duration-500 hover:rotate-6", 
                    scoreColors[data.nutriScore || 'C']
                  )}>
                    {data.nutriScore || '-'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {(data.quickLook || []).map((item, i) => (
                   <div key={i} className="glass p-6 rounded-3xl border-primary/30 hover:border-primary/50 transition-all hover:-translate-y-1 card-shine flex flex-col gap-3 group shadow-sm bg-white/40">
                      <div className="flex flex-col items-start gap-0.5">
                        <p className="text-[10px] font-black text-primary/80 uppercase tracking-widest group-hover:text-primary transition-colors">{item.name}</p>
                        <span className="text-xl md:text-2xl font-black text-primary-950">{item.level}</span>
                      </div>
                      <Badge variant="outline" className="text-[11px] md:text-xs border-primary/30 px-4 py-2 font-bold rounded-xl bg-primary/5 text-primary-950 hover:bg-primary/10 transition-all text-left w-full leading-relaxed shadow-inner">
                        {item.benefit}
                      </Badge>
                   </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-14 md:h-16 rounded-[2rem] glass p-1 md:p-2 gap-1 md:gap-2 border-primary/30 shadow-md">
            <TabsTrigger value="vitality" className="rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black px-1 md:px-2 shadow-sm transition-all">
              <Activity size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Vitalité</span>
            </TabsTrigger>
            <TabsTrigger value="molecular" className="rounded-[1.5rem] data-[state=active]:bg-accent data-[state=active]:text-primary-950 font-black px-1 md:px-2 shadow-sm transition-all">
              <Layers size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Moléculaire</span>
            </TabsTrigger>
            <TabsTrigger value="symbiosis" className="rounded-[1.5rem] data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-black px-1 md:px-2 shadow-sm transition-all">
              <Globe size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Symbiose</span>
            </TabsTrigger>
            <TabsTrigger value="alchemy" className="rounded-[1.5rem] data-[state=active]:bg-amber-600 data-[state=active]:text-white font-black px-1 md:px-2 shadow-sm transition-all">
              <Sparkles size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] uppercase tracking-widest ml-2">Alchimie</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px] animate-in slide-in-from-bottom-8 duration-700">
            <TabsContent value="vitality" className="space-y-8 mt-0">
              <div className="flex flex-col gap-8">
                <Card className="glass rounded-[3rem] p-6 md:p-10 border-primary/30 hover:border-primary/50 transition-all group overflow-hidden relative card-shine shadow-sm">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-150 transition-transform duration-1000 text-primary"><Flame size={120} /></div>
                   <h3 className="text-2xl font-headline font-bold mb-8 flex items-center gap-3 text-primary-950">
                      <Target className="text-primary shrink-0" /> Budget Énergétique
                   </h3>
                   {data.caloricAnalysis ? (
                     <div className="space-y-8">
                        <div className="flex flex-col gap-4">
                          <span className="text-4xl md:text-6xl font-black text-primary leading-none">{data.caloricAnalysis.caloriesPerPortion} <span className="text-sm font-bold text-primary/60 uppercase tracking-widest">kcal</span></span>
                          <div className="flex flex-col items-start gap-1">
                             <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Portion estimée</p>
                             <p className="text-sm md:text-lg font-black text-primary-950">{data.caloricAnalysis.estimatedPortion}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary-950">
                              <span>Contribution au budget journalier</span>
                              <span className="text-primary font-bold">{data.caloricAnalysis.dailyBudgetContribution}%</span>
                           </div>
                           <Progress value={data.caloricAnalysis.dailyBudgetContribution} className="h-3 bg-primary/10" />
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20 space-y-4 shadow-inner">
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest">Verdict de Qualité</p>
                           <div className="flex flex-col items-start gap-5">
                              <Badge className={cn(
                                "text-[11px] font-black px-8 py-3 rounded-full border-none shadow-md",
                                data.caloricAnalysis.qualityVerdict === 'Nutritives' ? "bg-accent text-primary-950" : "bg-red-600 text-white"
                              )}>
                                CALORIES {(data.caloricAnalysis.qualityVerdict || 'INC').toUpperCase()}
                              </Badge>
                              <p className="text-base md:text-xl font-bold leading-relaxed italic text-primary-950 border-l-4 border-primary/40 pl-8">
                                "{data.caloricAnalysis.expertAdvice}"
                              </p>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <UnavailableState 
                        icon={Target} 
                        title="Analyse Calorique Indisponible" 
                        reason="Signal Sensor-X insuffisant pour un séquençage complet" 
                     />
                   )}
                </Card>

                <div className="flex flex-col gap-6">
                   <div className="glass p-8 md:p-12 rounded-[3rem] border-primary/30 relative group overflow-hidden hover:border-primary/50 transition-all shadow-md">
                      <Quote className="absolute -top-6 -right-6 w-32 h-32 opacity-5 text-primary" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                        <Microscope size={16} className="shrink-0" /> Le Mot de l'Expert
                      </h4>
                      <p className="text-xl md:text-3xl font-headline font-bold leading-tight italic text-primary-950">
                        "{data.expertVerdict || "Scan terminé. Les données sont en cours de synchronisation."}"
                      </p>
                   </div>
                   
                   <div className="flex flex-col gap-4">
                      {(data.bonusTips?.healthBenefits || []).map((benefit, i) => (
                        <div key={i} className="glass p-8 rounded-[2.5rem] border-primary/20 hover:border-primary/40 transition-all flex flex-col items-start gap-4 hover:scale-[1.01] card-shine shadow-sm bg-white/40">
                           <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
                              <HeartPulse size={24} />
                           </div>
                           <p className="text-xs md:text-base font-black leading-relaxed uppercase tracking-widest text-primary-950 text-left">{benefit}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="molecular" className="space-y-10 mt-0">
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <Gem className="text-primary w-6 h-6 animate-pulse shrink-0" />
                  <h3 className="text-2xl font-headline font-bold tracking-tight uppercase text-primary-950">Trésors Débusqués</h3>
                </div>
                <div className="flex flex-col gap-6">
                  {data.molecularTreasures && data.molecularTreasures.length > 0 ? (
                    data.molecularTreasures.map((treasure, idx) => (
                      <Card key={idx} className="glass group rounded-[2.5rem] p-8 md:p-10 border-primary/20 hover:border-primary transition-all duration-500 relative overflow-hidden card-shine flex flex-col items-start gap-4 shadow-sm bg-white/40">
                        <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity text-primary"><Gem size={100} /></div>
                        <Badge className={cn("border-none text-[10px] font-black uppercase tracking-widest py-1.5 px-6 rounded-full shadow-sm", rarityStyles[treasure.rarity || 'Commun'])}>
                          {treasure.rarity}
                        </Badge>
                        <h4 className="text-xl md:text-3xl font-black text-primary-950 group-hover:text-primary transition-colors">{treasure.name}</h4>
                        <p className="text-sm md:text-lg text-primary-950 font-medium leading-relaxed italic">"{treasure.description}"</p>
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
              </div>

              {data.scientificAlerts && data.scientificAlerts.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <ShieldAlert className="text-red-700 w-6 h-6 shrink-0" />
                    <h3 className="text-xl md:text-2xl font-headline font-bold tracking-tight text-red-700 uppercase italic">Pièges du Labyrinthe</h3>
                  </div>
                  <div className="flex flex-col gap-6">
                    {data.scientificAlerts.map((alert, idx) => (
                      <div key={idx} className="glass border-red-700/30 bg-red-600/5 p-8 md:p-10 rounded-[2.5rem] flex flex-col items-start gap-6 hover:bg-red-600/10 transition-all group shadow-sm">
                        <div className="bg-red-700 text-white p-4 rounded-2xl h-fit group-hover:rotate-12 transition-transform shadow-lg shadow-red-700/40 shrink-0">
                          <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-4 w-full">
                          <Badge className="bg-red-700 text-white text-[10px] font-black tracking-widest py-1.5 px-6 uppercase rounded-full border-none shadow-md">
                            {(alert.category || 'INCONNU').toUpperCase()}
                          </Badge>
                          <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-red-950">{alert.title}</h4>
                          <p className="text-sm md:text-base text-red-950 font-bold leading-relaxed">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="symbiosis" className="space-y-8 mt-0">
               {data.ecoIntelligence ? (
                 <Card className="glass border-emerald-700/40 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group card-shine flex flex-col gap-10 shadow-lg bg-white/40">
                    <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Globe size={300} className="text-emerald-700" /></div>
                    <div className="flex flex-col gap-10">
                       <div className="flex flex-col items-start gap-8">
                          <div className="flex items-center gap-6">
                             <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] md:rounded-[3rem] bg-emerald-700 text-white flex items-center justify-center text-4xl md:text-6xl font-black shadow-xl group-hover:scale-105 transition-transform shrink-0">
                                {data.ecoIntelligence.ecoScore || 0}
                             </div>
                             <div className="space-y-2">
                                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Eco-Vision Rating</p>
                                <h3 className="text-2xl md:text-4xl font-headline font-bold text-emerald-950 uppercase tracking-tighter">Impact Planétaire</h3>
                             </div>
                          </div>
                          <p className="text-lg md:text-2xl font-black leading-relaxed text-emerald-950 italic border-l-4 border-emerald-700/40 pl-8">
                             "{data.ecoIntelligence.planetaryVerdict || "Analyse environnementale en cours."}"
                          </p>
                          <div className="flex flex-wrap gap-3">
                             {(data.ecoIntelligence.footprintTags || []).map((tag, i) => (
                                <Badge key={i} className="bg-emerald-700 text-white border-none text-[10px] font-black tracking-widest px-6 py-3 rounded-full hover:bg-emerald-800 transition-colors cursor-default uppercase shadow-sm">
                                   {tag.toUpperCase()}
                                </Badge>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-10 bg-emerald-700/10 p-8 md:p-12 rounded-[3rem] border border-emerald-700/20 shadow-inner">
                          <div className="space-y-4">
                             <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-emerald-900">
                                <span>Indice de Durabilité</span>
                                <span className="font-bold">{data.ecoIntelligence.ecoScore || 0}%</span>
                             </div>
                             <Progress value={data.ecoIntelligence.ecoScore || 0} className="h-4 bg-emerald-700/20" />
                          </div>
                          <div className="flex flex-col items-start gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                                <Leaf size={24} />
                             </div>
                             <p className="text-sm md:text-lg font-black text-emerald-950 italic leading-relaxed">
                                "N'oubliez pas : un environnement sain est le laboratoire nécessaire à la fabrication de vos nutriments les plus purs."
                             </p>
                          </div>
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
               <div className="flex flex-col gap-8">
                  {data.bonusTips?.expressRecipe ? (
                    <Card className="rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br from-primary to-primary/90 text-white border-none shadow-2xl relative overflow-hidden group p-8 md:p-16 transition-all hover:scale-[1.01] card-shine">
                       <div className="absolute -right-10 -top-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Utensils size={320} /></div>
                       <div className="relative z-10 space-y-10">
                          <div className="space-y-4">
                             <Badge className="bg-white text-primary border-none text-[11px] font-black tracking-widest px-8 py-3 rounded-full uppercase shadow-lg">SYNERGIE CULINAIRE</Badge>
                             <h3 className="text-3xl md:text-6xl font-headline font-bold leading-none">{data.bonusTips.expressRecipe.name}</h3>
                          </div>
                          <div className="space-y-6">
                             <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80">Ingrédients Synergiques :</p>
                             <div className="flex flex-wrap gap-3">
                                {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                                  <div key={i} className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-[12px] md:text-sm font-black border border-white/30 hover:bg-white/40 transition-all shadow-sm">
                                     {ing}
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm font-black bg-black/20 p-6 rounded-3xl border border-white/20">
                             <Zap size={20} className="text-accent shrink-0 animate-pulse" />
                             <span>Optimisation moléculaire prête en moins de 10 minutes.</span>
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

                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-3 px-4">
                        <Lightbulb className="text-primary w-6 h-6 animate-pulse shrink-0" />
                        <h3 className="text-xl md:text-2xl font-headline font-bold tracking-tight uppercase text-primary-950">Rituels de Bio-Hacking</h3>
                     </div>
                     <div className="flex flex-col gap-4">
                        {(data.bonusTips?.practicalTips || []).map((tip, i) => (
                           <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col items-start gap-6 hover:border-primary/60 hover:scale-[1.01] transition-all group cursor-default border-primary/20 shadow-sm bg-white/40">
                              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-lg">
                                 <Activity size={24} />
                              </div>
                              <div className="w-full text-left">
                                <p className="text-sm md:text-lg font-black leading-relaxed tracking-tight text-primary-950">{tip}</p>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:text-primary-800">
                                 Explorer <ChevronRight size={14} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="pt-12 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative group w-full md:w-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
            <Button 
              onClick={() => router.push('/scan')} 
              className="relative w-full md:w-auto h-20 px-12 rounded-full text-xl md:text-2xl font-headline font-bold gap-4 bg-primary text-white shadow-2xl transition-all hover:scale-105 active:scale-95 group py-4 leading-tight border-none"
            >
              <RotateCcw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700 shrink-0" />
              NOUVELLE EXPÉDITION
            </Button>
          </div>
          <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em] text-center">Science & Vérité - NutriScan 2026</p>
        </div>

      </div>
    </div>
  );
}
