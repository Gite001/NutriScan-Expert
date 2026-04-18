"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Image as ImageIcon, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { nutriScanExpert } from '@/ai/flows/ai-food-recognition-and-nutrition-report-flow';
import { useAuth } from '@/context/auth-context';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalysis = async (dataUri: string) => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch user profile for personalization
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
      const userProfile = profileDoc.exists() ? profileDoc.data() : undefined;

      const result = await nutriScanExpert({
        photoDataUri: dataUri,
        userProfile: userProfile ? {
          age: userProfile.age,
          sex: userProfile.sex,
          activityLevel: userProfile.activityLevel,
          healthGoals: userProfile.healthGoals,
          allergies: userProfile.allergies,
          dietaryPreferences: userProfile.dietaryPreferences,
        } : undefined
      });

      // Save to scan history
      await addDoc(collection(db, 'scans'), {
        userId: user.uid,
        productName: result.productName,
        nutriScore: result.nutriScore,
        globalScore: result.globalScore,
        scannedAt: serverTimestamp(),
        result: JSON.stringify(result)
      });

      // Redirect to results with the data
      localStorage.setItem('lastScanResult', JSON.stringify(result));
      router.push('/scan/results');
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'image. Assurez-vous qu'elle est claire et contient des informations nutritionnelles."
      });
    } finally {
      setLoading(false);
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
        <p className="text-muted-foreground">Prenez une photo de votre aliment pour une analyse complète.</p>
      </div>

      <Card className="border-dashed border-2 bg-white/50">
        <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {loading ? <Loader2 className="w-12 h-12 animate-spin" /> : <Camera className="w-12 h-12" />}
          </div>
          
          <div className="grid grid-cols-1 w-full gap-4 px-4">
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={loading}
              className="h-14 text-lg gap-2 bg-primary hover:bg-primary/90 rounded-2xl"
            >
              <Camera className="w-5 h-5" />
              Prendre une Photo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={loading}
              className="h-14 text-lg gap-2 border-primary text-primary hover:bg-primary/5 rounded-2xl"
            >
              <Upload className="w-5 h-5" />
              Choisir de la Galerie
            </Button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={onFileChange}
              capture="environment"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-accent/10 p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold font-headline">
          <Info className="w-5 h-5" />
          Conseils pour un scan réussi
        </div>
        <ul className="text-sm text-primary/80 space-y-2 list-disc pl-5">
          <li>Bien cadrer le produit et les informations nutritionnelles.</li>
          <li>Assurez-vous d'avoir un bon éclairage.</li>
          <li>Évitez les reflets sur les emballages plastiques.</li>
          <li>La liste des ingrédients et le code-barres aident l'IA à être plus précise.</li>
        </ul>
      </div>
    </div>
  );
}