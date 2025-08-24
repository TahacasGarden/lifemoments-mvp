"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Mail, Lock, Eye, EyeOff, Sparkles, Users, Clock } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) location.replace("/dashboard");
    })();
  }, []);

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/dashboard` },
    });
    setIsGoogleLoading(false);
  }

  async function signInWithEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) alert(error.message);
    else location.replace("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <Heart className="h-12 w-12 text-primary fill-primary/20" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LifeMoments
              </h1>
              <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 text-xs">
                Memory Vault
              </Badge>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Preserve Your Legacy
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Capture precious memories, share wisdom, and create a lasting legacy for future generations.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">AI-Powered Organization</p>
                <p className="text-sm text-muted-foreground">Automatically organize your stories</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium">Family Sharing</p>
                <p className="text-sm text-muted-foreground">Connect across generations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Timeline Memories</p>
                <p className="text-sm text-muted-foreground">Your life story, beautifully organized</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Heart className="h-10 w-10 text-primary fill-primary/20" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  LifeMoments
                </h1>
                <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 text-xs">
                  Memory Vault
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground">Welcome back to your memory vault</p>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-muted-foreground">
                Sign in to continue capturing your precious memories
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sign In */}
              <Button
                onClick={signInWithGoogle}
                disabled={isGoogleLoading}
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={signInWithEmail} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      className="w-full h-12 pl-10 pr-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Sign up for free
                  </a>
                </p>
                <p className="text-xs text-muted-foreground">
                  <a href="#" className="hover:underline">
                    Forgot your password?
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              🔒 Your memories are secure and private
            </p>
            <p className="text-xs text-muted-foreground">
              Trusted by families worldwide to preserve their legacy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
