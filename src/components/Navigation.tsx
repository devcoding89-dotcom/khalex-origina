
"use client";

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShoppingCart, Gamepad2, UserCircle, Menu, X, Search, Radar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const { cart, settings, products } = useStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const links = [
    { label: 'Phones', href: '/products?category=phones' },
    { label: 'Laptops', href: '/products?category=laptops' },
    { label: 'Gadgets', href: '/products?category=gadgets' },
    { label: 'CoD Accounts', href: '/products?category=cod' },
    { label: 'CP Top-up', href: '/products?category=cp' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const storeNameParts = settings.storeName.split(' ');
  const firstName = storeNameParts[0] || 'KHALEX';
  const otherNames = storeNameParts.slice(1).join(' ') || 'hub';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:rotate-12 transition-transform drop-shadow-[0_0_12px_rgba(0,255,136,0.5)]" />
          <span className="text-xl sm:text-2xl font-headline font-black tracking-tighter italic block">
            {firstName}<span className="text-primary neon-text">{otherNames}</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
          {links.map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="hover:text-primary transition-colors relative group py-2"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link href="/track-order" className="text-secondary hover:text-secondary/80 flex items-center gap-1">
            <Radar className="w-3 h-3" /> Track Mission
          </Link>
        </div>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-card border border-primary/30 rounded-full px-4 h-10 w-[200px] sm:w-[300px] animate-in slide-in-from-right-4 duration-300">
                <input 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Armory..."
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-5 h-5" />
              </Button>
            )}
          </div>

          <Link href="/cart">
            <Button variant="ghost" className="relative h-12 px-2 sm:px-6 rounded-full border border-white/5 hover:border-primary group bg-white/5">
              <ShoppingCart className="w-5 h-5 sm:mr-2" />
              <span className="font-black text-xs uppercase tracking-widest mr-2 hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 rounded-full font-black">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link href="/admin/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="rounded-full hover:text-primary border border-transparent hover:border-primary/20">
              <UserCircle className="w-6 h-6" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-b border-primary/20 p-8 space-y-6 flex flex-col items-center font-black uppercase tracking-widest text-lg">
          {links.map(link => (
            <Link key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/track-order" className="text-secondary flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <Radar className="w-5 h-5" /> Track Mission
          </Link>
          <Link href="/admin/login" onClick={() => setIsMenuOpen(false)}>Admin Access</Link>
        </div>
      )}
    </nav>
  );
}
