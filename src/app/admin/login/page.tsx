
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Access Granted",
        description: "Welcome to the admin hub.",
      });
      
      router.push('/admin/dashboard');
    } catch (error: any) {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm bg-card border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Admin Login</CardTitle>
          <CardDescription className="text-[9px] uppercase font-bold text-muted-foreground">
            Authorized Personnel Only
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest">Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="admin@khalexhub.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="bg-background border-primary/20 h-9 text-[10px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-background border-primary/20 h-9 text-[10px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-4">
            <Button 
              type="submit" 
              className="w-full h-10 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px]"
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Login'}
              {!isLoading && <LogIn className="ml-2 w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" asChild className="text-[7px] uppercase font-black text-muted-foreground hover:text-primary">
              <a href="/">Exit to Site</a>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
