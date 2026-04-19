"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, ArrowLeft, Microscope, User, Zap, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askNutritionExpert } from '@/ai/flows/ai-nutrition-chat-flow';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  keyTakeaways?: string[];
}

export default function ChatPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour ! Je suis votre **IA Expert Nutritionniste**. Passionné par la biologie moléculaire, je suis là pour vous aider à décrypter la vérité derrière vos aliments. Que voulez-vous explorer aujourd'hui ?"
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askNutritionExpert(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        keyTakeaways: response.keyTakeaways
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const isQuotaError = error?.message?.includes('quota') || 
                           error?.message?.includes('429') || 
                           error?.message?.includes('RESOURCE_EXHAUSTED') ||
                           error?.message?.includes('limit');
      
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: isQuotaError 
          ? "Je reçois énormément de questions en ce moment ! Laissez-moi souffler quelques secondes et reposez-moi votre question."
          : "J'ai eu un petit souci technique. Pouvez-vous reformuler ?"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden animate-in fade-in duration-700">
      <header className="px-6 py-6 border-b glass flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-3xl border-primary/20">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full border border-primary-950/40 hover:bg-primary/10 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary-950" />
        </Button>
        <div className="text-center px-2">
           <h1 className="text-lg md:text-xl font-headline font-bold text-primary-950 tracking-tighter uppercase">IA EXPERT NUTRITION</h1>
           <div className="flex items-center justify-center gap-1.5 text-[8px] font-black text-primary-950 uppercase tracking-widest bg-primary/20 px-3 py-1 rounded-full border border-primary/40">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Intelligence Active 2026
           </div>
        </div>
        <div className="w-10" />
      </header>

      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-12 pb-24">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-500",
              msg.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1",
                msg.role === 'user' ? "text-primary-950 flex-row-reverse" : "text-primary-950"
              )}>
                {msg.role === 'assistant' ? (
                  <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1.5 rounded-full border border-primary/40">
                    <UserRound size={12} className="text-primary-950" />
                    <span className="text-primary-950 font-black uppercase">Expert Scientifique</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-primary/30 px-3 py-1.5 rounded-full border border-primary-950/40">
                    <User size={12} className="text-primary-950" />
                    <span className="text-primary-950 font-black uppercase tracking-tight">Vous</span>
                  </div>
                )}
              </div>
              
              <Card className={cn(
                "p-6 rounded-[2.5rem] shadow-sm max-w-[95%] transition-all relative group card-shine",
                msg.role === 'user' 
                  ? "bg-primary text-white border-none rounded-tr-sm text-sm" 
                  : "glass border-primary/40 rounded-tl-sm text-primary-950 chat-prose bg-white/60 shadow-lg"
              )}>
                {msg.role === 'assistant' && (
                  <div className="absolute -left-3 -top-3 bg-white border border-primary/40 rounded-full p-1.5 shadow-md text-primary-950">
                    <Microscope size={14} />
                  </div>
                )}
                <div className={cn(msg.role === 'user' ? "text-white font-medium" : "text-primary-950 font-black")}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </Card>

              {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mt-2">
                  {msg.keyTakeaways.map((point, i) => (
                    <div key={i} className="glass p-4 rounded-2xl border-primary/40 flex items-center gap-3 hover:border-primary/60 hover:scale-105 transition-all card-shine shadow-sm bg-white/50">
                       <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Zap size={12} className="text-primary-950" />
                       </div>
                       <span className="text-[10px] font-black text-primary-950 leading-tight uppercase tracking-tight">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-primary-950 animate-pulse pl-4">
               <div className="relative">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <Microscope size={10} className="absolute inset-0 m-auto text-primary" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest italic text-primary-950">Analyse moléculaire en cours...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t glass bg-white/80 backdrop-blur-3xl pb-10 md:pb-6 border-primary/20">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex flex-col gap-4">
          <div className="relative flex items-center gap-3">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="h-16 rounded-[2rem] bg-white border-primary-950/40 shadow-inner px-8 text-base md:text-lg text-primary-950 font-black placeholder:text-primary-950/60 placeholder:font-black placeholder:text-sm focus:ring-primary/40 focus:border-primary transition-all flex-1"
              disabled={loading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={loading || !input.trim()}
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0 transition-all active:scale-90"
            >
              <Send className="w-8 h-8 text-white" />
            </Button>
          </div>
          <p className="text-center text-[8px] text-primary-950 font-black uppercase tracking-[0.4em]">
             Bio-Intelligence Active 2026
          </p>
        </form>
      </div>
    </div>
  );
}
