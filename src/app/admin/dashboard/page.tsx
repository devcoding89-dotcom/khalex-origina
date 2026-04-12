
"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
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
  const { products, orders, customers } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const lowStock = products.filter(p => p.stock <= 3);

  // Mock Sales Data for Chart
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const categoryData = [
    { name: 'Phones', value: 400 },
    { name: 'Laptops', value: 300 },
    { name: 'Gadgets', value: 300 },
    { name: 'COD', value: 200 },
    { name: 'CP', value: 500 },
  ];

  const COLORS = ['#00ff88', '#00d4ff', '#ffaa00', '#ff4444', '#888888'];

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, change: '+12.5%', isUp: true },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, change: '+5.2%', isUp: true },
    { label: 'Active Assets', value: products.length, icon: Package, change: '-2.1%', isUp: false },
    { label: 'Personnel', value: customers.length, icon: Users, change: '+18.4%', isUp: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Mission Control</h1>
          <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Base of operations and intelligence</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-primary/20 group hover:border-primary transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <stat.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${stat.isUp ? 'text-primary' : 'text-destructive'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change} vs last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Revenue Trajectory</CardTitle>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88' }}
                    itemStyle={{ color: '#00ff88' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#00ff88" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Asset Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </ResponsiveContainer>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-primary/10 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Transmissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${order.status === 'completed' ? 'bg-primary/20 text-primary' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {order.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase">{order.customerName} placed an order</div>
                        <div className="text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()} | ${order.total}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] border-primary/20">VIEW</Badge>
                  </div>
                ))}
                {orders.length === 0 && <div className="p-12 text-center text-xs text-muted-foreground italic uppercase">No recent activity detected</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" /> Critical Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {lowStock.map((product) => (
                  <div key={product.id} className="p-4 flex items-center justify-between hover:bg-destructive/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-primary/10 overflow-hidden">
                        <img src={product.imageUrl} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase">{product.name}</div>
                        <div className="text-[10px] text-destructive font-black uppercase">{product.stock} Units Remaining</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-[10px] font-black uppercase text-primary">Replenish</Button>
                  </div>
                ))}
                {lowStock.length === 0 && <div className="p-12 text-center text-xs text-muted-foreground italic uppercase">All systems fully stocked</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
