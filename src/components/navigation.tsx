"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Apple, UserRound, LogIn } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (pathname === '/login' || pathname === '/scan' || pathname === '/chat') return null;

  const navItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Expert AI', href: '/chat', icon: UserRound },
    { label: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Top Bar */}
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-8 py-4 items-center gap-12 w-fit border-primary/20">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-xl shadow-lg">
            <Apple className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tighter text-primary">NutriScan <span className="text-accent">Expert</span></span>
        </Link>
        <div className="flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-all hover:text-primary",
                pathname === item.href ? "text-primary" : "text-primary/60"
              )}
            >
              {item.label}
            </Link>
          ))}
          {!user && !loading && (
            <Link href="/login">
              <Button size="sm" className="rounded-full bg-primary text-white font-black text-[9px] uppercase tracking-widest px-6 h-9">
                <LogIn size={12} className="mr-2" />
                Connexion
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 h-16 w-[90%] flex justify-around items-center border border-primary/20 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all px-2 min-w-[60px]",
                isActive ? "text-primary scale-110" : "text-primary/40 hover:text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
        {!user && !loading && (
          <Link
            href="/login"
            className="flex flex-col items-center justify-center gap-1 transition-all px-2 min-w-[60px] text-accent"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[7px] font-black uppercase tracking-tighter">Login</span>
          </Link>
        )}
      </nav>
    </>
  );
};
