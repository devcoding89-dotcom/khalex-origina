
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials as per proposal requirements
    if (username === 'admin' && password === 'gaming2024') {
      localStorage.setItem('gz_admin_auth', 'true');
      toast({
        title: "Access Granted",
        description: "Welcome back, Commander.",
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid credentials. Please try again.",
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
          <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Admin Access Restricted</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">IDENTIFICATION</Label>
              <Input 
                id="username" 
                placeholder="admin" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="bg-background border-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">ACCESS CODE</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-background border-primary/20 focus:border-primary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest group"
              disabled={isLoading}
            >
              {isLoading ? 'Decrypting...' : 'Initiate Login'}
              {!isLoading && <Gamepad2 className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
