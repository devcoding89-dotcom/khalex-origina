
"use client";

import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, settings } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-24 h-24 rounded-full bg-card border border-primary/20 flex items-center justify-center mb-6 neon-glow">
            <ShoppingBag className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase mb-2 italic tracking-tighter">Armory is Empty</h1>
          <p className="text-muted-foreground mb-8 uppercase font-bold tracking-widest">No equipment detected in current session.</p>
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground font-black uppercase px-12 h-14 text-xl">
              Equip Gear
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
          <div className="flex justify-between items-end mb-12">
            <h1 className="text-6xl font-black uppercase tracking-tighter italic neon-text">Your Loadout</h1>
            <Button variant="ghost" onClick={clearCart} className="text-destructive hover:bg-destructive/10 uppercase font-black tracking-widest text-xs">
              Purge Manifest
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden glass border-primary/10 hover:border-primary/40 transition-all">
                  <div className="flex p-4 gap-6">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-white/5">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline font-bold text-xl uppercase italic">{item.name}</h3>
                          <p className="text-[10px] text-primary uppercase font-black tracking-widest">{item.category}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-background/50 border border-white/10 rounded-lg p-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-10 text-center font-black">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-2xl font-black text-primary italic tracking-tighter">{settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-primary/30 shadow-2xl shadow-primary/5 sticky top-24 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
                <CardHeader>
                  <h2 className="text-2xl font-black uppercase tracking-widest italic">Mission Summary</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-muted-foreground text-sm uppercase">
                      <span>Subtotal</span>
                      <span>{settings.currencySymbol}{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-secondary text-sm uppercase italic">
                      <span>Delivery (Dropship)</span>
                      <span>FREE</span>
                    </div>
                    <div className="h-px bg-primary/20 my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black uppercase italic">Total Loadout</span>
                      <span className="text-4xl font-black text-primary tracking-tighter italic neon-text">{settings.currencySymbol}{subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3 items-start">
                    <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold">
                      All assets are verified. Manual verification required for CoD accounts (approx 15 mins).
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    asChild
                    className="w-full h-16 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-wider text-xl group"
                  >
                    <Link href="/checkout">
                      Execute Checkout <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Link href="/products" className="block text-center text-sm font-black uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">
                Continue Scoping Armory
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
