"use client";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary fill-primary/20" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LifeMoments
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Home</Link>
            <Link href="/capture" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Capture Memory</Link>
            <Link href="/timeline" className="text-muted-foreground hover:text-foreground transition-colors font-medium">My Timeline</Link>
            <Link href="/legacy" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Legacy Builder</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="h-9 px-3">Sign In</Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-9">Start Your Legacy</Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 mt-4">
              {[
                { href: "/", label: "Home" },
                { href: "/capture", label: "Capture Memory" },
                { href: "/timeline", label: "My Timeline" },
                { href: "/legacy", label: "Legacy Builder" },
              ].map((i) => (
                <Link key={i.href} href={i.href} onClick={() => setIsMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  {i.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" onClick={() => setIsMenuOpen(false)}>Sign In</Button>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Start Your Legacy</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
