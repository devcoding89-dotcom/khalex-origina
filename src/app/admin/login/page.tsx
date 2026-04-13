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
    const session = localStorage.getItem('khalex_admin_session');
    if (session === 'active') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials as requested: admin / gaming2025
    if (username.toLowerCase() === 'admin' && password === 'gaming2025') {
      try {
        // Automatically connect to the Cloud Database using Anonymous Auth
        await signInAnonymously(auth);
        
        localStorage.setItem('khalex_admin_session', 'active');
        toast({ title: "Secure Uplink Established", description: "You are now connected to the Cloud Armory." });
        router.push('/admin/dashboard');
      } catch (error) {
        toast({ variant: "destructive", title: "Cloud Jammed", description: "Could not link to the database. Check your internet." });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid credentials." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-primary/20 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">KHALEX Hub Admin</CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Authorized Personnel Only</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="uppercase font-black text-[10px]">Username</Label>
              <Input 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="admin" 
                className="bg-background h-12" 
                disabled={isLoading} 
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase font-black text-[10px]">Password</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-background h-12" 
                disabled={isLoading} 
              />
            </div>
            <Button type="submit" className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Login"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3 items-center">
             <Lock className="w-5 h-5 text-primary" />
             <p className="text-[9px] text-muted-foreground uppercase font-bold">Real-time Cloud Sync is Active.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
