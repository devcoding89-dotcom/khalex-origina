
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { products, orders, updateOrderStatus } = useStore();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('gz_admin_auth');
    if (auth !== 'true') router.push('/admin/login');
    else setIsAuth(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('gz_admin_auth');
    router.push('/admin/login');
  };

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.stock <= 3).length;

  if (!isAuth) return null;

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
            <Button variant="secondary" className="w-full justify-start gap-3 bg-primary/10 text-primary border-none">
              <TrendingUp className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary">
              <Package className="w-4 h-4" /> Inventory
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary">
              <ShoppingBag className="w-4 h-4" /> Orders
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary">
            <Settings className="w-4 h-4" /> Settings
          </Button>
        </nav>
        <div className="p-4 mt-auto border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Power Off
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Mission Intelligence</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Base of operations</p>
          </div>
          <Link href="/admin/products?new=true">
            <Button className="bg-secondary text-secondary-foreground font-black uppercase tracking-widest h-12">
              <Plus className="w-5 h-5 mr-2" /> Add Asset
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Revenue</p>
              <CardTitle className="text-3xl font-black tracking-tighter">${totalSales.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Active Orders</p>
              <CardTitle className="text-3xl font-black tracking-tighter text-primary">{pendingOrders}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Low Stock Alert</p>
              <CardTitle className="text-3xl font-black tracking-tighter text-destructive">{lowStock}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Items Sold</p>
              <CardTitle className="text-3xl font-black tracking-tighter text-secondary">{orders.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Incoming Transmissions
          </h2>
          <Card className="bg-card border-primary/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="px-6 py-4">Serial ID</th>
                    <th className="px-6 py-4">Target</th>
                    <th className="px-6 py-4">Loot Value</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">No orders detected in current session.</td>
                    </tr>
                  )}
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.whatsapp}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">${order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'completed' ? 'bg-secondary/20 text-secondary' : 
                          order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-secondary hover:bg-secondary/20" onClick={() => updateOrderStatus(order.id, 'completed')}>
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/20" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
