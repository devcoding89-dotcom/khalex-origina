
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
      title: "Armory Updated",
      description: `${product.name} equipped.`,
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
           <Button variant="secondary" className="h-9 bg-primary text-primary-foreground font-black uppercase text-[10px] pointer-events-none">
             <Eye className="w-3 h-3 mr-2" /> View Intel
           </Button>
        </div>
        
        {product.oldPrice && (
          <Badge className="absolute top-2 right-2 bg-destructive text-white text-[8px] font-black uppercase tracking-tighter">Sale</Badge>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black text-[8px] font-black uppercase tracking-tighter">Low Intel</Badge>
        )}
      </Link>
      
      <CardHeader className="p-3 pb-1">
        <div className="text-[9px] uppercase text-primary font-black tracking-widest mb-0.5">{product.category}</div>
        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-headline font-bold text-sm line-clamp-1 italic tracking-tighter">{product.name}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-3 py-1">
        <p className="text-[10px] text-muted-foreground line-clamp-2 h-6 mb-2 italic">
          {product.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-primary italic tracking-tighter">{settings.currencySymbol}{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-[10px] line-through text-muted-foreground font-bold">{settings.currencySymbol}{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 mt-2">
        <Button 
          className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-[9px]"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="w-3 h-3 mr-1.5" /> Equip
        </Button>
      </CardFooter>
    </Card>
  );
}
