"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, Sparkles, ArrowLeft, Bot, User, Quote, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askNutritionExpert, type NutritionChatOutput } from '@/ai/flows/ai-nutrition-chat-flow';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
      content: "Bonjour ! Je suis votre Expert Nutritionniste IA. Posez-moi vos questions sur un aliment, une allergie ou vos objectifs de santé. Je suis là pour vous révéler la vérité scientifique."
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: "Désolé, j'ai rencontré une difficulté technique pour analyser votre demande. Veuillez réessayer."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden animate-in fade-in duration-700">
      {/* Header */}
      <header className="px-6 py-6 border-b glass flex items-center justify-between sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
           <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">EXPERT NUTRITION</h1>
           <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-accent uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              Intelligence Active
           </div>
        </div>
        <div className="w-10" />
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-6 space-y-8" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-10 pb-12">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-500",
              msg.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-1",
                msg.role === 'user' ? "text-primary flex-row-reverse" : "text-accent"
              )}>
                {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                {msg.role === 'assistant' ? 'L\'Expert IA' : 'Vous'}
              </div>
              
              <Card className={cn(
                "p-6 rounded-[2rem] text-sm leading-relaxed shadow-sm max-w-[90%]",
                msg.role === 'user' 
                  ? "bg-primary text-white border-none rounded-tr-sm" 
                  : "glass border-accent/10 rounded-tl-sm text-foreground/80"
              )}>
                {msg.content}
              </Card>

              {msg.keyTakeaways && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mt-2">
                  {msg.keyTakeaways.map((point, i) => (
                    <div key={i} className="glass p-3 rounded-2xl border-accent/20 flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                          <Zap size={12} className="text-accent" />
                       </div>
                       <span className="text-[10px] font-bold text-foreground/60 leading-tight">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-accent animate-pulse">
               <Loader2 className="w-5 h-5 animate-spin" />
               <span className="text-[10px] font-bold uppercase tracking-widest">L'IA réfléchit...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t glass bg-white/80 backdrop-blur-3xl pb-10 md:pb-6">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question à l'Expert..."
            className="h-14 rounded-[1.5rem] bg-white border-primary/10 shadow-inner px-6 text-base"
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading || !input.trim()}
            className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0"
          >
            <Send className="w-6 h-6" />
          </Button>
        </form>
        <p className="text-center text-[8px] text-muted-foreground mt-4 font-medium uppercase tracking-widest">
           Propulsé par le Moteur Bio-Intelligence 2026
        </p>
      </div>
    </div>
  );
}
