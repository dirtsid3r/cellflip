import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 font-heading text-3xl font-bold sm:text-5xl md:text-6xl">
          Ready to Sell Your Device?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Join thousands of satisfied customers across Kerala
        </p>
        <Button size="lg" className="text-base px-8 py-3" asChild>
          <Link href="/login">
            <MessageCircle className="mr-2 h-5 w-5" />
            Start with WhatsApp
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
} 