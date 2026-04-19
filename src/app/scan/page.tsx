"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2, Sparkles, X, Search, ArrowRight, Zap, Eye, Thermometer, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { nutriScanExpert } from '@/ai/flows/ai-food-recognition-and-nutrition-report-flow';
import { aiFoodSearch } from '@/ai/flows/ai-food-search-flow';
import { useAuth } from '@/context/auth-context';
import { useFirestore, useDoc } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type FilterMode = 'normal' | 'infrared' | 'lowlight';
type ScanTab = 'camera' | 'search';

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ScanTab>('camera');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('normal');
  const [isTorchOn, setIsTorchOn] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { user } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isGuest = !user || user.uid === 'guest-user-123';

  const profileRef = useMemo(() => !isGuest && user && db ? doc(db, 'profiles', user.uid) : null, [db, user, isGuest]);
  const { data: firestoreProfile } = useDoc(profileRef);
  const [localProfile, setLocalProfile] = useState<any>(null);

  useEffect(() => {
    if (isGuest) {
      const saved = localStorage.getItem('guestProfile');
      if (saved) setLocalProfile(JSON.parse(saved));
    }
  }, [isGuest]);

  const profile = isGuest ? localProfile : firestoreProfile;

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 },
        } 
      });
      streamRef.current = stream;
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.warn("Auto-play blocked:", e));
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
      setHasCameraPermission(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab, startCamera]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Play on load failed:", e));
    }
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    
    if (capabilities.torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isTorchOn }]
        } as any);
        setIsTorchOn(!isTorchOn);
      } catch (e) {
        console.warn("Torch control not supported");
      }
    }
  };

  const saveScanResult = (result: any) => {
    const scanData = {
      userId: user?.uid || 'guest-user-123',
      productName: result.productName,
      nutriScore: result.nutriScore,
      globalScore: result.globalScore,
      scannedAt: isGuest ? new Date().toISOString() : serverTimestamp(),
      result: JSON.stringify(result)
    };

    if (isGuest) {
      const existing = JSON.parse(localStorage.getItem('guestScans') || '[]');
      existing.push({ ...scanData, id: Date.now().toString() });
      localStorage.setItem('guestScans', JSON.stringify(existing));
    } else if (db) {
      addDoc(collection(db, 'scans'), scanData).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'scans',
          operation: 'create',
          requestResourceData: scanData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    }

    localStorage.setItem('lastScanResult', JSON.stringify(result));
    router.push('/scan/results');
  };

  const handleAnalysis = async (dataUri: string) => {
    setLoading(true);
    try {
      const result = await nutriScanExpert({
        photoDataUri: dataUri,
        userProfile: profile ? {
          age: profile.age,
          sex: profile.sex,
          activityLevel: profile.activityLevel,
          healthGoals: profile.healthGoals,
          allergies: profile.allergies,
          dietaryPreferences: profile.dietaryPreferences,
        } : undefined
      });
      saveScanResult(result);
    } catch (error: any) {
      const isQuotaError = error?.message?.includes('quota') || error?.message?.includes('429');
      toast({
        variant: "destructive",
        title: isQuotaError ? "L'Expert est très sollicité !" : "Analyse interrompue",
        description: isQuotaError ? "Réessayez dans quelques secondes." : "La photo est illisible ou la connexion est instable."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiFoodSearch({
        productName: searchQuery,
        userProfile: profile
      });
      saveScanResult(result);
    } catch (error: any) {
      const isQuotaError = error?.message?.includes('quota') || error?.message?.includes('429');
      toast({
        variant: "destructive",
        title: isQuotaError ? "Système saturé" : "Produit non identifié",
        description: "Veuillez patienter ou vérifier votre connexion radar."
      });
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.save();
        if (filterMode === 'infrared') {
          context.filter = 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.5) saturate(2)';
        } else if (filterMode === 'lowlight') {
          context.filter = 'brightness(2) contrast(1.3) saturate(0.2) sepia(1) hue-rotate(70deg)';
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();
        
        const dataUri = canvas.toDataURL('image/jpeg', 0.8);
        handleAnalysis(dataUri);
      }
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleAnalysis(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filterClasses = {
    normal: "",
    infrared: "invert-[1] hue-rotate-[180deg] brightness-[1.1] contrast-[1.4] saturate-[2]",
    lowlight: "brightness-[1.8] contrast-[1.2] saturate-[0.1] sepia-[1] hue-rotate-[70deg] grayscale-[0.2]"
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-6 z-[60] flex justify-between items-start pointer-events-none">
        <div className="space-y-1 pointer-events-auto">
          <h1 className="text-white text-xl font-headline font-bold tracking-tight uppercase flex items-center gap-2">
            <Zap className="text-primary w-5 h-5 animate-pulse" />
            SENSOR-X 2026
          </h1>
          <div className="flex items-center gap-2 text-primary text-[8px] font-bold tracking-[0.3em] uppercase bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-primary/20 w-fit">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            VISION: {activeTab === 'camera' ? filterMode.toUpperCase() : 'VIRTUEL'}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white glass rounded-full w-10 h-10 pointer-events-auto border-white/10 hover:bg-white/20 transition-all bg-white/10"
          onClick={() => router.push('/')}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
         <div className="bg-black/40 backdrop-blur-md border border-white/10 p-1 rounded-2xl flex gap-1">
            <button 
              onClick={() => setActiveTab('camera')}
              className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                activeTab === 'camera' ? "bg-white/10 text-white shadow-inner" : "text-white/30 hover:text-white/60"
              )}
            >
              Radar
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                activeTab === 'search' ? "bg-white/10 text-white shadow-inner" : "text-white/30 hover:text-white/60"
              )}
            >
              Virtuel
            </button>
         </div>
      </div>

      <div className="flex-1 relative">
        {activeTab === 'camera' ? (
          <div className="absolute inset-0">
             <video 
              ref={videoRef} 
              className={cn("absolute inset-0 w-full h-full object-cover transition-all duration-700", filterClasses[filterMode])} 
              autoPlay 
              muted 
              playsInline
              controls={false}
              onLoadedMetadata={handleVideoLoad}
              onCanPlay={handleVideoLoad}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="scan-line" />
              <div className="radar-sweep" />
              <div className="absolute inset-8 border border-white/5 rounded-[3rem]">
                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-2 border-l-2 border-primary rounded-tl-2xl shadow-[-3px_-3px_10px_rgba(34,197,94,0.3)]" />
                <div className="absolute -top-1 -right-1 w-10 h-10 border-t-2 border-r-2 border-primary rounded-tr-2xl shadow-[3px_-3px_10px_rgba(34,197,94,0.3)]" />
                <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-2 border-l-2 border-primary rounded-bl-2xl shadow-[-3px_3px_10px_rgba(34,197,94,0.3)]" />
                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-2 border-r-2 border-primary rounded-br-2xl shadow-[3px_3px_10px_rgba(34,197,94,0.3)]" />
              </div>
            </div>

            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
              {[
                { id: 'normal', icon: Eye, label: 'STND' },
                { id: 'infrared', icon: Thermometer, label: 'HEAT' },
                { id: 'lowlight', icon: Moon, label: 'DARK' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setFilterMode(mode.id as FilterMode)}
                  className={cn(
                    "p-2.5 rounded-2xl backdrop-blur-xl border transition-all flex flex-col items-center gap-1",
                    filterMode === mode.id 
                      ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                  )}
                >
                  <mode.icon size={18} />
                  <span className="text-[6px] font-black uppercase tracking-tighter">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8">
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
             
             <div className="w-full max-w-md space-y-8 animate-in zoom-in-95 duration-500 relative z-10">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto border border-primary/30">
                    <Search size={32} className="text-primary" />
                  </div>
                  <h2 className="text-3xl font-headline font-bold text-white tracking-tighter">RECHERCHE VIRTUELLE</h2>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">Identification par base de données</p>
                </div>
                <form onSubmit={handleSearch} className="relative group">
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nom du produit ou marque..."
                    className="h-16 rounded-3xl bg-white/5 border-white/10 text-white placeholder:text-white/20 pl-6 pr-20 text-lg group-focus-within:border-primary/50 group-focus-within:bg-white/10 transition-all"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={loading || !searchQuery.trim()}
                    className="absolute right-2 top-2 h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 transition-transform active:scale-90"
                  >
                    <ArrowRight size={24} />
                  </Button>
                </form>
             </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center text-white z-[70]">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="font-headline text-3xl font-bold tracking-tighter uppercase mb-2">Décryptage Moléculaire</p>
          <span className="text-primary/60 text-[9px] font-bold tracking-[0.4em] uppercase">Séquençage Augmenté en cours...</span>
        </div>
      )}

      <div className={cn(
        "bg-black/90 backdrop-blur-[40px] border-t border-white/5 p-8 pb-12 relative z-[55] transition-all duration-500",
        activeTab === 'search' ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      )}>
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <Button 
            variant="ghost" 
            onClick={toggleTorch}
            className={cn("flex flex-col gap-1.5 h-auto w-16 transition-all", isTorchOn ? "text-primary scale-110" : "text-white/40 hover:text-white")}
          >
            <Zap size={24} className={cn(isTorchOn && "fill-primary")} />
            <span className="text-[7px] font-black uppercase tracking-widest">Flash</span>
          </Button>
          
          <button 
            onClick={takePhoto} 
            disabled={loading || hasCameraPermission === false}
            className="w-20 h-20 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl border-[6px] border-black/20 transition-all active:scale-90 flex items-center justify-center group"
          >
            <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>

          <Button 
            variant="ghost" 
            onClick={() => fileInputRef.current?.click()} 
            className="flex flex-col gap-1.5 h-auto w-16 text-white/40 hover:text-white"
          >
            <Upload size={24} />
            <span className="text-[7px] font-black uppercase tracking-widest">Galerie</span>
          </Button>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}
