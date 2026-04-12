
"use client";

import { use, useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useStore, Order, OrderStatus, PaymentStatus } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MessageSquare, 
  Printer, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle,
  CreditCard,
  User,
  Package,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { orders, updateOrderStatus, updateOrderPaymentStatus, settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const found = orders.find(o => o.id === id);
    if (found) setOrder(found);
  }, [id, orders]);

  if (!order) return <div className="p-8 text-center text-primary font-headline animate-pulse">DECRYPTING DATA...</div>;

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
    toast({ title: "Status Updated", description: `Mission marked as ${newStatus}` });
  };

  const handlePaymentUpdate = (newStatus: PaymentStatus) => {
    updateOrderPaymentStatus(order.id, newStatus);
    toast({ title: "Payment Updated", description: `Transaction status: ${newStatus}` });
  };

  const waLink = `https://wa.me/${order.whatsapp}?text=Hi ${order.customerName}! Regarding your order ${order.id}...`;

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Manifest
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="border-primary/20 h-9 text-[10px] uppercase font-black">
              <Printer className="w-3 h-3 mr-2" /> Invoice
            </Button>
            <Button variant="destructive" className="h-9 text-[10px] uppercase font-black">
              <Trash2 className="w-3 h-3 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-primary/20">
              <CardHeader className="border-b border-primary/5">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Mission Details
                  </CardTitle>
                  <Badge className={`uppercase text-[10px] font-black border-none bg-primary/20 text-primary`}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-[8px] text-muted-foreground uppercase font-black">Transmission ID</div>
                    <div className="font-mono text-xs">{order.id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[8px] text-muted-foreground uppercase font-black">Date Logged</div>
                    <div className="text-xs">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[8px] text-muted-foreground uppercase font-black">Priority</div>
                    <Badge variant="outline" className={`text-[8px] uppercase ${order.priority === 'urgent' ? 'border-destructive text-destructive' : 'border-primary/20'}`}>
                      {order.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[8px] text-muted-foreground uppercase font-black">Payment Status</div>
                    <div className="text-xs font-bold text-secondary uppercase">{order.paymentStatus}</div>
                  </div>
                </div>

                <div className="border-t border-primary/5 pt-6">
                  <div className="text-[10px] font-black uppercase tracking-widest mb-4">Deployed Assets</div>
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-muted/20 p-4 rounded-lg border border-primary/5">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover rounded" /> : '🎮'}
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase">{item.name}</div>
                            <div className="text-[9px] text-muted-foreground uppercase">{item.category} | Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="text-sm font-black text-primary">{settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t border-primary/5 p-6 flex justify-between items-center">
                <div className="text-xl font-black uppercase italic">Total Settlement</div>
                <div className="text-3xl font-black text-primary italic tracking-tighter">{settings.currencySymbol}{order.total.toLocaleString()}</div>
              </CardFooter>
            </Card>

            <Card className="bg-card border-primary/10">
              <CardHeader>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Transmission History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== order.timeline.length - 1 && <div className="absolute left-2.5 top-6 bottom-0 w-px bg-primary/20" />}
                    <div className={`w-5 h-5 rounded-full z-10 flex items-center justify-center ${idx === order.timeline.length - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div className="text-[10px] font-black uppercase">{event.status}</div>
                        <div className="text-[8px] text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="text-[10px] text-muted-foreground italic mt-1">
                        {event.note || 'Status updated by system'} • {event.by}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-primary/10 overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Personnel Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-[8px] text-muted-foreground uppercase font-black">Callsign</div>
                  <div className="text-sm font-bold uppercase">{order.customerName}</div>
                </div>
                <div>
                  <div className="text-[8px] text-muted-foreground uppercase font-black">Comms Channel</div>
                  <a href={waLink} target="_blank" className="text-xs text-primary flex items-center gap-2 hover:underline">
                    <MessageSquare className="w-3 h-3" /> {order.whatsapp}
                  </a>
                </div>
                {order.codUid && (
                  <div className="p-3 bg-secondary/5 rounded border border-secondary/20 space-y-2">
                    <div className="text-[8px] text-secondary uppercase font-black">Asset UID</div>
                    <div className="text-xs font-mono">{order.codUid}</div>
                    <div className="text-[8px] text-secondary uppercase font-black mt-2">Asset IGN</div>
                    <div className="text-xs font-bold">{order.codIgn}</div>
                  </div>
                )}
                <Button asChild variant="outline" className="w-full border-primary/20 h-10 text-[10px] uppercase font-black">
                  <Link href={`/admin/customers/${order.customerId}`}>
                    View Personnel Profile <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest">Command Protocol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-[8px] text-muted-foreground uppercase font-black">Update Mission Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-[8px] h-8" onClick={() => handleStatusUpdate('processing')}>PROCESSING</Button>
                    <Button size="sm" variant="outline" className="text-[8px] h-8" onClick={() => handleStatusUpdate('ready')}>READY</Button>
                    <Button size="sm" variant="outline" className="text-[8px] h-8 text-primary border-primary/20" onClick={() => handleStatusUpdate('completed')}>COMPLETE</Button>
                    <Button size="sm" variant="outline" className="text-[8px] h-8 text-destructive border-destructive/20" onClick={() => handleStatusUpdate('cancelled')}>CANCEL</Button>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-primary/5">
                  <div className="text-[8px] text-muted-foreground uppercase font-black">Verify Payment</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-[8px] h-8 text-secondary border-secondary/20" onClick={() => handlePaymentUpdate('paid')}>MARK PAID</Button>
                    <Button size="sm" variant="outline" className="text-[8px] h-8 text-destructive border-destructive/20" onClick={() => handlePaymentUpdate('failed')}>FAILED</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
