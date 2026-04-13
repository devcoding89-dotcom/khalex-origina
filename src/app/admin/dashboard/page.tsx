
"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { products, orders, customers, auditLogs = [], settings } = useStore();

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = products.filter(p => p.stock <= p.stockAlert).length;
  const monthlyRevenueGoal = 10000000;
  const progressToGoal = Math.min(100, (totalRevenue / monthlyRevenueGoal) * 100);

  const salesData = [
    { name: 'Mon', sales: 420000 },
    { name: 'Tue', sales: 380000 },
    { name: 'Wed', sales: 510000 },
    { name: 'Thu', sales: 480000 },
    { name: 'Fri', sales: 620000 },
    { name: 'Sat', sales: 750000 },
    { name: 'Sun', sales: 690000 },
  ];

  const categoryData = [
    { name: 'Phones', value: products.filter(p => p.category === 'phones').length },
    { name: 'Laptops', value: products.filter(p => p.category === 'laptops').length },
    { name: 'Accounts', value: products.filter(p => p.category === 'cod').length },
    { name: 'Services', value: products.filter(p => p.category === 'cp').length },
  ];

  const COLORS = ['#00ff88', '#00d4ff', '#ffaa00', '#ff4444'];

  const stats = [
    { label: 'Total Sales', value: `${settings.currencySymbol}${totalRevenue.toLocaleString()}`, icon: TrendingUp, change: '+14.2%', isUp: true },
    { label: 'Pending Orders', value: pendingCount, icon: Clock, change: '-2 Units', isUp: false },
    { label: 'Product Stock', value: products.length, icon: Package, change: '+5 Units', isUp: true },
    { label: 'Total Customers', value: customers.length, icon: Users, change: '+12%', isUp: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Dashboard</h1>
            <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Overview of your shop</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Sales Goal</div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${progressToGoal}%` }} />
              </div>
              <span className="text-[10px] font-black text-primary italic">{Math.round(progressToGoal)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-primary/20 hover:border-primary transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground z-10">{stat.label}</p>
                <stat.icon className="w-4 h-4 text-primary z-10" />
              </CardHeader>
              <CardContent className="z-10 relative">
                <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
                <div className={`flex items-center gap-1 text-[9px] font-bold mt-1 ${stat.isUp ? 'text-primary' : 'text-destructive'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change} vs last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Sales Report
              </CardTitle>
              <Badge variant="outline" className="text-[7px] border-primary/20">LIVE DATA</Badge>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88', borderRadius: '8px' }}
                    itemStyle={{ color: '#00ff88', fontWeight: 'bold' }}
                    formatter={(value: number) => [`${settings.currencySymbol}${value.toLocaleString()}`, 'Sales']}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest">Product Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[8px] font-black uppercase text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-primary/10 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> System Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {(auditLogs || []).slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase">{log.action}: {log.target}</div>
                        <div className="text-[8px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()} • {log.admin}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!auditLogs || auditLogs.length === 0) && <div className="p-10 text-center text-[10px] text-muted-foreground italic uppercase">No recent activity</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-destructive/20 border-2 overflow-hidden">
            <CardHeader className="bg-destructive/10 border-b border-destructive/20">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" /> Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-destructive/10">
                {products.filter(p => p.stock <= p.stockAlert).map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between bg-destructive/5 hover:bg-destructive/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded border border-destructive/20 overflow-hidden">
                        <img src={p.imageUrl} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase">{p.name}</div>
                        <div className="text-[9px] text-destructive font-black uppercase italic">{p.stock} units left</div>
                      </div>
                    </div>
                    <Badge className="bg-destructive text-destructive-foreground text-[7px] font-black px-1.5 py-0">ALERT</Badge>
                  </div>
                ))}
                {products.filter(p => p.stock <= p.stockAlert).length === 0 && (
                  <div className="p-10 text-center text-[10px] text-muted-foreground italic uppercase">Stock levels are good</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
