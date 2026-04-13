
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';

export default function CustomerLogin() {
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated login for simplicity
    setTimeout(() => {
      localStorage.setItem('gz_user_auth', 'true');
      localStorage.setItem('gz_user_id', whatsapp);
      
      toast({
        title: "Success",
        description: "You are now logged in.",
      });
      
      router.push('/products');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-card border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Login</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">
              Login to track your orders and see your history
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-widest">WhatsApp Number</Label>
                <Input 
                  id="whatsapp" 
                  placeholder="e.g. 08012345678" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required 
                  className="bg-background border-primary/20 h-10 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-primary/20 h-10 text-xs"
                />
              </div>

              <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex gap-2 items-center">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <p className="text-[8px] text-muted-foreground uppercase font-bold leading-tight">
                  Your account keeps your gaming details safe for faster shopping.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs"
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Login'}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
              <div className="flex justify-between w-full">
                <Button variant="link" className="text-[8px] uppercase font-black text-muted-foreground p-0 h-auto">Forgot Password?</Button>
                <Button variant="link" className="text-[8px] uppercase font-black text-primary p-0 h-auto">Register</Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
