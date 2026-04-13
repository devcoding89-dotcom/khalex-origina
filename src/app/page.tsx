
"use client";

import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, MapPin, Search, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const { products, settings } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);

  const categories = [
    { label: 'Phones', value: 'phones', icon: '📱' },
    { label: 'Laptops', value: 'laptops', icon: '💻' },
    { label: 'Gadgets', value: 'gadgets', icon: '🎮' },
    { label: 'Accounts', value: 'cod', icon: '🎯' },
    { label: 'Top-up', value: 'cp', icon: '💎' },
  ];

  const storeNameParts = settings.storeName.split(' ');
  const firstName = storeNameParts[0] || 'KHALEX';
  const otherNames = storeNameParts.slice(1).join(' ') || 'hub';

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient relative py-16 md:py-24 flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-3">
            <span className="text-base md:text-lg font-black uppercase tracking-tight italic">
              {firstName} <span className="text-primary neon-text">{otherNames}</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight tracking-tighter uppercase italic">
            Level up your <span className="text-primary neon-text">Game</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mb-8 max-w-lg mx-auto font-medium uppercase tracking-wide">
            Phones, laptops, gaming accounts and top-up services. 
            High-quality gear for every gamer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="h-10 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-xs group rounded-full w-full sm:w-auto">
                Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/track-order">
              <Button size="lg" variant="outline" className="h-10 px-8 border-primary/20 hover:border-primary text-foreground font-black uppercase text-xs rounded-full w-full sm:w-auto gap-2">
                <Search className="w-4 h-4 text-primary" /> Track Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-card/20 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'Safe Payment', text: '100% Protected' },
              { icon: Zap, title: 'Fast Delivery', text: 'Quick Shipping' },
              { icon: Search, title: 'Order Tracking', text: 'Check Your Status' },
              { icon: ShoppingCart, title: 'Top Quality', text: 'Premium Gear' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1">
                <badge.icon className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="text-[8px] font-black uppercase tracking-widest">{badge.title}</h4>
                  <p className="text-[7px] text-muted-foreground uppercase font-bold">{badge.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-black text-center mb-8 uppercase tracking-widest italic">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.value} 
                href={`/products?category=${cat.value}`}
                className="glass rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-primary group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="text-[10px] font-black uppercase text-center">{cat.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase mb-1">Featured Items</h2>
              <div className="h-1 w-12 bg-primary" />
            </div>
            <Link href="/products" className="text-primary hover:underline font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center opacity-50 italic text-[10px] uppercase tracking-widest">No featured items yet...</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-card border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-headline font-black tracking-tighter italic uppercase">
                {firstName} <span className="text-primary neon-text">{otherNames}</span>
              </span>
            </Link>
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
              Premium marketplace for gaming gear.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-primary">Support</h4>
            <div className="flex flex-col gap-1 text-[9px] text-muted-foreground">
              <p className="uppercase font-bold tracking-widest">WhatsApp: {settings.whatsapp}</p>
              <p className="uppercase font-bold tracking-widest">Email: {settings.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-primary">Location</h4>
            <div className="flex items-center gap-2 justify-center md:justify-start text-[9px] text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary" />
              <p className="uppercase font-bold tracking-widest leading-relaxed">
                {settings.address}
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors border-l pl-4 border-white/10">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
