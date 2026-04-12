
"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, createOrder } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    codUid: '',
    codIgn: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const hasDigitalOrService = cart.some(item => item.category === 'cp' || item.category === 'cod');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    const order = createOrder({
      customerName: formData.name,
      whatsapp: formData.whatsapp,
      email: formData.email,
      codUid: formData.codUid,
      codIgn: formData.codIgn,
    });
    
    // Create WhatsApp message
    const message = `ORDER CONFIRMATION%0A` +
      `ID: ${order.id}%0A` +
      `Customer: ${order.customerName}%0A` +
      `Items:%0A` + 
      order.items.map(i => `- ${i.name} x${i.quantity}`).join('%0A') + 
      `%0A%0ATotal: $${order.total}%0A%0APlease provide payment details.`;

    const waLink = `https://wa.me/1234567890?text=${message}`;
    
    setTimeout(() => {
      setIsSuccess(true);
      setIsProcessing(false);
      window.open(waLink, '_blank');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Mission Accomplished</h1>
          <p className="text-muted-foreground text-lg uppercase font-bold tracking-widest">Order transmission sent. Redirecting to WhatsApp for final extraction.</p>
          <Button onClick={() => router.push('/')} className="w-full h-14 bg-primary text-primary-foreground font-black uppercase text-xl">Return to Base</Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-black uppercase mb-4">No Intel to Process</h1>
          <Button onClick={() => router.push('/products')} className="bg-primary text-primary-foreground">Back to Armory</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Checkout</h1>
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Modify Loadout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-8">
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="uppercase font-black text-xl tracking-widest">Personnel Data</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] tracking-widest text-primary">Callsign (Full Name)</Label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background h-12" placeholder="Ghost Riley" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] tracking-widest text-primary">Comms Channel (WhatsApp)</Label>
                    <Input required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="bg-background h-12" placeholder="+123 456 7890" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="uppercase font-black text-[10px] tracking-widest text-primary">Encrypted Email (Optional)</Label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background h-12" placeholder="ghost@taskforce141.com" />
                  </div>
                </CardContent>
              </Card>

              {hasDigitalOrService && (
                <Card className="glass border-secondary/20">
                  <CardHeader>
                    <CardTitle className="uppercase font-black text-xl tracking-widest text-secondary">Asset Credentials (COD Mobile)</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="uppercase font-black text-[10px] tracking-widest text-secondary">Player UID</Label>
                      <Input required value={formData.codUid} onChange={e => setFormData({...formData, codUid: e.target.value})} className="bg-background h-12" placeholder="67123456789..." />
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase font-black text-[10px] tracking-widest text-secondary">In-Game Name (IGN)</Label>
                      <Input required value={formData.codIgn} onChange={e => setFormData({...formData, codIgn: e.target.value})} className="bg-background h-12" placeholder="Ghost_141" />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase italic md:col-span-2">Required for CP top-ups and account transfers. Ensure data is accurate.</p>
                  </CardContent>
                </Card>
              )}

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="uppercase font-black text-xl tracking-widest">Payment Extraction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <div>
                      <div className="font-bold">WHATSAPP SETTLEMENT</div>
                      <div className="text-xs text-muted-foreground">Complete payment manually after redirect. We support Card, Crypto, and Bank Transfer.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card border-primary/30 neon-glow sticky top-24">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-center font-black uppercase italic text-2xl tracking-tighter">Manifest Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-y-auto px-6 py-4 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative rounded overflow-hidden border">
                          <Image src={item.imageUrl} alt="" fill className="object-cover" />
                        </div>
                        <div className="text-xs">
                          <div className="font-bold line-clamp-1">{item.name}</div>
                          <div className="text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-black text-primary">${item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex-col p-6 pt-0 border-t border-primary/10 mt-4">
                <div className="w-full py-4 space-y-2">
                  <div className="flex justify-between text-muted-foreground text-sm font-bold uppercase">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-secondary text-sm font-black uppercase italic">
                    <span>Tax / Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-black uppercase">Total Due</span>
                    <span className="text-4xl font-black text-primary italic tracking-tighter">${subtotal}</span>
                  </div>
                </div>
                <Button 
                  form="checkout-form"
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full h-16 bg-primary text-primary-foreground font-black uppercase text-xl group hover:shadow-[0_0_30px_rgba(0,255,136,0.6)]"
                >
                  {isProcessing ? 'Transmitting...' : 'Execute Order'}
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground uppercase font-black">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Encrypted Transaction Secure
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
