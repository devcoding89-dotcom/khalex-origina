
"use client";

import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cart, removeFromCart, createOrder } = useStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', whatsapp: '' });
  const [isOrdering, setIsOrdering] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsOrdering(true);
    const order = createOrder(formData.name, formData.whatsapp);
    
    // Create WhatsApp message
    const message = `Hi! I'd like to place an order at GameZone Marketplace.%0A%0A` +
      `Order ID: ${order.id}%0A` +
      `Customer: ${order.customerName}%0A%0A` +
      `Items:%0A` + 
      order.items.map(i => `- ${i.name} x${i.quantity} ($${i.price * i.quantity})`).join('%0A') + 
      `%0A%0ATotal: $${order.total}%0A%0APlease let me know how to pay.`;

    // WhatsApp link (simulated store number)
    const waLink = `https://wa.me/1234567890?text=${message}`;
    
    toast({
      title: "Order Placed!",
      description: "Redirecting you to WhatsApp for payment...",
    });

    setTimeout(() => {
      window.open(waLink, '_blank');
      setIsOrdering(false);
    }, 1500);
  };

  if (cart.length === 0 && !isOrdering) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-black uppercase mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Grab some legendary gear before it's gone!</p>
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground font-black uppercase px-8">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12 bg-card/10">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">Your Haul</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden bg-card border-transparent hover:border-primary/50 transition-colors">
                  <div className="flex p-4 gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-xs text-muted-foreground uppercase font-black">{item.category}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm font-bold">
                          <span>Qty: {item.quantity}</span>
                          <span className="text-primary">${item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-primary/20 shadow-xl shadow-primary/5">
                <CardHeader>
                  <h2 className="text-xl font-black uppercase tracking-widest">Order Summary</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Handling</span>
                    <span className="text-secondary font-bold uppercase text-xs">FREE</span>
                  </div>
                  <div className="h-px bg-border my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold uppercase">Total</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">${subtotal}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <form onSubmit={handleOrder} className="w-full space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs uppercase font-black tracking-widest">Your Name</Label>
                      <Input 
                        id="name" 
                        required 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="MasterChief" 
                        className="bg-background border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-xs uppercase font-black tracking-widest">WhatsApp Number</Label>
                      <Input 
                        id="whatsapp" 
                        required 
                        value={formData.whatsapp} 
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+1 234 567 890" 
                        className="bg-background border-primary/20 focus:border-primary"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black uppercase tracking-wider text-lg"
                      disabled={isOrdering}
                    >
                      {isOrdering ? 'Processing...' : 'Finish On WhatsApp'}
                      {!isOrdering && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </form>
                  <p className="text-[10px] text-center text-muted-foreground uppercase font-medium">
                    Payment instructions will be sent on WhatsApp
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
