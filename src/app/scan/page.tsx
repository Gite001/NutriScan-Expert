
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { nutriScanExpert } from '@/ai/flows/ai-food-recognition-and-nutrition-report-flow';
import { useAuth } from '@/context/auth-context';
import { useFirestore, useDoc } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isGuest = user?.uid === 'guest-user-123';

  // Firestore sync - only for non-guest users
  const profileRef = useMemo(() => !isGuest && user && db ? doc(db, 'profiles', user.uid) : null, [db, user, isGuest]);
  const { data: firestoreProfile } = useDoc(profileRef);

  // Local sync for guest
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'image. Assurez-vous qu'elle est claire."
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
    <div className="max-w-xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Prêt à scanner ?</h1>
        <p className="text-muted-foreground">Visez l'aliment ou importez une photo.</p>
      </div>

      <Card className="overflow-hidden border-2 bg-black relative group shadow-2xl rounded-[2.5rem]">
        <video 
          ref={videoRef} 
          className="w-full aspect-[3/4] object-cover" 
          autoPlay 
          muted 
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {loading && (
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
            <Loader2 className="w-16 h-16 animate-spin mb-4" />
            <p className="font-bold text-lg animate-pulse">Analyse nutritionnelle en cours...</p>
          </div>
        )}

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6 z-10">
          <Button 
            onClick={takePhoto} 
            disabled={loading || hasCameraPermission === false}
            size="lg"
            className="w-20 h-20 rounded-full bg-white text-primary hover:bg-white/90 border-4 border-primary shadow-xl p-0"
          >
            <Camera className="w-10 h-10" />
          </Button>
        </div>
      </Card>

      {hasCameraPermission === false && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès Caméra Refusé</AlertTitle>
          <AlertDescription>
            Veuillez autoriser l'accès à la caméra pour scanner en direct ou utilisez l'option d'importation.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 w-full gap-4">
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()} 
          disabled={loading}
          className="h-14 text-lg gap-2 border-primary text-primary hover:bg-primary/5 rounded-2xl"
        >
          <Upload className="w-5 h-5" />
          Importer de la Galerie
        </Button>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={onFileChange}
        />
      </div>

      <div className="bg-accent/10 p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold font-headline">
          <Info className="w-5 h-5" />
          Scan Expert {isGuest && "(Mode Démo)"}
        </div>
        <p className="text-xs text-primary/80 leading-relaxed">
          Pour une précision optimale, assurez-vous que la liste des ingrédients et les valeurs nutritionnelles sont bien lisibles dans le cadre.
        </p>
      </div>
    </div>
  );
}
