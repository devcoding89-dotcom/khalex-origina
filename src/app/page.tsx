
"use client";

import { Navigation } from '@/components/Navigation';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Gamepad2, MapPin, Radar, ShieldCheck, Zap, Play } from 'lucide-react';

export default function Home() {
  const { products, settings } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);
  const videoProduct = products.find(p => p.videoUrl) || products[0];

  const categories = [
    { label: 'Phones', value: 'phones', icon: '📱' },
    { label: 'Laptops', value: 'laptops', icon: '💻' },
    { label: 'Gadgets', value: 'gadgets', icon: '🎮' },
    { label: 'CoD Accounts', value: 'cod', icon: '🎯' },
    { label: 'CP Top-up', value: 'cp', icon: '💎' },
  ];

  const storeNameParts = settings.storeName.split(' ');
  const firstName = storeNameParts[0] || 'KHALEX';
  const otherNames = storeNameParts.slice(1).join(' ') || 'hub';

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient relative py-20 md:py-28 flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-4">
            <span className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">
              {firstName} <span className="text-primary neon-text">{otherNames}</span>
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tighter uppercase italic">
            Level Up Your <span className="text-primary neon-text">Gaming</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto font-medium uppercase tracking-wide">
            Premium gaming phones, laptops, CoD accounts & CP top-up services. 
            The ultimate armory for professional gamers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-lg group rounded-full w-full sm:w-auto">
                Shop Armory <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/track-order">
              <Button size="lg" variant="outline" className="h-14 px-10 border-primary/20 hover:border-primary text-foreground font-black uppercase text-lg rounded-full w-full sm:w-auto gap-2">
                <Radar className="w-5 h-5 text-primary" /> Track Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-card/20 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'Verified Assets', text: '100% Security' },
              { icon: Zap, title: 'Instant Delivery', text: 'Fast Digital Drops' },
              { icon: Radar, title: 'Live Tracking', text: 'Monitor Orders' },
              { icon: Gamepad2, title: 'Pro Grade', text: 'Elite Gaming Gear' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1">
                <badge.icon className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest">{badge.title}</h4>
                  <p className="text-[7px] text-muted-foreground uppercase font-bold">{badge.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-black text-center mb-12 uppercase tracking-widest italic">Asset Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.value} 
                href={`/products?category=${cat.value}`}
                className="glass rounded-xl p-6 flex flex-col items-center justify-center transition-all hover:border-primary group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="text-sm font-black uppercase text-center">{cat.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gear Video Section */}
      {videoProduct && (
        <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
              poster={videoProduct.imageUrl}
            >
              <source src={videoProduct.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-gaming-setup-with-neon-lights-4240-large.mp4'} type="video/mp4" />
            </video>
          </div>
          
          <div className="container mx-auto px-4 relative z-20 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Play className="w-3 h-3 fill-current" /> Tactical Briefing
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Featured <span className="text-secondary neon-text">Gear</span>
            </h2>
            <div className="max-w-xl mx-auto">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-2">{videoProduct.name}</h3>
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest italic">{videoProduct.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/products/${videoProduct.id}`}>
                <Button size="lg" className="h-14 px-10 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black uppercase text-lg rounded-none">
                  Equip Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-1">Featured Intel</h2>
              <div className="h-1 w-16 bg-primary" />
            </div>
            <Link href="/products" className="text-primary hover:underline font-black uppercase tracking-widest text-xs flex items-center gap-2">
              All Gear <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center opacity-50 italic text-sm">Decrypting armory data...</div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="glass p-10 rounded-2xl text-center border-primary/20 space-y-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
             <h2 className="text-2xl font-black uppercase italic tracking-tighter">Join the Elite Squad</h2>
             <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Get first access to mythic account drops and exclusive gear offers</p>
             <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
               <input 
                 placeholder="ENTER ENCRYPTED EMAIL" 
                 className="flex-1 bg-background h-12 rounded-full px-6 border border-primary/20 focus:border-primary text-[10px] font-black uppercase tracking-widest outline-none"
               />
               <Button className="h-12 px-8 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-full text-xs">Subscribe</Button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-card border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="text-lg font-headline font-black tracking-tighter italic uppercase">
                {firstName} <span className="text-primary neon-text">{otherNames}</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Premium gaming marketplace for elite assets.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Mission Support</h4>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <p className="uppercase font-bold tracking-widest">WhatsApp: {settings.whatsapp}</p>
              <p className="uppercase font-bold tracking-widest">Email: {settings.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Base Location</h4>
            <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary" />
              <p className="uppercase font-bold tracking-widest leading-relaxed">
                {settings.address}
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          <p>© {new Date().getFullYear()} {settings.storeName}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/track-order" className="hover:text-primary transition-colors">Track Mission</Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors border-l pl-6 border-white/10">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
