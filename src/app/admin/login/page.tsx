
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem('gz_admin_auth');
    if (auth === 'true') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isValidAdmin = (username === 'admin' && password === 'gaming2024');
    const isValidManager = (username === 'manager' && password === 'gaming2024');

    if (isValidAdmin || isValidManager) {
      localStorage.setItem('gz_admin_auth', 'true');
      localStorage.setItem('gz_admin_user', username);
      
      toast({
        title: "Welcome Back",
        description: `Logged in as ${username}.`,
      });
      
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm bg-card border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Admin Login</CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">
            Owner and Staff Access Only
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest">Username</Label>
              <Input 
                id="username" 
                placeholder="Enter username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
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
                required 
                className="bg-background border-primary/20 h-10 text-xs"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs"
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Login'}
              {!isLoading && <LogIn className="ml-2 w-4 h-4" />}
            </Button>
            <Button variant="ghost" asChild className="text-[8px] uppercase font-black text-muted-foreground hover:text-primary">
              <a href="/">Return to Shop</a>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
