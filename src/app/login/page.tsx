
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Radar, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';

export default function PersonnelLogin() {
  const [whatsapp, setWhatsapp] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem('gz_user_auth', 'true');
      localStorage.setItem('gz_user_id', whatsapp);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to KHALEX hub.",
      });
      
      router.push('/profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        
        <Card className="w-full max-w-sm bg-card border-primary/20 shadow-2xl relative z-10">
          <CardHeader className="text-center py-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 neon-glow">
              <UserCircle className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Customer Login</CardTitle>
            <CardDescription className="text-muted-foreground uppercase tracking-widest text-[8px] font-black">Login to view your order history</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pb-6">
              <div className="space-y-1">
                <Label htmlFor="whatsapp" className="text-[9px] font-black uppercase tracking-widest">WhatsApp Number</Label>
                <Input 
                  id="whatsapp" 
                  placeholder="e.g. 08012345678" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required 
                  className="bg-background border-primary/20 focus:border-primary h-10 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="code" className="text-[9px] font-black uppercase tracking-widest">Password</Label>
                <Input 
                  id="code" 
                  type="password" 
                  placeholder="••••••••"
                  value={accessCode} 
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="bg-background border-primary/20 focus:border-primary h-10 text-xs"
                />
              </div>

              <div className="p-3 bg-muted/30 border border-primary/10 rounded-lg flex gap-2 items-center">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <div className="text-[8px] text-muted-foreground uppercase leading-tight font-bold">
                  Logging in allows you to track all your past orders in one place.
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest group text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Login'}
                {!isLoading && <Radar className="ml-2 w-4 h-4 group-hover:animate-pulse" />}
              </Button>
              <div className="flex justify-between w-full px-1">
                <Button variant="link" className="text-[8px] uppercase font-black text-muted-foreground p-0 h-auto">Forgot?</Button>
                <Button variant="link" className="text-[8px] uppercase font-black text-primary p-0 h-auto">Register</Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
