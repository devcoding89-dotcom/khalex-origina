
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Gamepad2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Access Granted",
        description: "Welcome back, Commander.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Invalid credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Admin Hub</CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            Restricted access • Personnel only
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Email Address</Label>
              <Input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@khalexhub.com"
                className="bg-background border-primary/10 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Access Key</Label>
              <Input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-primary/10 h-12"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              {isLoading ? "Authenticating..." : "Establish Uplink"}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
              <Lock className="w-3 h-3" /> Encrypted Connection Active
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-8 text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
        KHALEX Hub • System v2.0
      </div>
    </div>
  );
}
