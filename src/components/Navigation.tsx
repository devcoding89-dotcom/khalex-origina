
"use client";

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShoppingCart, Gamepad2, UserCircle, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

export function Navigation() {
  const { cart, settings } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const links = [
    { label: 'Phones', href: '/products?category=phones' },
    { label: 'Laptops', href: '/products?category=laptops' },
    { label: 'Gadgets', href: '/products?category=gadgets' },
    { label: 'CoD Accounts', href: '/products?category=cod' },
    { label: 'CP Top-up', href: '/products?category=cp' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform drop-shadow-[0_0_12px_rgba(0,255,136,0.5)]" />
          <span className="text-2xl font-headline font-black tracking-tighter italic">
            {settings.storeName.split(' ')[0]}<span className="text-primary neon-text">{settings.storeName.split(' ').slice(1).join(' ')}</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
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
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart">
            <Button variant="ghost" className="relative h-12 px-6 rounded-full border border-white/5 hover:border-primary group bg-white/5">
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="font-black text-xs uppercase tracking-widest mr-2 hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 rounded-full font-black">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/admin/login">
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
        </div>
      )}
    </nav>
  );
}
