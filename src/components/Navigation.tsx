
"use client";

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShoppingCart, Gamepad2, UserCircle, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

export function Navigation() {
  const { cart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
          <span className="text-2xl font-headline font-black tracking-tighter text-foreground italic">
            GAME<span className="text-primary neon-text">ZONE</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest">
          <Link href="/products?category=phones" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Phones</Link>
          <Link href="/products?category=laptops" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Laptops</Link>
          <Link href="/products?category=gadgets" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Gadgets</Link>
          <Link href="/products?category=cod" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Accounts</Link>
          <Link href="/products?category=cp" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">CP Top-up</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-primary group">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 rounded-full font-black border-2 border-background">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="ghost" size="icon" className="hover:text-primary">
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
        <div className="lg:hidden bg-card border-b border-primary/20 p-4 space-y-4 flex flex-col items-center font-black uppercase tracking-widest text-sm">
          <Link href="/products?category=phones" onClick={() => setIsMenuOpen(false)}>Phones</Link>
          <Link href="/products?category=laptops" onClick={() => setIsMenuOpen(false)}>Laptops</Link>
          <Link href="/products?category=gadgets" onClick={() => setIsMenuOpen(false)}>Gadgets</Link>
          <Link href="/products?category=cod" onClick={() => setIsMenuOpen(false)}>Accounts</Link>
          <Link href="/products?category=cp" onClick={() => setIsMenuOpen(false)}>CP Top-up</Link>
        </div>
      )}
    </nav>
  );
}
