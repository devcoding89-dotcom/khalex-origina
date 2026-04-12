
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Lock, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if already logged in
    const auth = localStorage.getItem('gz_admin_auth');
    if (auth === 'true') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials as per enterprise plan requirements
    const isValidAdmin = (username === 'admin' && password === 'gaming2024');
    const isValidManager = (username === 'manager' && password === 'gaming2024');

    if (isValidAdmin || isValidManager) {
      localStorage.setItem('gz_admin_auth', 'true');
      localStorage.setItem('gz_admin_user', username);
      
      toast({
        title: "Access Granted",
        description: `Welcome back, ${username === 'admin' ? 'Commander' : 'Manager'}.`,
      });
      
      // Short delay to allow toast to be seen
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid identification or access code.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
      
      <Card className="w-full max-w-md bg-card border-primary/20 shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Command Center</CardTitle>
          <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Restricted Personnel Only</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest">Identification</Label>
              <Input 
                id="username" 
                placeholder="admin or manager" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="bg-background border-primary/20 focus:border-primary h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest">Access Code</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-background border-primary/20 focus:border-primary h-12"
              />
            </div>

            <div className="p-4 bg-muted/30 border border-primary/10 rounded-lg flex gap-3 items-start">
              <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-[10px] text-muted-foreground uppercase leading-tight">
                <span className="font-black text-primary">Credential Hint:</span> admin / gaming2024 or manager / gaming2024
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest group text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Decrypting...' : 'Initiate Secure Login'}
              {!isLoading && <Gamepad2 className="ml-2 w-6 h-6 group-hover:rotate-12 transition-transform" />}
            </Button>
            <Button variant="ghost" asChild className="text-[10px] uppercase font-black text-muted-foreground hover:text-primary">
              <a href="/">Return to Public Armory</a>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
