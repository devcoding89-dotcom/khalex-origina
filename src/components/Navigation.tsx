
"use client";

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShoppingCart, Gamepad2, UserCircle, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function Navigation() {
  const { cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-headline font-black tracking-tighter text-foreground">
            GAME<span className="text-primary">ZONE</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-wider">
          <Link href="/products?category=phones" className="hover:text-primary transition-colors">Phones</Link>
          <Link href="/products?category=laptops" className="hover:text-primary transition-colors">Laptops</Link>
          <Link href="/products?category=cod" className="hover:text-primary transition-colors">Accounts</Link>
          <Link href="/products?category=cp" className="hover:text-primary transition-colors">CP Top-up</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-primary">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <UserCircle className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
