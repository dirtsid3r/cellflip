import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Users, MapPin } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 lg:py-24 xl:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-6 px-4 py-1.5">
          <MapPin className="mr-2 h-3 w-3" />
          Proudly serving Kerala
        </Badge>
        
        <h1 className="mb-6 font-heading text-3xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Sell Your Phone
          <br className="hidden sm:inline" />
          <span className="text-primary">Get Fair Price</span>
        </h1>
        
        <p className="mb-8 mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Kerala's most trusted mobile resale platform. Connect with verified vendors through transparent bidding. 
          Agent-verified transactions. Get paid instantly.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <Button size="lg" className="text-base px-8 py-3" asChild>
            <Link href="/login">
              <Smartphone className="mr-2 h-5 w-5" />
              List Your Device
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 py-3" asChild>
            <Link href="/login">
              <Users className="mr-2 h-5 w-5" />
              Browse Marketplace
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 