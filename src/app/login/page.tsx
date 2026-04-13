"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, UserCircle, Radar, ShieldCheck } from 'lucide-react';
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

    // For MVP: Simple access using WhatsApp number
    // In production, this would use Firebase Auth OTP or Password
    setTimeout(() => {
      localStorage.setItem('gz_user_auth', 'true');
      localStorage.setItem('gz_user_id', whatsapp);
      
      toast({
        title: "Personnel Verified",
        description: "Welcome back to the KHALEX tactical hub.",
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
        
        <Card className="w-full max-w-md bg-card border-primary/20 shadow-2xl relative z-10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 neon-glow">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">Personnel Portal</CardTitle>
            <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Identify yourself to access your armory</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-widest">WhatsApp Identifier</Label>
                <Input 
                  id="whatsapp" 
                  placeholder="e.g. 09166905298" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required 
                  className="bg-background border-primary/20 focus:border-primary h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest">Access Code (Optional for MVP)</Label>
                <Input 
                  id="code" 
                  type="password" 
                  placeholder="••••••••"
                  value={accessCode} 
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="bg-background border-primary/20 focus:border-primary h-12"
                />
              </div>

              <div className="p-4 bg-muted/30 border border-primary/10 rounded-lg flex gap-3 items-center">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <div className="text-[8px] text-muted-foreground uppercase leading-tight font-bold">
                  Logging in allows you to track all missions and view your exclusive XP status.
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest group text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Access Hub'}
                {!isLoading && <Radar className="ml-2 w-6 h-6 group-hover:animate-pulse" />}
              </Button>
              <div className="flex justify-between w-full px-2">
                <Button variant="link" className="text-[9px] uppercase font-black text-muted-foreground p-0 h-auto">Forgot Code?</Button>
                <Button variant="link" className="text-[9px] uppercase font-black text-primary p-0 h-auto">Create Account</Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
