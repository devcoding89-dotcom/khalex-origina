
"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useStore, Order, OrderStatus } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  MessageSquare,
  Package,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kanbanColumns: { id: OrderStatus; label: string; color: string }[] = [
    { id: 'pending', label: 'Pending', color: 'yellow-500' },
    { id: 'processing', label: 'Processing', color: 'blue-500' },
    { id: 'ready', label: 'Ready', color: 'purple-500' },
    { id: 'completed', label: 'Success', color: 'primary' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Mission Manifest</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Coordination of all active deployments</p>
          </div>
          <div className="flex items-center bg-card border border-primary/10 p-1 rounded-lg">
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className="gap-2 h-8 uppercase font-black text-[10px]"
            >
              <List className="w-3 h-3" /> List
            </Button>
            <Button 
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('kanban')}
              className="gap-2 h-8 uppercase font-black text-[10px]"
            >
              <LayoutGrid className="w-3 h-3" /> Kanban
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              placeholder="Search Transmissions..." 
              className="bg-card border border-primary/10 rounded-lg h-10 pl-10 pr-4 text-sm w-full focus:outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-card border border-primary/10 rounded-lg h-10 px-4 text-sm focus:outline-none focus:border-primary uppercase font-black"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            {kanbanColumns.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {viewMode === 'list' ? (
          <Card className="bg-card border-primary/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Personnel</th>
                    <th className="px-6 py-4">Assets</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs">{order.id.split('-')[1]}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold uppercase text-xs">{order.customerName}</div>
                        <div className="text-[10px] text-primary">{order.whatsapp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] line-clamp-1 italic">
                          {order.items.map(i => `${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-primary">${order.total}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-[8px] uppercase font-black border-none gap-1 bg-${order.status === 'completed' ? 'primary' : 'yellow-500'}/20 text-${order.status === 'completed' ? 'primary' : 'yellow-500'}`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {kanbanColumns.map(col => (
              <div key={col.id} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-${col.color}`} />
                    {col.label}
                  </h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px]">
                    {orders.filter(o => o.status === col.id).length}
                  </Badge>
                </div>
                <div className="space-y-3 min-h-[500px] bg-primary/5 rounded-xl p-2 border border-dashed border-primary/10">
                  {orders.filter(o => o.status === col.id).map(order => (
                    <Card key={order.id} className="bg-card border-primary/10 hover:border-primary/40 transition-all shadow-sm">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="font-mono text-[8px] text-muted-foreground">{order.id}</div>
                          {order.priority === 'urgent' && <AlertCircle className="w-3 h-3 text-destructive animate-pulse" />}
                        </div>
                        <Link href={`/admin/orders/${order.id}`} className="block group/item">
                          <div className="text-xs font-bold uppercase group-hover/item:text-primary transition-colors">{order.customerName}</div>
                          <div className="text-[9px] text-muted-foreground line-clamp-1">{order.items.map(i => i.name).join(', ')}</div>
                        </Link>
                        <div className="flex justify-between items-center pt-2 border-t border-primary/5">
                          <div className="text-[8px] font-black text-primary">${order.total}</div>
                          <div className="flex gap-1">
                             {col.id === 'pending' && (
                               <Button size="icon" variant="ghost" className="h-6 w-6 text-blue-500 hover:bg-blue-500/20" onClick={() => updateOrderStatus(order.id, 'processing')}>
                                 <Package className="w-3 h-3" />
                               </Button>
                             )}
                             {col.id === 'processing' && (
                               <Button size="icon" variant="ghost" className="h-6 w-6 text-purple-500 hover:bg-purple-500/20" onClick={() => updateOrderStatus(order.id, 'ready')}>
                                 <CheckCircle2 className="w-3 h-3" />
                               </Button>
                             )}
                             {col.id === 'ready' && (
                               <Button size="icon" variant="ghost" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={() => updateOrderStatus(order.id, 'completed')}>
                                 <CheckCircle2 className="w-3 h-3" />
                               </Button>
                             )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
