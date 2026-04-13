
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
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, createOrder, settings } = useStore();
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
    
    const message = `ORDER CONFIRMATION%0A` +
      `Order ID: ${order.id}%0A` +
      `Customer: ${order.customerName}%0A` +
      `Items:%0A` + 
      order.items.map(i => `- ${i.name} x${i.quantity}`).join('%0A') + 
      `%0A%0ATotal: ${settings.currencySymbol}${order.total.toLocaleString()}%0A%0AHello, I just placed an order. Please send me payment details.`;

    const waLink = `https://wa.me/${settings.whatsapp.replace(/\+/g, '')}?text=${message}`;
    
    setTimeout(() => {
      setIsSuccess(true);
      setIsProcessing(false);
      window.open(waLink, '_blank');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">Order Placed!</h1>
          <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Your order has been sent. We are redirecting you to WhatsApp to complete your payment.</p>
          <Button onClick={() => router.push('/')} className="w-full h-12 bg-primary text-primary-foreground font-black uppercase text-base">Go Home</Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-black uppercase mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push('/products')} className="bg-primary text-primary-foreground uppercase text-[10px] font-black h-10 px-6">Go to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-10 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Checkout</h1>
          <Button variant="ghost" onClick={() => router.back()} className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-3 h-3 mr-2" /> Edit Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
              <Card className="glass border-primary/20">
                <CardHeader className="py-4">
                  <CardTitle className="uppercase font-black text-lg tracking-widest">Your Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                  <div className="space-y-1">
                    <Label className="uppercase font-black text-[8px] tracking-widest text-primary">Full Name</Label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background h-10 text-xs" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-1">
                    <Label className="uppercase font-black text-[8px] tracking-widest text-primary">WhatsApp Number</Label>
                    <Input required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="bg-background h-10 text-xs" placeholder="e.g. 08012345678" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="uppercase font-black text-[8px] tracking-widest text-primary">Email (Optional)</Label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background h-10 text-xs" placeholder="you@example.com" />
                  </div>
                </CardContent>
              </Card>

              {hasDigitalOrService && (
                <Card className="glass border-secondary/20">
                  <CardHeader className="py-4">
                    <CardTitle className="uppercase font-black text-lg tracking-widest text-secondary">Game Details (COD Mobile)</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                    <div className="space-y-1">
                      <Label className="uppercase font-black text-[8px] tracking-widest text-secondary">Player UID</Label>
                      <Input required value={formData.codUid} onChange={e => setFormData({...formData, codUid: e.target.value})} className="bg-background h-10 text-xs" placeholder="Enter your UID" />
                    </div>
                    <div className="space-y-1">
                      <Label className="uppercase font-black text-[8px] tracking-widest text-secondary">In-Game Name (IGN)</Label>
                      <Input required value={formData.codIgn} onChange={e => setFormData({...formData, codIgn: e.target.value})} className="bg-background h-10 text-xs" placeholder="Enter your game name" />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="glass border-white/10">
                <CardHeader className="py-4">
                  <CardTitle className="uppercase font-black text-lg tracking-widest">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-bold text-xs uppercase">WhatsApp Payment</div>
                      <div className="text-[8px] text-muted-foreground uppercase">You will be sent a message to complete your payment.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-primary/30 neon-glow sticky top-24">
              <CardHeader className="border-b border-primary/10 py-4">
                <CardTitle className="text-center font-black uppercase italic text-xl tracking-tighter">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[250px] overflow-y-auto px-6 py-4 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 relative rounded overflow-hidden border">
                          <Image src={item.imageUrl} alt="" fill className="object-cover" />
                        </div>
                        <div className="text-[10px]">
                          <div className="font-bold line-clamp-1">{item.name}</div>
                          <div className="text-muted-foreground uppercase text-[8px]">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-black text-primary text-xs">{settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex-col p-6 pt-0 border-t border-primary/10 mt-2">
                <div className="w-full py-4 space-y-2">
                  <div className="flex justify-between text-muted-foreground text-[10px] font-bold uppercase">
                    <span>Subtotal</span>
                    <span>{settings.currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-secondary text-[10px] font-black uppercase italic">
                    <span>Tax</span>
                    <span>{settings.currencySymbol}0</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-base font-black uppercase">Total Due</span>
                    <span className="text-3xl font-black text-primary italic tracking-tighter">{settings.currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  form="checkout-form"
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full h-12 bg-primary text-primary-foreground font-black uppercase text-base group hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
