
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
import { Checkbox } from '@/components/ui/checkbox';
import { Package, Plus, Trash2, Edit, Sparkles, X, LayoutDashboard, PlusCircle, MinusCircle } from 'lucide-react';
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
  const [specRows, setSpecRows] = useState<{ key: string, value: string }[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('gz_admin_auth');
    if (auth !== 'true') router.push('/admin/login');
    else setIsAuth(true);

    if (searchParams.get('new') === 'true') {
      startNewProduct();
    }
  }, [router, searchParams]);

  const startNewProduct = () => {
    setEditingProduct({
      id: `p-${Date.now()}`,
      name: '',
      category: 'phones',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: 'https://picsum.photos/seed/new/600/400',
      type: 'physical',
      status: 'active',
      isFeatured: false,
      specs: {}
    });
    setSpecRows([]);
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    const rows = Object.entries(p.specs || {}).map(([key, value]) => ({ key, value }));
    setSpecRows(rows.length > 0 ? rows : []);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Convert spec rows back to object
    const finalSpecs: Record<string, string> = {};
    specRows.forEach(row => {
      if (row.key.trim()) finalSpecs[row.key] = row.value;
    });

    const fullProduct = {
      ...editingProduct,
      specs: finalSpecs
    } as Product;

    const exists = products.find(p => p.id === fullProduct.id);
    
    if (exists) updateProduct(fullProduct);
    else addProduct(fullProduct);
    
    toast({ title: "Armory Synchronized", description: `${fullProduct.name} has been archived.` });
    setEditingProduct(null);
    router.replace('/admin/products');
  };

  const addSpecRow = () => setSpecRows([...specRows, { key: '', value: '' }]);
  const removeSpecRow = (index: number) => setSpecRows(specRows.filter((_, i) => i !== index));
  const updateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
    const newRows = [...specRows];
    newRows[index][field] = val;
    setSpecRows(newRows);
  };

  const generateAI = async () => {
    if (!editingProduct?.name || !editingProduct?.category) {
      toast({ title: "Incomplete Intel", description: "Name and Category are required for AI analysis.", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        productName: editingProduct.name,
        category: editingProduct.category,
        keyFeatures: specRows.map(r => r.key + ': ' + r.value).concat(['Elite Gaming Grade']),
      });
      setEditingProduct({ ...editingProduct, description: result.description });
      toast({ title: "AI Uplink Successful", description: "Product intelligence generated." });
    } catch (error) {
      toast({ title: "AI Jammed", description: "Could not establish secure AI uplink.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r bg-card flex flex-col shrink-0">
        <div className="p-6 border-b">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="font-headline font-black tracking-tighter text-xl">COMMAND</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="secondary" className="w-full justify-start gap-3 bg-primary/10 text-primary border-none">
              <Package className="w-4 h-4" /> Armory
            </Button>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Equipment Inventory</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Manage your gaming assets</p>
          </div>
          {!editingProduct && (
            <Button onClick={startNewProduct} className="bg-primary text-primary-foreground font-black uppercase tracking-widest px-8">
              <Plus className="w-4 h-4 mr-2" /> Recruit Asset
            </Button>
          )}
        </div>

        {editingProduct ? (
          <Card className="bg-card border-primary/20 max-w-4xl mx-auto shadow-2xl">
            <CardHeader className="flex flex-row justify-between items-center border-b border-primary/10">
              <CardTitle className="uppercase font-black tracking-widest text-primary italic">Asset Configuration</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="uppercase font-black text-[10px] tracking-widest">Asset Name</Label>
                      <Input 
                        required 
                        value={editingProduct.name} 
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        className="bg-background border-primary/20 h-12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="uppercase font-black text-[10px] tracking-widest">Category</Label>
                        <Select 
                          value={editingProduct.category} 
                          onValueChange={(val: Category) => setEditingProduct({...editingProduct, category: val})}
                        >
                          <SelectTrigger className="bg-background h-12 border-primary/20">
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
                      <div className="space-y-2">
                        <Label className="uppercase font-black text-[10px] tracking-widest">Type</Label>
                        <Select 
                          value={editingProduct.type} 
                          onValueChange={(val: any) => setEditingProduct({...editingProduct, type: val})}
                        >
                          <SelectTrigger className="bg-background h-12 border-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Physical</SelectItem>
                            <SelectItem value="digital">Digital</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="uppercase font-black text-[10px] tracking-widest">Price ($)</Label>
                        <Input 
                          type="number" required 
                          value={editingProduct.price} 
                          onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                          className="bg-background border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="uppercase font-black text-[10px] tracking-widest">Old Price ($)</Label>
                        <Input 
                          type="number" 
                          value={editingProduct.oldPrice || ''} 
                          onChange={e => setEditingProduct({...editingProduct, oldPrice: Number(e.target.value)})}
                          className="bg-background border-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="uppercase font-black text-[10px] tracking-widest">Technical Specifications</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={addSpecRow} className="h-6 text-[10px] uppercase font-black text-primary">
                          <PlusCircle className="w-3 h-3 mr-1" /> Add Spec
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {specRows.map((row, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <Input placeholder="Key" value={row.key} onChange={e => updateSpecRow(i, 'key', e.target.value)} className="h-8 text-xs border-primary/10" />
                            <Input placeholder="Value" value={row.value} onChange={e => updateSpecRow(i, 'value', e.target.value)} className="h-8 text-xs border-primary/10" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(i)} className="h-8 w-8 text-destructive">
                              <MinusCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {specRows.length === 0 && <p className="text-[10px] text-muted-foreground uppercase italic text-center py-4">No specifications defined</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="uppercase font-black text-[10px] tracking-widest">Intel Analysis</Label>
                        <Button type="button" variant="ghost" size="sm" className="h-6 text-secondary font-black text-[10px]" onClick={generateAI} disabled={isGenerating}>
                          <Sparkles className="w-3 h-3 mr-1" /> {isGenerating ? 'Decrypting...' : 'AI Enhance'}
                        </Button>
                      </div>
                      <Textarea 
                        rows={4} value={editingProduct.description} 
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                        className="bg-background border-primary/10 resize-none text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-8 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="featured" checked={editingProduct.isFeatured} onCheckedChange={checked => setEditingProduct({...editingProduct, isFeatured: !!checked})} />
                        <label htmlFor="featured" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Featured Asset</label>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                         <Label className="uppercase font-black text-[10px] tracking-widest whitespace-nowrap">Status:</Label>
                         <Select value={editingProduct.status} onValueChange={(val: any) => setEditingProduct({...editingProduct, status: val})}>
                           <SelectTrigger className="h-8 text-[10px] border-primary/10 bg-background uppercase font-black">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="active">Active Service</SelectItem>
                             <SelectItem value="sold-out">Mission Complete</SelectItem>
                           </SelectContent>
                         </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 bg-primary text-primary-foreground font-black uppercase text-lg tracking-widest hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                  Verify & Store Intelligence
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => (
              <Card key={p.id} className="bg-card border-primary/10 group hover:border-primary/40 transition-all">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={p.imageUrl} alt="" className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-[10px] font-black uppercase">{p.category}</div>
                    <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-black uppercase ${p.status === 'active' ? 'bg-secondary text-secondary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                      {p.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <div className="text-xl font-black text-primary">${p.price}</div>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mb-6 h-8 italic">{p.description}</div>
                    <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                      <div className="text-[10px] font-black uppercase tracking-widest">Inventory: <span className={p.stock <= 3 ? 'text-destructive' : 'text-primary'}>{p.stock}</span></div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/20" onClick={() => startEditProduct(p)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/20" onClick={() => deleteProduct(p.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse">SYNCHRONIZING ARMORY...</div>}>
      <ProductsManagementContent />
    </Suspense>
  );
}
