
"use client";

import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, MessageSquare, Star } from 'lucide-react';

export default function Home() {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url(https://picsum.photos/seed/hero/1920/1080)' }}
          data-ai-hint="gaming background"
        />
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <Badge className="bg-secondary text-secondary-foreground mb-4 uppercase tracking-[0.2em] px-4 py-1">Level Up Your Game</Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
              UNLEASH THE <span className="text-primary italic">POWER</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-medium">
              Premium gaming phones, beastly laptops, and legendary CoD accounts. 
              The ultimate armory for every professional gamer.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-lg group">
                  Enter The Armory <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 font-black uppercase text-lg border-primary text-primary hover:bg-primary/10">
                View Accounts
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Featured Gear</h2>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <Link href="/products" className="text-primary hover:underline font-bold uppercase tracking-wider flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-transparent hover:border-primary transition-colors">
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Trading</h3>
              <p className="text-sm text-muted-foreground">Every account and item is hand-verified for your safety.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-transparent hover:border-primary transition-colors">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
              <p className="text-sm text-muted-foreground">CP Top-ups delivered within 10 minutes, guaranteed.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-transparent hover:border-primary transition-colors">
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Direct Support</h3>
              <p className="text-sm text-muted-foreground">Talk to us directly on WhatsApp for any assistance.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-transparent hover:border-primary transition-colors">
              <Star className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Top Ranks</h3>
              <p className="text-sm text-muted-foreground">Premium Legendary accounts with ultra-rare skins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="text-lg font-headline font-black tracking-tighter">
                GAME<span className="text-primary">ZONE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">© 2024 GameZone Marketplace. Powered by Gamers.</p>
          </div>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary">Instagram</Link>
            <Link href="#" className="hover:text-primary">Discord</Link>
            <Link href="#" className="hover:text-primary">Twitter</Link>
            <Link href="/admin/login" className="hover:text-primary">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}

import { Gamepad2 } from 'lucide-react';
