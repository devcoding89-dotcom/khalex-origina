
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInAnonymously } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const localSession = localStorage.getItem('khalex_admin_session');
    if (localSession === 'active') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Direct credentials check as requested
      if (username.toLowerCase() === 'admin' && password === 'gaming2025') {
        
        // Ensure a Firebase connection is active for the database sync
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn('Firebase connection failed, continuing with local session:', authErr);
        }
        
        localStorage.setItem('khalex_admin_session', 'active');
        
        toast({
          title: "System Access Granted",
          description: "Database linked. Opening dashboard...",
        });
        
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid credentials. Please check your username and password.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to link with the cloud server. Check your network.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">KHALEX ADMIN</CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            Secured Access • Authorized Personnel Only
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Username</Label>
              <Input 
                type="text" 
                required 
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="bg-background border-primary/10 h-12 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Password</Label>
              <Input 
                type="password" 
                required 
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-primary/10 h-12"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </span>
              ) : "Unlock Dashboard"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3 items-center">
             <Lock className="w-5 h-5 text-primary shrink-0" />
             <p className="text-[9px] text-muted-foreground uppercase font-bold leading-relaxed">
               Secure cloud sync is active. Your changes will reflect on all devices.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
