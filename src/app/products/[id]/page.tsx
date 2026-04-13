
"use client";

import { use, useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useStore, Product } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, MessageCircle, ArrowLeft, ShieldCheck, Zap, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, addToCart, settings } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const p = products.find(p => p.id === id);
    if (p) setProduct(p);
  }, [id, products]);

  if (!product) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse text-xs uppercase tracking-widest">
      Loading...
    </div>
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Cart Updated",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const waLink = `https://wa.me/${settings.whatsapp.replace(/\+/g, '')}?text=Hi! I want to buy ${product.name} (${settings.currencySymbol}${product.price.toLocaleString()}). Is it available?`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-10 container mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:text-primary gap-2 text-[10px] font-black uppercase">
          <ArrowLeft className="w-3 h-3" /> Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/20 bg-card group">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {product.oldPrice && (
                <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground font-black px-3 py-1 uppercase text-[10px]">
                  Save {settings.currencySymbol}{(product.oldPrice - product.price).toLocaleString()}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary uppercase font-black tracking-widest px-2 py-0.5 text-[8px]">
                {product.category}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 neon-text leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black text-primary tracking-tighter">{settings.currencySymbol}{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-lg line-through text-muted-foreground">{settings.currencySymbol}{product.oldPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="text-base text-muted-foreground mb-8 leading-relaxed border-l-2 border-primary/30 pl-4 italic">
              {product.description}
            </p>

            {product.specs && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-card p-3 rounded-lg border border-primary/10">
                    <div className="text-[8px] uppercase font-black text-muted-foreground tracking-widest mb-1">{key}</div>
                    <div className="font-bold text-xs text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex items-center bg-card border border-primary/20 rounded-lg p-1">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-primary h-8 w-8">
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-10 text-center font-black text-sm">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="text-primary h-8 w-8">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <Button 
                onClick={handleAddToCart} 
                className="flex-1 h-12 bg-primary text-primary-foreground font-black uppercase text-sm hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> 
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="glass border-primary/20">
                <CardContent className="p-3 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-bold text-[10px] uppercase">Secure Trade</div>
                    <div className="text-[7px] text-muted-foreground uppercase">100% Verified</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass border-secondary/20">
                <CardContent className="p-3 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-secondary" />
                  <div>
                    <div className="font-bold text-[10px] uppercase">Fast Delivery</div>
                    <div className="text-[7px] text-muted-foreground uppercase">Quick Processing</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-5 bg-secondary/10 rounded-xl border border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-center md:text-left">
                <div className="font-black text-secondary uppercase text-xs">Customer Support</div>
                <div className="text-[8px] text-muted-foreground uppercase">Contact us on WhatsApp</div>
              </div>
              <Button asChild variant="secondary" className="bg-secondary text-secondary-foreground font-black uppercase text-[10px] h-9">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Message Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
