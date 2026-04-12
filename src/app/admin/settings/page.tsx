
"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Store, CreditCard, Bell, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: "System Synchronized",
      description: "Store configurations have been updated globally.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">System Configuration</h1>
          <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Manage global parameters and store architecture</p>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="bg-card border border-primary/10 p-1">
            <TabsTrigger value="store" className="gap-2 uppercase font-black text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Store className="w-3 h-3" /> Store
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2 uppercase font-black text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="w-3 h-3" /> Payment
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 uppercase font-black text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="w-3 h-3" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 uppercase font-black text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ShieldCheck className="w-3 h-3" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">General Intel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px]">Store Callsign</Label>
                    <Input 
                      value={formData.storeName} 
                      onChange={e => setFormData({...formData, storeName: e.target.value})}
                      className="bg-background border-primary/10 h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px]">Support WhatsApp</Label>
                    <Input 
                      value={formData.whatsapp} 
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                      className="bg-background border-primary/10 h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px]">Encrypted Email</Label>
                    <Input 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="bg-background border-primary/10 h-10"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="uppercase font-black text-[10px]">Maintenance Mode</Label>
                      <p className="text-[8px] text-muted-foreground uppercase">Disable public access for updates</p>
                    </div>
                    <Switch 
                      checked={formData.maintenanceMode} 
                      onCheckedChange={checked => setFormData({...formData, maintenanceMode: checked})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px]">Currency Symbol</Label>
                    <Input 
                      value={formData.currencySymbol} 
                      onChange={e => setFormData({...formData, currencySymbol: e.target.value})}
                      className="bg-background border-primary/10 h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px]">Tax Rate (%)</Label>
                    <Input 
                      type="number"
                      value={formData.taxRate} 
                      onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})}
                      className="bg-background border-primary/10 h-10"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card border-primary/10 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Advanced Defense
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="uppercase font-black text-[10px]">Brute Force Protection</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">Lockout after 5 failed attempts</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="uppercase font-black text-[10px]">Encrypted Storage</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">AES-256 for credentials</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="pt-4 border-t border-primary/5">
                  <Button variant="destructive" className="w-full uppercase font-black tracking-widest text-[10px]">
                    Reset Administrator Access Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="pt-8 border-t border-primary/10">
          <Button 
            onClick={handleSave}
            className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-lg hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]"
          >
            Save Mission Protocol
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
