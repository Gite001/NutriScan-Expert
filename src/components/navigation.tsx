"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, User, Apple, Activity, UserRound } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === '/login' || pathname === '/scan' || pathname === '/chat') return null;

  const navItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Scanner', href: '/scan', icon: Scan, primary: true },
    { label: 'Expert AI', href: '/chat', icon: UserRound },
    { label: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Top Bar */}
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-8 py-4 items-center gap-12 w-fit">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-xl shadow-lg">
            <Apple className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tighter text-primary">NutriScan <span className="text-accent">Expert</span></span>
        </Link>
        <div className="flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-all hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 h-20 w-[94%] flex justify-around items-center border border-white/40 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-[0_15px_30px_-10px_rgba(34,197,94,0.5)] -mt-12 group transition-transform active:scale-90"
              >
                <Icon className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all px-2 min-w-[60px]",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[7px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
