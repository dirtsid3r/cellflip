import { Shield, TrendingUp, Clock } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: Feature[] = [
  {
    title: "100% Secure",
    description: "Agent verification at your location. No online transfers until device inspection is complete.",
    icon: Shield,
  },
  {
    title: "Best Prices",
    description: "Competitive bidding ensures you get the highest market value for your device.",
    icon: TrendingUp,
  },
  {
    title: "Quick Process",
    description: "From listing to payment in 24-48 hours. No waiting weeks for buyers.",
    icon: Clock,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-8 md:py-12 lg:py-20 bg-slate-50 dark:bg-slate-900/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="mb-4 font-heading text-3xl font-bold sm:text-5xl md:text-6xl">
            Why Choose Cellflip?
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for Kerala, designed for trust
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="rounded-lg border bg-background p-6 text-center">
                  <IconComponent className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 