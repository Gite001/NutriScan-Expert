"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Scan, ShieldAlert, Award, ArrowRight, Apple } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();

  // No redirect here anymore to allow free access
  if (loading) return null;

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary leading-tight">
            Découvrez les secrets <br /> de vos aliments
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyse nutritionnelle instantanée par IA pour manger plus sainement et comprendre ce qui se cache derrière chaque étiquette.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="h-14 px-10 text-lg bg-primary rounded-full hover:bg-primary/90 shadow-lg shadow-primary/20 group">
              <Link href="/scan">
                Commencer à Scanner
                <Scan className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Scan par IA",
              desc: "Reconnaissance ultra-précise d'aliments : fruits, légumes et produits emballés.",
              icon: Scan,
              color: "bg-blue-100 text-blue-600"
            },
            {
              title: "Analyse d'expert",
              desc: "Attribution d'un score santé personnalisé basé sur votre profil et vos objectifs.",
              icon: Award,
              color: "bg-primary/10 text-primary"
            },
            {
              title: "Alertes de danger",
              desc: "Avertissements immédiats sur les additifs, les sucres cachés et les allergènes.",
              icon: ShieldAlert,
              color: "bg-red-100 text-red-600"
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className={`${feature.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-headline font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome Message for Guest */}
      <section className="px-6 max-w-2xl mx-auto text-center py-6">
        <p className="text-muted-foreground text-sm">
          Connecté en tant qu'<strong>{user?.displayName}</strong>
        </p>
      </section>
    </div>
  );
}
