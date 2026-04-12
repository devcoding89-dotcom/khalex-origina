
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore, Product, Category } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, Trash2, Edit, Sparkles, X, LayoutDashboard } from 'lucide-react';
import { generateProductDescription } from '@/ai/flows/generate-product-description-flow';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function ProductsManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  
  const [isAuth, setIsAuth] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('gz_admin_auth');
    if (auth !== 'true') router.push('/admin/login');
    else setIsAuth(true);

    if (searchParams.get('new') === 'true') {
      setEditingProduct({
        id: `p-${Date.now()}`,
        name: '',
        category: 'phones',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: 'https://picsum.photos/seed/new/600/400',
      });
    }
  }, [router, searchParams]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const fullProduct = editingProduct as Product;
    const exists = products.find(p => p.id === fullProduct.id);
    
    if (exists) updateProduct(fullProduct);
    else addProduct(fullProduct);
    
    toast({ title: "Asset Updated", description: `${fullProduct.name} saved successfully.` });
    setEditingProduct(null);
    router.replace('/admin/products');
  };

  const generateAI = async () => {
    if (!editingProduct?.name || !editingProduct?.category) {
      toast({ title: "Intelligence Error", description: "Name and Category are required for AI generation.", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        productName: editingProduct.name,
        category: editingProduct.category,
        keyFeatures: ['Pro Performance', 'Gaming Design', 'Limited Edition'],
      });
      setEditingProduct({ ...editingProduct, description: result.description });
      toast({ title: "AI Generation Complete", description: "Product description refined." });
    } catch (error) {
      toast({ title: "AI Offline", description: "Could not generate description.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Minimal */}
      <aside className="w-16 md:w-64 border-r bg-card flex flex-col items-center md:items-stretch py-6 shrink-0">
        <div className="px-4 mb-8">
           <Link href="/admin/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="hidden md:inline font-headline font-black tracking-tighter text-xl">COMMAND</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-2 px-2">
           <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary">
              <LayoutDashboard className="w-4 h-4" /> <span className="hidden md:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="secondary" className="w-full justify-start gap-3 bg-primary/10 text-primary">
              <Package className="w-4 h-4" /> <span className="hidden md:inline">Inventory</span>
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Armory Manifest</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Equipment management</p>
          </div>
          {!editingProduct && (
            <Button onClick={() => setEditingProduct({ id: `p-${Date.now()}`, name: '', category: 'phones', description: '', price: 0, stock: 0, imageUrl: 'https://picsum.photos/seed/new/600/400' })} className="bg-primary text-primary-foreground font-black uppercase">
              <Plus className="w-4 h-4 mr-2" /> New Asset
            </Button>
          )}
        </div>

        {editingProduct ? (
          <Card className="bg-card border-primary/20 max-w-2xl mx-auto">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="uppercase font-black tracking-widest">Asset Parameters</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label className="uppercase font-black text-[10px] tracking-widest">Asset Name</Label>
                    <Input 
                      required 
                      value={editingProduct.name} 
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label className="uppercase font-black text-[10px] tracking-widest">Category</Label>
                    <Select 
                      value={editingProduct.category} 
                      onValueChange={(val: Category) => setEditingProduct({...editingProduct, category: val})}
                    >
                      <SelectTrigger className="bg-background uppercase font-bold text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phones">Phones</SelectItem>
                        <SelectItem value="laptops">Laptops</SelectItem>
                        <SelectItem value="gadgets">Gadgets</SelectItem>
                        <SelectItem value="cod">Accounts</SelectItem>
                        <SelectItem value="cp">Top-ups</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="uppercase font-black text-[10px] tracking-widest">Intel (Description)</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-secondary hover:bg-secondary/10 hover:text-secondary uppercase font-black text-[10px]"
                      onClick={generateAI}
                      disabled={isGenerating}
                    >
                      <Sparkles className="w-3 h-3 mr-1" /> {isGenerating ? 'Analyzing...' : 'AI Enhance'}
                    </Button>
                  </div>
                  <Textarea 
                    rows={4} 
                    value={editingProduct.description} 
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="bg-background resize-none"
                    placeholder="Enter detailed intel on this asset..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] tracking-widest">Credit Cost ($)</Label>
                    <Input 
                      type="number" 
                      required 
                      value={editingProduct.price} 
                      onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] tracking-widest">Inventory Units</Label>
                    <Input 
                      type="number" 
                      required 
                      value={editingProduct.stock} 
                      onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                      className="bg-background"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-secondary text-secondary-foreground font-black uppercase h-12">
                  Verify & Store Asset
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((p) => (
              <Card key={p.id} className="bg-card border-primary/10 hover:border-primary/40 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded shrink-0 relative overflow-hidden border">
                    <img src={p.imageUrl} className="object-cover w-full h-full" alt="" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{p.name}</h3>
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded uppercase font-black">{p.category}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">${p.price} • {p.stock} in stock</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingProduct(p)}>
                      <Edit className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div>Loading Intelligence...</div>}>
      <ProductsManagementContent />
    </Suspense>
  );
}
