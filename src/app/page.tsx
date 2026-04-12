
"use client";

import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Gamepad2 } from 'lucide-react';

export default function Home() {
  const { products } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);

  const categories = [
    { label: 'Phones', value: 'phones', icon: '📱' },
    { label: 'Laptops', value: 'laptops', icon: '💻' },
    { label: 'Gadgets', value: 'gadgets', icon: '🎮' },
    { label: 'CoD Accounts', value: 'cod', icon: '🎯' },
    { label: 'CP Top-up', value: 'cp', icon: '💎' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient relative py-24 md:py-32 flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
            Level Up Your <span className="text-primary neon-text italic">Gaming</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
            Premium gaming phones, laptops, CoD accounts & CP top-up services. 
            The ultimate armory for professional gamers.
          </p>
          <Link href="/products">
            <Button size="lg" className="h-16 px-12 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-xl group rounded-full">
              Shop Now <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 uppercase tracking-widest italic">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.value} 
                href={`/products?category=${cat.value}`}
                className="glass rounded-2xl p-8 flex flex-col items-center justify-center transition-all hover:border-primary group"
              >
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="text-lg font-black uppercase text-center">{cat.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-2">Featured Intel</h2>
              <div className="h-1.5 w-24 bg-primary" />
            </div>
            <Link href="/products" className="text-primary hover:underline font-black uppercase tracking-widest flex items-center gap-2">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center opacity-50 italic">Decrypting armory data...</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-card border-t border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-headline font-black tracking-tighter">
                GAME<span className="text-primary">ZONE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
              Contact: WhatsApp +1 (234) 567-890
            </p>
          </div>
          <div className="flex gap-8 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors border-l pl-8 border-white/10">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
