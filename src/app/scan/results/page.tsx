
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
  DatabaseZap,
  SearchX
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
    A: "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]", 
    B: "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]", 
    C: "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]", 
    D: "bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]", 
    E: "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
  };

  const rarityStyles = {
    'Commun': 'bg-muted text-muted-foreground',
    'Rare': 'bg-primary/20 text-primary border border-primary/30',
    'Légendaire': 'bg-accent/20 text-accent animate-pulse border border-accent/50 shadow-[0_0_15px_rgba(163,230,53,0.3)]',
  };

  return (
    <div className="min-h-screen pb-24 bg-background selection:bg-accent/30">
      <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-10">
        
        {/* HEADER TACTIQUE */}
        <header className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <Button variant="ghost" size="icon" onClick={() => router.push('/scan')} className="rounded-full glass hover:bg-white/40 transition-all active:scale-90">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-[9px] font-black text-primary tracking-[0.4em] uppercase">
              <Fingerprint size={12} className="animate-pulse" />
              Signature Sensor-X 2.6
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary tracking-tighter uppercase">ANALYSE SANS LIMITES</h1>
          </div>
        </header>

        {/* HERO INTERACTIF */}
        <section className="relative group animate-in zoom-in-95 duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
          <Card className="glass rounded-[3rem] p-6 md:p-12 relative overflow-hidden border-primary/10 transition-all duration-500 hover:shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              <div className="space-y-6">
                <div className="space-y-3 text-center md:text-left">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase py-1.5 px-5 rounded-full tracking-widest animate-pulse whitespace-normal leading-tight">
                    {data.personalizationIndicator || "ANALYSE PERSONNALISÉE"}
                  </Badge>
                  <h2 className="text-3xl md:text-6xl font-headline font-bold tracking-tighter leading-none group-hover:text-primary transition-colors whitespace-normal break-words">
                    {data.productName}
                  </h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <div className="glass p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center min-w-[80px] md:min-w-[100px] border-primary/20 hover:scale-110 transition-transform cursor-help">
                    <span className="text-3xl md:text-4xl font-black text-primary leading-none">{data.globalScore || 0}</span>
                    <span className="text-[8px] md:text-[9px] font-black opacity-50 uppercase tracking-widest mt-1">Bio-Score</span>
                  </div>
                  <div className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-5xl md:text-6xl font-black text-white transition-all duration-500 hover:rotate-6 cursor-help shrink-0", 
                    scoreColors[data.nutriScore || 'C']
                  )}>
                    {data.nutriScore || '-'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {(data.quickLook || []).map((item, i) => (
                   <div key={i} className="glass p-6 rounded-3xl border-primary/5 hover:border-primary/20 transition-all hover:-translate-y-1 card-shine flex flex-col gap-3 group">
                      <div className="flex flex-col items-start gap-0.5">
                        <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{item.name}</p>
                        <span className="text-xl md:text-2xl font-black">{item.level}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] md:text-xs border-primary/20 px-4 py-2 font-bold rounded-xl bg-white/50 backdrop-blur-sm group-hover:bg-primary/10 group-hover:text-primary transition-all whitespace-normal leading-relaxed text-left w-full">
                        {item.benefit}
                      </Badge>
                   </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* TABS NAVIGATION */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-14 md:h-16 rounded-[2rem] glass p-1 md:p-2 gap-1 md:gap-2 border-primary/10">
            <TabsTrigger value="vitality" className="rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white px-1 md:px-2">
              <Activity size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">Vitalité</span>
            </TabsTrigger>
            <TabsTrigger value="molecular" className="rounded-[1.5rem] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-1 md:px-2">
              <Layers size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">Moléculaire</span>
            </TabsTrigger>
            <TabsTrigger value="symbiosis" className="rounded-[1.5rem] data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-1 md:px-2">
              <Globe size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">Symbiose</span>
            </TabsTrigger>
            <TabsTrigger value="alchemy" className="rounded-[1.5rem] data-[state=active]:bg-amber-500 data-[state=active]:text-white px-1 md:px-2">
              <Sparkles size={16} className="shrink-0" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">Alchimie</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px] animate-in slide-in-from-bottom-8 duration-700">
            <TabsContent value="vitality" className="space-y-8 mt-0">
              <div className="flex flex-col gap-8">
                <Card className="glass rounded-[3rem] p-6 md:p-10 border-primary/10 hover:border-primary/30 transition-all group overflow-hidden relative card-shine">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-150 transition-transform duration-1000"><Flame size={120} /></div>
                   <h3 className="text-2xl font-headline font-bold mb-8 flex items-center gap-3">
                      <Target className="text-primary shrink-0" /> Budget Énergétique
                   </h3>
                   {data.caloricAnalysis ? (
                     <div className="space-y-8">
                        <div className="flex flex-col gap-4">
                          <span className="text-4xl md:text-6xl font-black text-primary leading-none">{data.caloricAnalysis.caloriesPerPortion} <span className="text-sm font-normal text-muted-foreground uppercase tracking-widest">kcal</span></span>
                          <div className="flex flex-col items-start gap-1">
                             <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">Portion estimée</p>
                             <p className="text-sm md:text-lg font-bold">{data.caloricAnalysis.estimatedPortion}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest gap-2">
                              <span>Contribution au budget journalier</span>
                              <span className="text-primary shrink-0">{data.caloricAnalysis.dailyBudgetContribution}%</span>
                           </div>
                           <Progress value={data.caloricAnalysis.dailyBudgetContribution} className="h-3 bg-primary/10" />
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest">Verdict de Qualité</p>
                           <div className="flex flex-col items-start gap-4">
                              <Badge className={cn(
                                "text-[10px] md:text-xs font-bold px-6 py-2.5 rounded-full border-none whitespace-normal leading-tight",
                                data.caloricAnalysis.qualityVerdict === 'Nutritives' ? "bg-accent text-accent-foreground" : "bg-red-500 text-white"
                              )}>
                                CALORIES {(data.caloricAnalysis.qualityVerdict || 'INC').toUpperCase()}
                              </Badge>
                              <p className="text-base md:text-xl font-medium leading-relaxed italic text-foreground/90 border-l-4 border-primary/20 pl-6 whitespace-normal break-words">
                                "{data.caloricAnalysis.expertAdvice}"
                              </p>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="glass rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-primary/20">
                        <DatabaseZap className="w-12 h-12 text-primary/20 animate-pulse" />
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-50">Analyse calorique indisponible</p>
                     </div>
                   )}
                </Card>

                <div className="flex flex-col gap-6">
                   <div className="glass p-8 md:p-12 rounded-[3rem] border-primary/10 relative group overflow-hidden hover:border-primary/30 transition-all">
                      <Quote className="absolute -top-6 -right-6 w-32 h-32 opacity-5" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                        <Microscope size={14} className="shrink-0" /> Le Mot de l'Expert
                      </h4>
                      <p className="text-xl md:text-3xl font-headline font-bold leading-tight italic whitespace-normal break-words">
                        "{data.expertVerdict || "Scan terminé. Les données sont en cours de synchronisation."}"
                      </p>
                   </div>
                   
                   <div className="flex flex-col gap-4">
                      {(data.bonusTips?.healthBenefits || []).map((benefit, i) => (
                        <div key={i} className="glass p-8 rounded-[2.5rem] border-primary/5 hover:border-primary/20 transition-all flex flex-col items-start gap-4 hover:scale-[1.01] card-shine">
                           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
                              <HeartPulse size={24} />
                           </div>
                           <p className="text-xs md:text-base font-bold leading-relaxed uppercase tracking-widest text-left whitespace-normal break-words">{benefit}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="molecular" className="space-y-10 mt-0">
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <Gem className="text-accent w-6 h-6 animate-pulse shrink-0" />
                  <h3 className="text-2xl font-headline font-bold tracking-tight uppercase">Trésors Débusqués</h3>
                </div>
                <div className="flex flex-col gap-6">
                  {data.molecularTreasures && data.molecularTreasures.length > 0 ? (
                    data.molecularTreasures.map((treasure, idx) => (
                      <Card key={idx} className="glass group rounded-[2.5rem] p-8 md:p-10 border-primary/5 hover:border-accent/40 transition-all duration-500 relative overflow-hidden card-shine flex flex-col items-start gap-4">
                        <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity"><Gem size={100} /></div>
                        <Badge className={cn("border-none text-[8px] md:text-[10px] font-black uppercase tracking-widest py-1.5 px-4 whitespace-normal leading-tight rounded-full", rarityStyles[treasure.rarity || 'Commun'])}>
                          {treasure.rarity}
                        </Badge>
                        <h4 className="text-xl md:text-3xl font-black group-hover:text-accent transition-colors whitespace-normal break-words">{treasure.name}</h4>
                        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed whitespace-normal break-words italic">"{treasure.description}"</p>
                      </Card>
                    ))
                  ) : (
                    <div className="glass rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-accent/20">
                        <SearchX className="w-12 h-12 text-accent/20" />
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-50">Aucun trésor moléculaire détecté</p>
                    </div>
                  )}
                </div>
              </div>

              {data.scientificAlerts && data.scientificAlerts.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <ShieldAlert className="text-red-500 w-6 h-6 shrink-0" />
                    <h3 className="text-xl md:text-2xl font-headline font-bold tracking-tight text-red-600 uppercase italic">Pièges du Labyrinthe</h3>
                  </div>
                  <div className="flex flex-col gap-6">
                    {data.scientificAlerts.map((alert, idx) => (
                      <div key={idx} className="glass border-red-500/20 bg-red-500/5 p-8 md:p-10 rounded-[2.5rem] flex flex-col items-start gap-6 hover:bg-red-500/10 transition-all group">
                        <div className="bg-red-500 text-white p-4 rounded-2xl h-fit group-hover:rotate-12 transition-transform shadow-lg shadow-red-500/20 shrink-0">
                          <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-4 w-full">
                          <Badge variant="outline" className="text-[9px] border-red-500/30 text-red-500 font-black tracking-widest py-1.5 px-4 whitespace-normal leading-tight uppercase rounded-full">
                            {(alert.category || 'INCONNU').toUpperCase()}
                          </Badge>
                          <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-red-900 whitespace-normal break-words">{alert.title}</h4>
                          <p className="text-sm md:text-base text-red-900/70 font-medium leading-relaxed whitespace-normal break-words">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="symbiosis" className="space-y-8 mt-0">
               {data.ecoIntelligence ? (
                 <Card className="glass border-emerald-500/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group card-shine flex flex-col gap-10">
                    <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Globe size={300} className="text-emerald-500" /></div>
                    <div className="flex flex-col gap-10">
                       <div className="flex flex-col items-start gap-8">
                          <div className="flex items-center gap-6">
                             <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] md:rounded-[3rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-4xl md:text-6xl font-black border border-emerald-500/20 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                                {data.ecoIntelligence.ecoScore || 0}
                             </div>
                             <div className="space-y-2">
                                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-emerald-600">Eco-Vision Rating</p>
                                <h3 className="text-2xl md:text-4xl font-headline font-bold text-emerald-950 uppercase tracking-tighter">Impact Planétaire</h3>
                             </div>
                          </div>
                          <p className="text-lg md:text-2xl font-medium leading-relaxed text-emerald-950/80 italic border-l-4 border-emerald-500/20 pl-8 whitespace-normal break-words">
                             "{data.ecoIntelligence.planetaryVerdict || "Analyse environnementale en cours."}"
                          </p>
                          <div className="flex flex-wrap gap-3">
                             {(data.ecoIntelligence.footprintTags || []).map((tag, i) => (
                                <Badge key={i} className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[9px] md:text-[10px] font-black tracking-widest px-5 py-2.5 rounded-full hover:bg-emerald-500 hover:text-white transition-colors cursor-default whitespace-normal leading-tight uppercase">
                                   {tag.toUpperCase()}
                                </Badge>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-10 bg-emerald-500/5 p-8 md:p-12 rounded-[3rem] border border-emerald-500/10">
                          <div className="space-y-4">
                             <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-700">
                                <span>Indice de Durabilité</span>
                                <span>{data.ecoIntelligence.ecoScore || 0}%</span>
                             </div>
                             <Progress value={data.ecoIntelligence.ecoScore || 0} className="h-4 bg-emerald-500/10" />
                          </div>
                          <div className="flex flex-col items-start gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                                <Leaf size={24} />
                             </div>
                             <p className="text-sm md:text-lg font-medium text-emerald-900/70 italic leading-relaxed whitespace-normal break-words">
                                "N'oubliez pas : un environnement sain est le laboratoire nécessaire à la fabrication de vos nutriments les plus purs."
                             </p>
                          </div>
                       </div>
                    </div>
                 </Card>
               ) : (
                 <div className="glass rounded-[3rem] p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-emerald-500/20">
                    <Globe size={48} className="text-emerald-500/20" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-50">Données environnementales indisponibles</p>
                 </div>
               )}
            </TabsContent>

            <TabsContent value="alchemy" className="space-y-8 mt-0">
               <div className="flex flex-col gap-8">
                  {data.bonusTips?.expressRecipe ? (
                    <Card className="rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br from-primary to-primary/80 text-white border-none shadow-2xl relative overflow-hidden group p-8 md:p-16 transition-all hover:scale-[1.01] card-shine">
                       <div className="absolute -right-10 -top-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Utensils size={320} /></div>
                       <div className="relative z-10 space-y-10">
                          <div className="space-y-4">
                             <Badge className="bg-white/20 text-white border-none text-[10px] md:text-xs font-bold tracking-widest px-6 py-2.5 rounded-full uppercase">SYNERGIE CULINAIRE</Badge>
                             <h3 className="text-3xl md:text-6xl font-headline font-bold leading-none whitespace-normal break-words">{data.bonusTips.expressRecipe.name}</h3>
                          </div>
                          <div className="space-y-6">
                             <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">Ingrédients Synergiques :</p>
                             <div className="flex flex-wrap gap-3">
                                {data.bonusTips.expressRecipe.ingredients.map((ing, i) => (
                                  <div key={i} className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-[11px] md:text-sm font-black border border-white/20 hover:bg-white/20 transition-all cursor-default whitespace-normal leading-tight">
                                     {ing}
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs md:text-sm font-bold bg-black/10 p-6 rounded-3xl border border-white/10">
                             <Zap size={20} className="text-accent shrink-0" />
                             <span className="whitespace-normal leading-relaxed">Optimisation moléculaire prête en moins de 10 minutes.</span>
                          </div>
                       </div>
                    </Card>
                  ) : (
                    <div className="glass rounded-[3rem] p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-amber-500/20">
                      <Utensils size={48} className="text-amber-500/20" />
                      <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-50">Recette indisponible</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-3 px-4">
                        <Lightbulb className="text-amber-500 w-6 h-6 animate-pulse shrink-0" />
                        <h3 className="text-xl md:text-2xl font-headline font-bold tracking-tight uppercase">Rituels de Bio-Hacking</h3>
                     </div>
                     <div className="flex flex-col gap-4">
                        {(data.bonusTips?.practicalTips || []).map((tip, i) => (
                           <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col items-start gap-6 hover:border-accent/40 hover:scale-[1.01] transition-all group cursor-default">
                              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-all shadow-lg shadow-accent/5">
                                 <Activity size={24} />
                              </div>
                              <div className="w-full text-left">
                                <p className="text-sm md:text-lg font-bold leading-relaxed tracking-tight text-foreground/80 whitespace-normal break-words">{tip}</p>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent/60 group-hover:text-accent">
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

        {/* ACTIONS FINALES */}
        <div className="pt-12 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative group w-full md:w-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
            <Button 
              onClick={() => router.push('/scan')} 
              className="relative w-full md:w-auto h-20 px-12 rounded-full text-xl md:text-2xl font-headline font-bold gap-4 bg-primary shadow-2xl transition-all hover:scale-105 active:scale-95 group whitespace-normal py-4 leading-tight"
            >
              <RotateCcw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700 shrink-0" />
              NOUVELLE EXPÉDITION
            </Button>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 text-center">Science & Vérité - NutriScan 2026</p>
        </div>

      </div>
    </div>
  );
}
