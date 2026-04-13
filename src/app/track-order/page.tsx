"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useStore, Order } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Radar, Search, CheckCircle2, Clock, Package, ShieldAlert, ChevronRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const { orders, settings } = useStore();
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    
    // Simulate lookup delay
    setTimeout(() => {
      const order = orders.find(o => 
        o.id.toLowerCase() === orderId.toLowerCase() || 
        o.displayId.toLowerCase() === orderId.toLowerCase()
      );
      
      if (order) {
        setFoundOrder(order);
      } else {
        setError('Mission ID not found in database. Please verify your transmission ID.');
        setFoundOrder(null);
      }
      setIsSearching(false);
    }, 800);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-6 h-6 text-primary" />;
      case 'pending': return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'processing': return <Package className="w-6 h-6 text-blue-500" />;
      default: return <Radar className="w-6 h-6 text-secondary" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-4 neon-glow">
              <Radar className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic neon-text">Mission Tracking</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Monitor your armory deployment in real-time</p>
          </div>

          <Card className="glass border-primary/20 overflow-hidden shadow-2xl">
            <CardHeader className="bg-muted/30 border-b border-primary/10">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-center">Enter Transmission ID</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-1712345678"
                    className="bg-background/50 h-14 pl-12 text-lg font-mono border-primary/20 focus:border-primary uppercase"
                  />
                </div>
                <Button 
                  disabled={isSearching}
                  className="h-14 px-8 bg-primary text-primary-foreground font-black uppercase text-sm tracking-widest"
                >
                  {isSearching ? 'Scanning...' : 'Locate Order'}
                </Button>
              </form>
              {error && <p className="text-destructive text-xs font-bold uppercase mt-4 text-center">{error}</p>}
            </CardContent>
          </Card>

          {foundOrder && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-card border-primary/30 overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                <div className="bg-muted/50 p-6 border-b border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      {getStatusIcon(foundOrder.status)}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-muted-foreground">Current Status</div>
                      <div className="text-2xl font-black uppercase italic text-primary">{foundOrder.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase text-muted-foreground">Mission ID</div>
                    <div className="font-mono text-sm">{foundOrder.id}</div>
                  </div>
                </div>
                
                <CardContent className="p-8 space-y-10">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Deployment Progress</div>
                    <div className="relative h-2 bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-primary shadow-[0_0_10px_rgba(0,255,136,0.5)] transition-all duration-1000"
                        style={{ width: foundOrder.status === 'completed' ? '100%' : foundOrder.status === 'ready' ? '75%' : foundOrder.status === 'processing' ? '50%' : '25%' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Intel Log</div>
                      <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-primary/20">
                        {[...(foundOrder.timeline || [])].reverse().map((event, i) => (
                          <div key={i} className="relative pl-8">
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background z-10 ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                              <div className="w-2 h-2 rounded-full bg-current" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="text-[11px] font-black uppercase tracking-tighter text-foreground">{event.status}</div>
                                <div className="text-[8px] text-muted-foreground uppercase">{new Date(event.timestamp).toLocaleString()}</div>
                              </div>
                              <div className="text-[12px] text-muted-foreground italic bg-primary/5 p-3 rounded-md border-l-2 border-primary/40 leading-relaxed">
                                "{event.note}"
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Manifest Assets</div>
                      <div className="space-y-2">
                        {foundOrder.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5 group hover:border-primary/20 transition-colors">
                            <span className="text-xs font-bold uppercase">{item.name}</span>
                            <span className="text-xs text-primary font-black">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                        <div className="text-[10px] font-black uppercase text-primary">Summary</div>
                        <div className="flex justify-between items-end">
                          <span className="text-[9px] text-muted-foreground uppercase">Settlement Total</span>
                          <span className="text-xl font-black text-primary">{settings.currencySymbol}{foundOrder.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-secondary/5 border-t border-secondary/20 p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-secondary" />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold leading-tight">
                        Need tactical support for this mission? Contact command on WhatsApp.
                      </p>
                    </div>
                    <Button asChild variant="secondary" className="bg-secondary text-secondary-foreground font-black uppercase h-10 px-6">
                      <a href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '')}?text=Hi! I'm tracking my mission ${foundOrder.id} and I have a question.`} target="_blank">
                        Open Comms
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {!foundOrder && !isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
              {[
                { icon: Clock, title: 'Check Status', text: 'Real-time updates on your order progress.' },
                { icon: ShieldAlert, title: 'Secure Tracking', text: 'Only verified mission IDs can access logs.' },
                { icon: Gamepad2, title: 'Instant Comms', text: 'Direct link to command support for any help.' },
              ].map((feature, i) => (
                <div key={i} className="text-center space-y-3 p-6 rounded-xl border border-white/5 bg-card/30">
                  <feature.icon className="w-6 h-6 text-primary mx-auto" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">{feature.title}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <Link href="/products" className="text-primary hover:underline font-black uppercase tracking-widest flex items-center justify-center gap-2">
            Return to Armory <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
