
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product, useStore } from '@/lib/store';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden group bg-card hover:border-primary transition-all duration-300">
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.oldPrice && (
          <Badge className="absolute top-2 right-2 bg-destructive uppercase font-bold">Sale</Badge>
        )}
        {product.isDigital && (
          <Badge className="absolute top-2 left-2 bg-secondary uppercase font-bold">Digital</Badge>
        )}
      </Link>
      <CardHeader className="p-4 pb-0">
        <div className="text-xs uppercase text-muted-foreground font-bold tracking-widest">{product.category}</div>
        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-headline font-bold text-lg line-clamp-1">{product.name}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          {product.oldPrice && (
            <span className="text-sm line-through text-muted-foreground">${product.oldPrice}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </CardFooter>
    </Card>
  );
}
