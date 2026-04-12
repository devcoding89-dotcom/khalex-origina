
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product, useStore } from '@/lib/store';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, settings } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Loadout Updated",
      description: `${product.name} is now in your armory.`,
    });
  };

  return (
    <Card className="overflow-hidden group bg-card border-primary/10 hover:border-primary transition-all duration-500 hover:-translate-y-2 neon-glow relative">
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <Button variant="secondary" className="bg-primary text-primary-foreground font-black uppercase pointer-events-none">
             <Eye className="w-4 h-4 mr-2" /> View Intel
           </Button>
        </div>
        
        {product.oldPrice && (
          <Badge className="absolute top-3 right-3 bg-destructive text-white font-black uppercase tracking-tighter">Sale</Badge>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-black font-black uppercase tracking-tighter">Low Intel</Badge>
        )}
        {product.stock <= 0 && (
          <Badge className="absolute inset-0 m-auto h-fit w-fit bg-black/80 text-destructive border border-destructive font-black uppercase tracking-widest px-4 py-2 rotate-[-12deg] text-xl z-20">Mission Sold Out</Badge>
        )}
      </Link>
      
      <CardHeader className="p-4 pb-1">
        <div className="text-[10px] uppercase text-primary font-black tracking-widest mb-1">{product.category}</div>
        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-headline font-bold text-lg line-clamp-1 italic tracking-tighter">{product.name}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4 py-2">
        <p className="text-xs text-muted-foreground line-clamp-2 h-8 mb-3 italic">
          {product.description}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-primary italic tracking-tighter">{settings.currencySymbol}{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-sm line-through text-muted-foreground font-bold">{settings.currencySymbol}{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-xs group-hover:neon-glow"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Loadout
        </Button>
      </CardFooter>
    </Card>
  );
}
