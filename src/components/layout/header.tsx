"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, MessageCircle, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center px-4">
        {/* Logo Section */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Smartphone className="h-5 w-5" />
            </div>
            <span className="cellflip-logo text-xl font-bold">cellflip</span>
            <Badge variant="secondary" className="ml-2 text-xs">by Fairtreez</Badge>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm">
          <Link 
            href="#how-it-works" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            How it Works
          </Link>
          <Link 
            href="#features" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Features
          </Link>
          <Link 
            href="#testimonials" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Reviews
          </Link>
          <Link 
            href="/about" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login">
              <MessageCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              href="#how-it-works" 
              className="block text-sm text-foreground/60 hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="#features" 
              className="block text-sm text-foreground/60 hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#testimonials" 
              className="block text-sm text-foreground/60 hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link 
              href="/about" 
              className="block text-sm text-foreground/60 hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-2 border-t">
              <Link 
                href="/login" 
                className="block text-sm text-foreground/60 hover:text-foreground/80 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 