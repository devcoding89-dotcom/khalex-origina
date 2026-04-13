"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/admin/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router, auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Map 'khlex' to a proper email if user just types the callsign
      const email = username.toLowerCase() === 'khlex' 
        ? 'khlex@khalexhub.com' 
        : (username.includes('@') ? username : `${username.toLowerCase()}@khalexhub.com`);
      
      // Real Firebase Auth login
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Access Granted",
        description: "Cloud session established. You are now live.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Incorrect callsign or access key. Ensure user is added in Firebase Console Auth.",
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
          <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Admin Hub</CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            Restricted access • Authorized Personnel Only
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Callsign (e.g. khlex)</Label>
              <Input 
                type="text" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="bg-background border-primary/10 h-12 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Access Key</Label>
              <Input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-background border-primary/10 h-12"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              {isLoading ? "Verifying..." : "Establish Uplink"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3">
             <AlertCircle className="w-5 h-5 text-primary shrink-0" />
             <p className="text-[9px] text-muted-foreground uppercase font-bold leading-relaxed">
               Sync Notice: Ensure you have added 'khlex@khalexhub.com' to your Firebase Console Auth tab to sync data to other devices.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
