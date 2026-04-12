
"use client";

import { Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import { useStore, Category } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ProductsContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') as Category | null;
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredProducts = products.filter(p => {
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery) ||
      Object.values(p.specs || {}).some(spec => spec.toLowerCase().includes(searchQuery));
    
    return matchesCategory && matchesSearch;
  });

  const categories: { label: string; value: Category | 'all' }[] = [
    { label: 'All Gear', value: 'all' },
    { label: 'Phones', value: 'phones' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Gadgets', value: 'gadgets' },
    { label: 'Accounts', value: 'cod' },
    { label: 'Top-ups', value: 'cp' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 bg-card/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
                {searchQuery ? `SEARCH: "${searchQuery}"` : categoryFilter ? categoryFilter.toUpperCase() : 'THE ARMORY'}
              </h1>
              <div className="h-1 w-24 bg-primary" />
              {searchQuery && (
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                  Showing {filteredProducts.length} results for your radar sweep
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat.value} href={cat.value === 'all' ? '/products' : `/products?category=${cat.value}`}>
                  <Button 
                    variant={categoryFilter === cat.value || (!categoryFilter && cat.value === 'all') ? 'default' : 'outline'}
                    className={`uppercase font-bold tracking-wider ${
                      categoryFilter === cat.value || (!categoryFilter && cat.value === 'all') 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border-primary/20 hover:border-primary text-foreground'
                    }`}
                  >
                    {cat.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card rounded-xl border border-dashed border-primary/20">
              <h3 className="text-2xl font-bold mb-2 uppercase">No items found in this section</h3>
              <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest">Adjust your search parameters or check a different category.</p>
              <Button asChild variant="link" className="text-primary uppercase mt-4 font-black">
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse">LOADING ARMORY...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
