'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    errorEmitter.on('permission-error', (error) => {
      console.error('Firebase Permission Error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de permission Firestore',
        description: `Action refusée : ${error.context.operation} sur ${error.context.path}. Vérifiez vos règles de sécurité.`,
      });
    });
  }, [toast]);

  return null;
}
