
"use client";

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShoppingCart, Gamepad2, UserCircle, Menu, X, Search, Radar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const { cart, settings } = useStore();
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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0 min-w-fit">
          <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:rotate-12 transition-transform drop-shadow-[0_0_10px_rgba(0,255,136,0.4)]" />
          <span className="text-lg sm:text-xl font-headline font-black tracking-tighter italic whitespace-nowrap">
            {firstName} <span className="text-primary neon-text">{otherNames}</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.2em]">
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
            <Radar className="w-3 h-3" /> Track
          </Link>
        </div>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-card border border-primary/30 rounded-full px-4 h-9 w-[180px] sm:w-[250px] animate-in slide-in-from-right-4 duration-300">
                <input 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none focus:ring-0 text-[10px] font-bold w-full uppercase"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Link href="/cart">
            <Button variant="ghost" className="relative h-10 px-2 sm:px-4 rounded-full border border-white/5 hover:border-primary group bg-white/5">
              <ShoppingCart className="w-4 h-4 sm:mr-2" />
              <span className="font-black text-[10px] uppercase tracking-widest mr-1 hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-[8px] w-4 h-4 flex items-center justify-center p-0 rounded-full font-black">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link href="/admin/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary border border-transparent hover:border-primary/20">
              <UserCircle className="w-5 h-5" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-b border-primary/20 p-6 space-y-4 flex flex-col items-center font-black uppercase tracking-widest text-sm">
          {links.map(link => (
            <Link key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/track-order" className="text-secondary flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <Radar className="w-4 h-4" /> Track Mission
          </Link>
          <Link href="/admin/login" onClick={() => setIsMenuOpen(false)}>Admin Access</Link>
        </div>
      )}
    </nav>
  );
}
