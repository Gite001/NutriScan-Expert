"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, User, Apple } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Navigation is always visible now except on login page
  if (pathname === '/login') return null;

  const navItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Scanner', href: '/scan', icon: Scan },
    { label: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Top Bar */}
      <nav className="hidden md:flex sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Apple className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">NutriScan <span className="text-accent">Expert</span></span>
        </Link>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
