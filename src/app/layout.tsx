import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'NutriScan Expert - Découvrez les secrets de vos aliments',
  description: 'Analyse nutritionnelle instantanée par IA pour manger plus sainement.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <AuthProvider>
          <Navigation />
          <main className="flex-grow pb-20 md:pb-0">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}