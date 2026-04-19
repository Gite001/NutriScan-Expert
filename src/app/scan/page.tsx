
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2, Info, AlertCircle, Sparkles, X, Search, Apple, ArrowRight } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isGuest = user?.uid === 'guest-user-123';

  // Profil sync
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

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
      addDoc(collection(db, 'scans'), scanData)
        .catch(async (error) => {
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
      console.error(error);
      const isQuotaError = error?.message?.includes('quota') || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
      
      toast({
        variant: "destructive",
        title: isQuotaError ? "L'expert est très sollicité !" : "Oups, je n'ai pas bien vu...",
        description: isQuotaError 
          ? "Trop de scans en même temps. Patientez quelques secondes et relancez le radar."
          : "La photo semble floue ou le produit est mal cadré. Essayez de stabiliser l'appareil et de reprendre la photo."
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
      console.error(error);
      const isQuotaError = error?.message?.includes('quota') || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');

      toast({
        variant: "destructive",
        title: isQuotaError ? "L'expert prend une pause..." : "Produit introuvable",
        description: isQuotaError 
          ? "Le système est temporairement saturé. Attendez un court instant avant de retenter."
          : "L'IA n'a pas trouvé d'informations pour ce nom. Vérifiez l'orthographe ou essayez un nom plus connu."
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
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        handleAnalysis(dataUri);
      }
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* HUD UI */}
      <div className="absolute top-0 left-0 right-0 p-8 z-50 flex justify-between items-start pointer-events-none">
        <div className="space-y-1 pointer-events-auto">
          <h1 className="text-white text-2xl font-headline font-bold tracking-tight uppercase">Radar Bio-Hacking</h1>
          <div className="flex items-center gap-2 text-primary text-[10px] font-bold tracking-[0.3em] uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Analyse en temps réel
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white glass rounded-full w-12 h-12 pointer-events-auto"
          onClick={() => router.push('/')}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <Tabs defaultValue="camera" className="flex-1 flex flex-col">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50">
           <TabsList className="glass bg-white/10 rounded-full p-1 border-white/20 h-12">
             <TabsTrigger value="camera" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">Caméra</TabsTrigger>
             <TabsTrigger value="search" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">Recherche</TabsTrigger>
           </TabsList>
        </div>

        <TabsContent value="camera" className="flex-1 relative m-0">
          <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" 
            autoPlay 
            muted 
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="scan-line" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-primary/30 rounded-[3rem] shadow-[0_0_100px_rgba(34,197,94,0.1)]">
               <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="flex-1 flex flex-col items-center justify-center p-8 bg-black/90 m-0">
           <div className="w-full max-w-md space-y-8 animate-in zoom-in-95 duration-500">
              <div className="text-center space-y-2">
                <Search size={48} className="text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-headline font-bold text-white tracking-tighter">Recherche Expert</h2>
                <p className="text-white/40 text-sm">Entrez le nom d'un produit pour lancer l'analyse virtuelle.</p>
              </div>
              <form onSubmit={handleSearch} className="relative group">
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Lait d'avoine, Nutella, Fraises..."
                  className="h-16 rounded-[2rem] bg-white/10 border-white/20 text-white placeholder:text-white/20 pl-6 pr-20 text-lg group-focus-within:border-primary/50 transition-all"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={loading || !searchQuery.trim()}
                  className="absolute right-2 top-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                >
                  <ArrowRight size={24} />
                </Button>
              </form>
              <div className="flex flex-wrap justify-center gap-2">
                 {['Cola', 'Yaourt grec', 'Biscuits bio', 'Saumon'].map(s => (
                   <Badge 
                    key={s} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-white/10 text-white/40 border-white/10 py-1.5 px-4 rounded-full"
                    onClick={() => setSearchQuery(s)}
                   >
                     {s}
                   </Badge>
                 ))}
              </div>
           </div>
        </TabsContent>

        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center text-white z-[60]">
            <div className="relative mb-8">
              <Loader2 className="w-24 h-24 animate-spin text-primary opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            <p className="font-headline text-3xl font-bold tracking-tighter uppercase">Analyse Moléculaire...</p>
            <p className="text-primary/60 text-[10px] font-bold tracking-[0.3em] mt-2 uppercase">Extraction des séquences nutritives</p>
          </div>
        )}
      </Tabs>

      {/* Controls Bar for Camera */}
      <div className="bg-black/80 backdrop-blur-3xl border-t border-white/10 p-10 pb-16">
        <div className="flex justify-center items-center gap-12">
          <Button 
            variant="ghost" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={loading}
            className="text-white/60 hover:text-white flex flex-col gap-2 h-auto"
          >
            <Upload size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Importer</span>
          </Button>
          
          <Button 
            onClick={takePhoto} 
            disabled={loading || hasCameraPermission === false}
            className="w-20 h-20 rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_50px_rgba(255,255,255,0.2)] border-[6px] border-white/20 transition-all active:scale-90 p-0"
          >
            <Camera className="w-8 h-8" />
          </Button>

          <Button 
            variant="ghost" 
            className="text-white/60 hover:text-white flex flex-col gap-2 h-auto"
            onClick={() => router.push('/chat')}
          >
            <Sparkles size={24} className="text-accent" />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Expert AI</span>
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
