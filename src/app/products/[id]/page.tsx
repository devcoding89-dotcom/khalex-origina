
"use client";

import { use, useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useStore, Product } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, MessageCircle, ArrowLeft, ShieldCheck, Zap, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, addToCart } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const p = products.find(p => p.id === id);
    if (p) setProduct(p);
  }, [id, products]);

  if (!product) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse">
      DECRYPTING INTEL...
    </div>
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Armory Updated",
      description: `${quantity}x ${product.name} added to your loadout.`,
    });
  };

  const waLink = `https://wa.me/1234567890?text=Hi! I'm interested in ${product.name} ($${product.price}). Is it available?`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 container mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 hover:text-primary gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Armory
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/20 bg-card group">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {product.oldPrice && (
                <Badge className="absolute top-6 right-6 bg-destructive text-destructive-foreground font-black px-4 py-1 uppercase scale-125">
                  Save ${product.oldPrice - product.price}
                </Badge>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary uppercase font-black tracking-widest px-3">
                {product.category}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 neon-text leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl font-black text-primary tracking-tighter">${product.price}</span>
              {product.oldPrice && (
                <span className="text-2xl line-through text-muted-foreground">${product.oldPrice}</span>
              )}
            </div>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed border-l-4 border-primary/30 pl-6 italic">
              {product.description}
            </p>

            {product.specs && (
              <div className="grid grid-cols-2 gap-4 mb-10">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-card p-4 rounded-lg border border-primary/10">
                    <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">{key}</div>
                    <div className="font-bold text-sm text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center bg-card border border-primary/20 rounded-lg p-1">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-primary">
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="text-primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleAddToCart} 
                className="flex-1 h-14 bg-primary text-primary-foreground font-black uppercase text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-3" /> 
                {product.stock > 0 ? 'Add to Loadout' : 'Out of Stock'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="glass border-primary/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-sm">SECURE TRADE</div>
                    <div className="text-[10px] text-muted-foreground uppercase">100% Verified Asset</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass border-secondary/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <Zap className="w-8 h-8 text-secondary" />
                  <div>
                    <div className="font-bold text-sm">INSTANT DROP</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Digital Delivery</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-secondary/10 rounded-xl border border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <div className="font-black text-secondary uppercase">Mission Support</div>
                <div className="text-xs text-muted-foreground">Talk to a commander on WhatsApp</div>
              </div>
              <Button asChild variant="secondary" className="bg-secondary text-secondary-foreground font-black uppercase">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Live Contact
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
