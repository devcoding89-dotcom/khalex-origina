
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
  const { products, orders, customers, auditLogs } = useStore();

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = products.filter(p => p.stock <= p.stockAlert).length;
  const monthlyRevenueGoal = 10000;
  const progressToGoal = Math.min(100, (totalRevenue / monthlyRevenueGoal) * 100);

  // Mock Sales Data
  const salesData = [
    { name: 'Mon', sales: 4200 },
    { name: 'Tue', sales: 3800 },
    { name: 'Wed', sales: 5100 },
    { name: 'Thu', sales: 4800 },
    { name: 'Fri', sales: 6200 },
    { name: 'Sat', sales: 7500 },
    { name: 'Sun', sales: 6900 },
  ];

  const categoryData = [
    { name: 'Phones', value: products.filter(p => p.category === 'phones').length },
    { name: 'Laptops', value: products.filter(p => p.category === 'laptops').length },
    { name: 'Accounts', value: products.filter(p => p.category === 'cod').length },
    { name: 'Services', value: products.filter(p => p.category === 'cp').length },
  ];

  const COLORS = ['#00ff88', '#00d4ff', '#ffaa00', '#ff4444'];

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, change: '+14.2%', isUp: true },
    { label: 'Pending Missions', value: pendingCount, icon: Clock, change: '-2 Units', isUp: false },
    { label: 'Asset Inventory', value: products.length, icon: Package, change: '+5 Units', isUp: true },
    { label: 'Personnel Count', value: customers.length, icon: Users, change: '+12%', isUp: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Mission Control</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Strategic overview of system operations</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Target Revenue Goal</div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${progressToGoal}%` }} />
              </div>
              <span className="text-xs font-black text-primary italic">{Math.round(progressToGoal)}%</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-primary/20 hover:border-primary transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground z-10">{stat.label}</p>
                <stat.icon className="w-4 h-4 text-primary z-10" />
              </CardHeader>
              <CardContent className="z-10 relative">
                <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${stat.isUp ? 'text-primary' : 'text-destructive'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change} vs prev. period
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Revenue Trajectory
              </CardTitle>
              <Badge variant="outline" className="text-[8px] border-primary/20">LIVE FEED</Badge>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88', borderRadius: '8px' }}
                    itemStyle={{ color: '#00ff88', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#00ff88" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
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
              <div className="grid grid-cols-2 gap-4 mt-4">
                {categoryData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lower Row: Audit Logs & Critical Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-primary/10 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Command Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase">{log.action.replace('_', ' ')}: {log.target}</div>
                        <div className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()} • {log.admin}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">INTEL</Badge>
                  </div>
                ))}
                {auditLogs.length === 0 && <div className="p-12 text-center text-xs text-muted-foreground italic uppercase">No recent transmissions</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-destructive/20 border-2 overflow-hidden">
            <CardHeader className="bg-destructive/10 border-b border-destructive/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" /> Critical Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-destructive/10">
                {products.filter(p => p.stock <= p.stockAlert).map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between bg-destructive/5 hover:bg-destructive/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-destructive/20 overflow-hidden">
                        <img src={p.imageUrl} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase">{p.name}</div>
                        <div className="text-[10px] text-destructive font-black uppercase italic">Only {p.stock} units remain</div>
                      </div>
                    </div>
                    <Badge className="bg-destructive text-destructive-foreground text-[8px] font-black">CRITICAL</Badge>
                  </div>
                ))}
                {products.filter(p => p.stock <= p.stockAlert).length === 0 && (
                  <div className="p-12 text-center text-xs text-muted-foreground italic uppercase">All armory stock levels optimal</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
