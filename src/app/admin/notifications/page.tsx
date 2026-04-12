
"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, ShoppingBag, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'order', title: 'New Mission Deployment', message: 'Ghost Riley placed an order for ROG Phone 7.', time: '2 mins ago', unread: true },
    { id: 2, type: 'stock', title: 'Critical Stock Alert', message: 'COD Account Level 150 is almost sold out (1 unit left).', time: '1 hour ago', unread: true },
    { id: 3, type: 'user', title: 'New Personnel Recruited', message: 'Soap MacTavish registered as a new customer.', time: '4 hours ago', unread: true },
    { id: 4, type: 'order', title: 'Mission Accomplished', message: 'Order #ORD-1234 has been successfully delivered.', time: '1 day ago', unread: false },
    { id: 5, type: 'system', title: 'Backup Successful', message: 'Weekly intelligence extraction completed successfully.', time: '2 days ago', unread: false },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4" />;
      case 'stock': return <Package className="w-4 h-4" />;
      case 'user': return <UserCheck className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Intel Feed</h1>
            <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Real-time system transmissions and alerts</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-none uppercase font-black text-[10px]">3 New Messages</Badge>
        </div>

        <Card className="bg-card border-primary/10 overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Transmission Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-primary/5">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-6 flex items-start gap-4 hover:bg-primary/5 transition-colors group ${notif.unread ? 'bg-primary/5' : ''}`}>
                  <div className={`p-3 rounded-full ${notif.unread ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-black uppercase tracking-widest">{notif.title}</h3>
                      <span className="text-[10px] text-muted-foreground uppercase">{notif.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{notif.message}</p>
                    {notif.unread && (
                      <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase cursor-pointer hover:underline">
                        <CheckCircle2 className="w-3 h-3" /> Mark as read
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
