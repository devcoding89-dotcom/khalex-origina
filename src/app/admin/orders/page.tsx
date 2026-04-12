
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, Order } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Search, ExternalLink, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { orders, updateOrderStatus } = useStore();
  const [isAuth, setIsAuth] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('gz_admin_auth');
    if (auth !== 'true') router.push('/admin/login');
    else setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.whatsapp.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r bg-card flex flex-col shrink-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="font-headline font-black tracking-tighter text-xl">COMMAND</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10">
              <Package className="w-4 h-4" /> Inventory
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="secondary" className="w-full justify-start gap-3 bg-primary/10 text-primary border-none">
              <ShoppingBag className="w-4 h-4" /> Orders
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={() => { localStorage.removeItem('gz_admin_auth'); router.push('/admin/login'); }}>
            <LogOut className="w-4 h-4" /> Power Off
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Incoming Missions</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Order command center</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                className="w-full bg-card border border-primary/20 rounded-md h-10 pl-10 pr-4 text-sm focus:outline-none focus:border-primary" 
                placeholder="Search manifest..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-card border-primary/20">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="glass border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/30 border-b">
                <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <th className="px-6 py-4">Manifest ID</th>
                  <th className="px-6 py-4">Target (Customer)</th>
                  <th className="px-6 py-4">Asset Summary</th>
                  <th className="px-6 py-4">Total Value</th>
                  <th className="px-6 py-4">Mission Status</th>
                  <th className="px-6 py-4">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">No order data found in current parameters.</td>
                  </tr>
                )}
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs">{order.id}</div>
                      <div className="text-[8px] text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{order.customerName}</div>
                      <div className="text-xs text-primary font-bold">{order.whatsapp}</div>
                      {order.codUid && <div className="text-[8px] uppercase text-secondary font-black">UID: {order.codUid}</div>}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-xs line-clamp-2">
                        {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-primary text-lg">${order.total}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {order.status === 'pending' && <Badge className="bg-yellow-500/20 text-yellow-500 border-none gap-1"><Clock className="w-3 h-3" /> PENDING</Badge>}
                        {order.status === 'completed' && <Badge className="bg-primary/20 text-primary border-none gap-1"><CheckCircle2 className="w-3 h-3" /> COMPLETED</Badge>}
                        {order.status === 'cancelled' && <Badge className="bg-destructive/20 text-destructive border-none gap-1"><XCircle className="w-3 h-3" /> CANCELLED</Badge>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/20" onClick={() => updateOrderStatus(order.id, 'completed')} title="Complete Mission">
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/20" onClick={() => updateOrderStatus(order.id, 'cancelled')} title="Cancel Mission">
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-secondary hover:bg-secondary/20" asChild>
                          <a href={`https://wa.me/${order.whatsapp}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
