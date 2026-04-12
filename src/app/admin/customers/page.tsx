
"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useStore, Customer } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, ShoppingBag, TrendingUp, UserCheck, UserPlus, Filter, Download } from 'lucide-react';

export default function CustomersPage() {
  const { customers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.whatsapp.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Personnel', value: customers.length, icon: UserCheck, color: 'primary' },
    { label: 'New This Month', value: customers.filter(c => new Date(c.joinedDate) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: UserPlus, color: 'blue-500' },
    { label: 'Elite Assets (VIP)', value: customers.filter(c => c.group === 'vip').length, icon: TrendingUp, color: 'yellow-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Personnel Database</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Manage customer profiles and mission history</p>
          </div>
          <Button variant="outline" className="border-primary/20 uppercase font-black tracking-widest text-[10px]">
            <Download className="w-4 h-4 mr-2" /> Export Intel (CSV)
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(s => (
            <Card key={s.label} className="bg-card border-primary/20">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <div className="text-3xl font-black tracking-tighter mt-1">{s.value}</div>
                </div>
                <div className={`p-4 rounded-full bg-${s.color}/10 text-${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main List */}
        <Card className="bg-card border-primary/10 overflow-hidden">
          <CardHeader className="p-6 border-b border-primary/5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  placeholder="Search Name, WhatsApp, Email..." 
                  className="bg-background border border-primary/10 rounded-lg h-10 pl-10 pr-4 text-sm w-full focus:outline-none focus:border-primary transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="ghost" className="gap-2 uppercase font-black text-[10px] border border-primary/10">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/30 border-b">
                <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <th className="px-6 py-4">Personnel</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Mission Data</th>
                  <th className="px-6 py-4">Total Value</th>
                  <th className="px-6 py-4">Group</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-sm uppercase">
                          {customer.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase">{customer.name}</div>
                          <div className="text-[10px] text-muted-foreground">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] text-primary">
                          <Phone className="w-3 h-3" /> {customer.whatsapp}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Mail className="w-3 h-3" /> {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-[10px] font-bold">{customer.orderCount} Deployments</div>
                        <div className="text-[8px] text-muted-foreground uppercase">Last: {new Date(customer.lastOrderDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-primary">${customer.totalSpent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`
                        text-[8px] uppercase font-black border-none px-2 py-0.5
                        ${customer.group === 'vip' ? 'bg-yellow-500/20 text-yellow-500' : 
                          customer.group === 'regular' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-500'}
                      `}>
                        {customer.group}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/20" asChild>
                           <a href={`https://wa.me/${customer.whatsapp}`} target="_blank" rel="noreferrer">
                             <Phone className="w-4 h-4" />
                           </a>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/20">
                          <ShoppingBag className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic uppercase">No personnel detected in current session</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
