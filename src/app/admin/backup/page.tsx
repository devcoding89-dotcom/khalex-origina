
"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  History, 
  ShieldAlert,
  CheckCircle2,
  FileJson,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';

export default function BackupPage() {
  const { toast } = useToast();
  const { purgeDatabase, products, orders } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const data = {
        products,
        orders,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `khalex-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      setIsProcessing(false);
      toast({ title: "Backup Extracted", description: "All mission data has been saved to disk." });
    }, 1500);
  };

  const handleReset = async () => {
    if (confirm("CRITICAL WARNING: This will purge ALL cloud database data. This action is irreversible. Proceed?")) {
      const password = prompt("Enter Administrator Access Code (gaming2025) to confirm purge:");
      if (password === 'gaming2025') {
        setIsProcessing(true);
        try {
          await purgeDatabase();
          toast({ title: "System Purged", description: "All cloud records have been wiped." });
        } catch (e) {
          toast({ variant: "destructive", title: "Purge Failed", description: "Could not wipe database." });
        } finally {
          setIsProcessing(false);
        }
      } else {
        alert("Access Denied. Purge Aborted.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Data Management</h1>
          <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">Secure backup, restoration and system maintenance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Download className="w-4 h-4" /> Extraction Protocol (Backup)
              </CardTitle>
              <CardDescription className="text-[10px] uppercase">Download a full snapshot of all store intel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-8 h-8 text-primary" />
                    <div>
                      <div className="text-xs font-bold uppercase">Full System State</div>
                      <div className="text-[8px] text-muted-foreground">INCLUDES PRODUCTS AND ORDERS</div>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-none text-[8px]">STABLE</Badge>
                </div>
                <Button 
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs h-10"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Initiate Extraction'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                <Upload className="w-4 h-4" /> Infiltration Protocol (Import)
              </CardTitle>
              <CardDescription className="text-[10px] uppercase">Upload a previously saved system state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/40 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase">Drop Backup File Here</div>
                  <div className="text-[8px] text-muted-foreground uppercase mt-1">Accepts .JSON files only</div>
                </div>
                <Button variant="outline" className="border-secondary/20 uppercase font-black text-[10px] h-8">
                  Select Intel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-destructive/20 border-2">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> System Purge (Reset)
              </CardTitle>
              <CardDescription className="text-[10px] uppercase text-destructive/80">Wipe all cloud data and restore factory defaults</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold italic">
                  Performing a system purge will delete all products and clear the order manifest from the CLOUD. This operation is locked behind commander access.
                </p>
                <Button 
                  onClick={handleReset}
                  disabled={isProcessing}
                  variant="destructive" 
                  className="w-full uppercase font-black tracking-widest text-xs h-12 shadow-[0_0_20px_rgba(255,68,68,0.2)]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} 
                  Execute Total Purge
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Synchronization Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase">Cloud-Sync Successful</div>
                        <div className="text-[8px] text-muted-foreground uppercase">{new Date(Date.now() - i*86400000).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-[8px] font-black text-primary">STABLE</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
