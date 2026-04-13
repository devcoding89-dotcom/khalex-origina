
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
    
    setTimeout(() => {
      const order = orders.find(o => 
        o.id.toLowerCase() === orderId.toLowerCase() || 
        o.displayId.toLowerCase() === orderId.toLowerCase()
      );
      
      if (order) {
        setFoundOrder(order);
      } else {
        setError('Order not found. Please check your Order ID.');
        setFoundOrder(null);
      }
      setIsSearching(false);
    }, 800);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      default: return <Radar className="w-5 h-5 text-secondary" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-2 neon-glow">
              <Radar className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic neon-text">Track Your Order</h1>
            <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Check the status of your purchase</p>
          </div>

          <Card className="glass border-primary/20 overflow-hidden shadow-2xl">
            <CardHeader className="bg-muted/30 border-b border-primary/10 py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-center">Enter Order ID</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-123456"
                    className="bg-background/50 h-12 pl-10 text-base font-mono border-primary/20 focus:border-primary uppercase"
                  />
                </div>
                <Button 
                  disabled={isSearching}
                  className="h-12 px-6 bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest"
                >
                  {isSearching ? 'Checking...' : 'Track Now'}
                </Button>
              </form>
              {error && <p className="text-destructive text-[10px] font-bold uppercase mt-3 text-center">{error}</p>}
            </CardContent>
          </Card>

          {foundOrder && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Card className="bg-card border-primary/30 overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                <div className="bg-muted/50 p-5 border-b border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      {getStatusIcon(foundOrder.status)}
                    </div>
                    <div>
                      <div className="text-[8px] font-black uppercase text-muted-foreground">Status</div>
                      <div className="text-xl font-black uppercase italic text-primary">{foundOrder.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-black uppercase text-muted-foreground">Order ID</div>
                    <div className="font-mono text-xs">{foundOrder.id}</div>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-8">
                  <div className="space-y-3">
                    <div className="text-[8px] font-black uppercase tracking-widest text-primary">Progress</div>
                    <div className="relative h-1.5 bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-primary shadow-[0_0_5px_rgba(0,255,136,0.5)] transition-all duration-1000"
                        style={{ width: foundOrder.status === 'completed' ? '100%' : foundOrder.status === 'ready' ? '75%' : foundOrder.status === 'processing' ? '50%' : '25%' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="text-[8px] font-black uppercase tracking-widest text-primary border-b border-primary/10 pb-1">Updates</div>
                      <div className="space-y-6 relative before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-px before:bg-primary/20">
                        {[...(foundOrder.timeline || [])].reverse().map((event, i) => (
                          <div key={i} className="relative pl-7">
                            <div className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background z-10 ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="text-[10px] font-black uppercase tracking-tighter text-foreground">{event.status}</div>
                                <div className="text-[7px] text-muted-foreground uppercase">{new Date(event.timestamp).toLocaleDateString()}</div>
                              </div>
                              <div className="text-[10px] text-muted-foreground italic bg-primary/5 p-2 rounded-md border-l-2 border-primary/40 leading-relaxed">
                                "{event.note}"
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-[8px] font-black uppercase tracking-widest text-primary border-b border-primary/10 pb-1">Items Bought</div>
                      <div className="space-y-2">
                        {foundOrder.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-primary/20 transition-colors">
                            <span className="text-[10px] font-bold uppercase">{item.name}</span>
                            <span className="text-[10px] text-primary font-black">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 space-y-1">
                        <div className="text-[8px] font-black uppercase text-primary">Summary</div>
                        <div className="flex justify-between items-end">
                          <span className="text-[8px] text-muted-foreground uppercase">Total Paid</span>
                          <span className="text-lg font-black text-primary">{settings.currencySymbol}{foundOrder.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-secondary/5 border-t border-secondary/20 p-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-secondary" />
                      <p className="text-[8px] text-muted-foreground uppercase font-bold leading-tight">
                        Need help with this order? Message us on WhatsApp.
                      </p>
                    </div>
                    <Button asChild variant="secondary" className="bg-secondary text-secondary-foreground font-black uppercase h-9 px-5 text-[10px]">
                      <a href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '')}?text=Hi! I have a question about my order ${foundOrder.id}.`} target="_blank">
                        Message Us
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {!foundOrder && !isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-70">
              {[
                { icon: Clock, title: 'Check Status', text: 'See your order updates in real-time.' },
                { icon: ShieldAlert, title: 'Safe & Private', text: 'Your order details are secure with us.' },
                { icon: Gamepad2, title: 'Live Support', text: 'Chat with us anytime on WhatsApp.' },
              ].map((feature, i) => (
                <div key={i} className="text-center space-y-2 p-4 rounded-xl border border-white/5 bg-card/30">
                  <feature.icon className="w-5 h-5 text-primary mx-auto" />
                  <h3 className="text-[8px] font-black uppercase tracking-widest">{feature.title}</h3>
                  <p className="text-[8px] text-muted-foreground uppercase leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 border-t border-white/5 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <Link href="/products" className="text-primary hover:underline font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
            Back to Shop <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
