
"use client";

import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Gamepad2, MapPin, Radar, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const { products, settings } = useStore();
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
            <Zap className="w-3 h-3" /> New Legendary Accounts Restocked
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
            Level Up Your <span className="text-primary neon-text italic">Gaming</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
            Premium gaming phones, laptops, CoD accounts & CP top-up services. 
            The ultimate armory for professional gamers at {settings.storeName}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="h-16 px-12 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-xl group rounded-full w-full sm:w-auto">
                Shop Now <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/track-order">
              <Button size="lg" variant="outline" className="h-16 px-12 border-primary/20 hover:border-primary text-foreground font-black uppercase text-xl rounded-full w-full sm:w-auto gap-2">
                <Radar className="w-6 h-6 text-primary" /> Track Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-card/20 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Verified Assets', text: '100% Security Guarantee' },
              { icon: Zap, title: 'Instant Delivery', text: 'Fast Digital Drops' },
              { icon: Radar, title: 'Live Tracking', text: 'Monitor Every Order' },
              { icon: Gamepad2, title: 'Pro Grade', text: 'Elite Gaming Gear' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <badge.icon className="w-8 h-8 text-primary" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">{badge.title}</h4>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">{badge.text}</p>
                </div>
              </div>
            ))}
          </div>
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

      {/* Newsletter */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass p-12 rounded-3xl text-center border-primary/20 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">Join the Elite Squad</h2>
             <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Get first access to mythic account drops and exclusive gear offers</p>
             <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
               <input 
                 placeholder="ENTER ENCRYPTED EMAIL" 
                 className="flex-1 bg-background h-14 rounded-full px-8 border border-primary/20 focus:border-primary text-xs font-black uppercase tracking-widest outline-none"
               />
               <Button className="h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-full">Subscribe</Button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-card border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-headline font-black tracking-tighter uppercase">
                {settings.storeName.split(' ')[0]}<span className="text-primary">{settings.storeName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
              Premium gaming marketplace for elite assets.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Mission Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p className="uppercase font-bold tracking-widest">WhatsApp: {settings.whatsapp}</p>
              <p className="uppercase font-bold tracking-widest">Email: {settings.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Base Location</h4>
            <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="uppercase font-bold tracking-widest leading-relaxed">
                {settings.address}
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          <p>© {new Date().getFullYear()} {settings.storeName}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/track-order" className="hover:text-primary transition-colors">Track Mission</Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors border-l pl-8 border-white/10">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
