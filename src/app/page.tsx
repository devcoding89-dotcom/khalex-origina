
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
            <span className="text-lg md:text-xl font-black uppercase tracking-tight italic">
              {firstName} <span className="text-primary neon-text">{otherNames}</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tighter uppercase italic">
            Level up your <span className="text-primary neon-text">Game</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-lg mx-auto font-medium uppercase tracking-wide">
            Phones, laptops, accounts and top-up services. 
            High-quality gear for every gamer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-sm group rounded-full w-full sm:w-auto">
                Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/track-order">
              <Button size="lg" variant="outline" className="h-12 px-8 border-primary/20 hover:border-primary text-foreground font-black uppercase text-sm rounded-full w-full sm:w-auto gap-2">
                <Radar className="w-4 h-4 text-primary" /> Track Order
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
              { icon: ShieldCheck, title: 'Safe Payments', text: '100% Protection' },
              { icon: Zap, title: 'Fast Delivery', text: 'Quick Shipping' },
              { icon: Radar, title: 'Live Tracking', text: 'Check Your Order' },
              { icon: Gamepad2, title: 'Top Quality', text: 'Premium Products' },
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
          <h2 className="text-xl font-black text-center mb-8 uppercase tracking-widest italic">Our Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.value} 
                href={`/products?category=${cat.value}`}
                className="glass rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-primary group"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="text-xs font-black uppercase text-center">{cat.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      {videoProduct && (
        <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
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
          
          <div className="container mx-auto px-4 relative z-20 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-[8px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Play className="w-2.5 h-2.5 fill-current" /> Featured Item
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              Top <span className="text-secondary neon-text">Products</span>
            </h2>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-1">{videoProduct.name}</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">{videoProduct.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/products/${videoProduct.id}`}>
                <Button size="lg" className="h-12 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black uppercase text-sm rounded-none">
                  Buy Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Featured Gear</h2>
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
              <div className="col-span-full py-20 text-center opacity-50 italic text-xs uppercase tracking-widest">Loading products...</div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="glass p-8 rounded-2xl text-center border-primary/20 space-y-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
             <h2 className="text-xl font-black uppercase italic tracking-tighter">Join the Hub</h2>
             <p className="text-muted-foreground uppercase text-[8px] tracking-widest font-bold">Get updates on new products and special offers</p>
             <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
               <input 
                 placeholder="Enter your email" 
                 className="flex-1 bg-background h-10 rounded-full px-5 border border-primary/20 focus:border-primary text-[10px] font-black uppercase tracking-widest outline-none"
               />
               <Button className="h-10 px-6 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-full text-[10px]">Subscribe</Button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-card border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start">
              <Gamepad2 className="w-5 h-5 text-primary" />
              <span className="text-base font-headline font-black tracking-tighter italic uppercase">
                {firstName} <span className="text-primary neon-text">{otherNames}</span>
              </span>
            </Link>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              Premium marketplace for gaming gear.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-primary">Support</h4>
            <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
              <p className="uppercase font-bold tracking-widest">WhatsApp: {settings.whatsapp}</p>
              <p className="uppercase font-bold tracking-widest">Email: {settings.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-primary">Location</h4>
            <div className="flex items-center gap-2 justify-center md:justify-start text-[10px] text-muted-foreground">
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
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors border-l pl-4 border-white/10">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
