
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore, Product, Category } from '@/lib/store';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Sparkles, X, PlusCircle, MinusCircle, ImageIcon } from 'lucide-react';
import { generateProductDescription } from '@/ai/flows/generate-product-description-flow';
import { useToast } from '@/hooks/use-toast';

function ProductsManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, addProduct, updateProduct, deleteProduct, settings } = useStore();
  const { toast } = useToast();
  
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [specRows, setSpecRows] = useState<{ key: string, value: string }[]>([]);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      startNewProduct();
    }
  }, [searchParams]);

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

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Equipment Inventory</h1>
          <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Manage your gaming assets</p>
        </div>
        {!editingProduct && (
          <Button onClick={startNewProduct} className="bg-primary text-primary-foreground font-black uppercase tracking-widest px-8">
            <Plus className="w-4 h-4 mr-2" /> Recruit Asset
          </Button>
        )}
      </div>

      {editingProduct ? (
        <Card className="bg-card border-primary/20 max-w-5xl mx-auto shadow-2xl">
          <CardHeader className="flex flex-row justify-between items-center border-b border-primary/10">
            <CardTitle className="uppercase font-black tracking-widest text-primary italic">Asset Configuration</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <Label className="uppercase font-black text-[10px] tracking-widest">Asset Visual</Label>
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-primary/20 bg-muted/20 flex items-center justify-center group">
                    {editingProduct.imageUrl ? (
                      <img src={editingProduct.imageUrl} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-40" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <p className="text-[10px] font-black uppercase text-white">Update URL Below</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[8px] tracking-widest text-muted-foreground">Image URL</Label>
                    <Input 
                      value={editingProduct.imageUrl} 
                      onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="bg-background border-primary/10 text-xs h-9"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="uppercase font-black text-[10px] tracking-widest">Asset Name</Label>
                        <Input 
                          required 
                          value={editingProduct.name} 
                          onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                          className="bg-background border-primary/20 h-10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="uppercase font-black text-[10px] tracking-widest">Category</Label>
                          <Select 
                            value={editingProduct.category} 
                            onValueChange={(val: Category) => setEditingProduct({...editingProduct, category: val})}
                          >
                            <SelectTrigger className="bg-background h-10 border-primary/20">
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
                            <SelectTrigger className="bg-background h-10 border-primary/20">
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
                          <Label className="uppercase font-black text-[10px] tracking-widest">Price ({settings.currencySymbol})</Label>
                          <Input 
                            type="number" required 
                            value={editingProduct.price} 
                            onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                            className="bg-background border-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="uppercase font-black text-[10px] tracking-widest">Stock Units</Label>
                          <Input 
                            type="number" 
                            value={editingProduct.stock || ''} 
                            onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                            className="bg-background border-primary/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="uppercase font-black text-[10px] tracking-widest">Technical Specifications</Label>
                          <Button type="button" variant="ghost" size="sm" onClick={addSpecRow} className="h-6 text-[10px] uppercase font-black text-primary">
                            <PlusCircle className="w-3 h-3 mr-1" /> Add Spec
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                          {specRows.map((row, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <Input placeholder="Key" value={row.key} onChange={e => updateSpecRow(i, 'key', e.target.value)} className="h-8 text-xs border-primary/10" />
                              <Input placeholder="Value" value={row.value} onChange={e => updateSpecRow(i, 'value', e.target.value)} className="h-8 text-xs border-primary/10" />
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(i)} className="h-8 w-8 text-destructive">
                                <MinusCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
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
                          rows={3} value={editingProduct.description} 
                          onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                          className="bg-background border-primary/10 resize-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-primary/10">
                <Button type="button" variant="ghost" onClick={() => setEditingProduct(null)} className="uppercase font-black text-[10px]">Abort</Button>
                <Button type="submit" className="bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest px-12 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                  Verify & Store Intelligence
                </Button>
              </div>
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
                    <h3 className="font-bold text-lg italic uppercase">{p.name}</h3>
                    <div className="text-xl font-black text-primary">{settings.currencySymbol}{p.price.toLocaleString()}</div>
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
    </AdminLayout>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse">SYNCHRONIZING ARMORY...</div>}>
      <ProductsManagementContent />
    </Suspense>
  );
}
