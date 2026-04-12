
"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Target, ArrowUpRight, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const { orders, products, customers } = useStore();

  const categoryPerformance = [
    { name: 'Phones', value: 4500, orders: 12 },
    { name: 'Laptops', value: 8900, orders: 5 },
    { name: 'Gadgets', value: 2300, orders: 18 },
    { name: 'Accounts', value: 3400, orders: 22 },
    { name: 'Top-ups', value: 1200, orders: 45 },
  ];

  const monthlyVolume = [
    { month: 'Jan', units: 45 },
    { month: 'Feb', units: 52 },
    { month: 'Mar', units: 48 },
    { month: 'Apr', units: 61 },
    { month: 'May', units: 55 },
    { month: 'Jun', units: 67 },
  ];

  const deviceUsage = [
    { name: 'Mobile', value: 70 },
    { name: 'Desktop', value: 25 },
    { name: 'Tablet', value: 5 },
  ];

  const COLORS = ['#00ff88', '#00d4ff', '#ffaa00', '#ff4444', '#888888'];

  const stats = [
    { label: 'Avg Order Value', value: '$452.20', icon: TrendingUp, change: '+5.4%' },
    { label: 'Conversion Rate', value: '3.8%', icon: Target, change: '+1.2%' },
    { label: 'Retention Rate', value: '42%', icon: Users, change: '+2.8%' },
    { label: 'Monthly Growth', value: '18%', icon: ShoppingBag, change: '+4.5%' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Intelligence Reports</h1>
          <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Comprehensive data analysis and trajectory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-primary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded text-primary">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center text-[10px] font-black text-primary">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Category Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88' }}
                    itemStyle={{ color: '#00ff88' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Monthly Deployment Volume</CardTitle>
              <BarChart3 className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="month" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00d4ff' }}
                    itemStyle={{ color: '#00d4ff' }}
                  />
                  <Bar dataKey="units" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Platform Traffic (Mock)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <div className="text-2xl font-black text-primary">70%</div>
                <div className="text-[8px] font-black uppercase text-muted-foreground">Mobile</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
