
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
      title: "Added to Cart",
      description: `${product.name} is in your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden group bg-card border-primary/10 hover:border-primary transition-all duration-500 hover:-translate-y-1 neon-glow relative">
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <Button variant="secondary" className="h-8 bg-primary text-primary-foreground font-black uppercase text-[8px] pointer-events-none">
             <Eye className="w-2.5 h-2.5 mr-1.5" /> View Details
           </Button>
        </div>
        
        {product.oldPrice && (
          <Badge className="absolute top-2 right-2 bg-destructive text-white text-[7px] font-black uppercase tracking-tighter">Sale</Badge>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black text-[7px] font-black uppercase tracking-tighter">Low Stock</Badge>
        )}
      </Link>
      
      <CardHeader className="p-2 pb-0.5">
        <div className="text-[7px] uppercase text-primary font-black tracking-widest mb-0.5">{product.category}</div>
        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-headline font-bold text-xs line-clamp-1 italic tracking-tighter">{product.name}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-2 py-0.5">
        <p className="text-[8px] text-muted-foreground line-clamp-2 h-5 mb-2 italic">
          {product.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-primary italic tracking-tighter">{settings.currencySymbol}{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-[8px] line-through text-muted-foreground font-bold">{settings.currencySymbol}{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 pt-0 mt-2">
        <Button 
          className="w-full h-8 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-[8px]"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
