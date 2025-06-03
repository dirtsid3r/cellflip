'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Users, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32 xl:py-40">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Kerala Badge */}
          <motion.div variants={fadeInUp}>
            <Badge 
              variant="secondary" 
              className="mb-8 px-6 py-2 text-sm font-medium bg-success/10 text-success border-success/20 hover:bg-success/15 transition-colors"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Proudly serving Kerala
            </Badge>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            className="mb-6 text-display-xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
            variants={fadeInUp}
          >
            Sell Your Phone
            <br className="hidden sm:inline" />
            <span className="bg-primary bg-clip-text text-transparent">
              Get Fair Price
            </span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            className="mb-10 mx-auto max-w-2xl text-body-lg text-muted-foreground leading-relaxed sm:text-xl"
            variants={fadeInUp}
          >
            Kerala's most trusted mobile resale platform. Connect with verified vendors through transparent bidding. 
            Agent-verified transactions. Get paid instantly.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6"
            variants={fadeInUp}
          >
            <Button 
              size="lg" 
              className="group relative h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90 shadow-soft hover:shadow-medium transition-all duration-200" 
              asChild
            >
              <Link href="/login">
                <Smartphone className="mr-2 h-5 w-5" />
                List Your Device
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 text-base font-medium border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200" 
              asChild
            >
              <Link href="/login">
                <Users className="mr-2 h-5 w-5" />
                Browse Marketplace
              </Link>
            </Button>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div 
            className="mt-12 pt-8 border-t border-border/50"
            variants={fadeInUp}
          >
            <p className="text-caption text-muted-foreground mb-4">
              Trusted by thousands across Kerala
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm font-medium">Agent Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm font-medium">Instant Payment</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 