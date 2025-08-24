"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Menu, X, Bell, User, Search, Sparkles, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Don't render header on login page
  if (typeof window !== 'undefined' && window.location.pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border z-50 sticky top-0">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary fill-primary/20" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LifeMoments
              </span>
              <Badge className="ml-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 text-xs">
                Memory Vault
              </Badge>
            </div>
          </Link>

          {/* Center - Welcome Message */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-2 rounded-full border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Welcome! Ready to preserve your precious memories?</span>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                  </Button>
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm px-4" asChild>
                  <Link href="/login">
                    <Heart className="h-3 w-3 mr-2" />
                    Start Legacy
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="space-y-4 mt-4">
              {/* Welcome Message for Mobile */}
              {isAuthenticated && (
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Welcome to LifeMoments!</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your personal memory vault is ready. Start capturing precious moments today.
                  </p>
                </div>
              )}
              
              {/* Mobile Nav Items */}
              <div className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                      <Search className="h-4 w-4 mr-2" />
                      Search Memories
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIsMenuOpen(false)} asChild>
                      <Link href="/login">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" onClick={() => setIsMenuOpen(false)} asChild>
                      <Link href="/login">
                        <Heart className="h-4 w-4 mr-2" />
                        Start Your Legacy
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
