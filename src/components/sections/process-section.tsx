import { Smartphone, TrendingUp, Shield, CheckCircle } from "lucide-react";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "List Device",
    description: "Upload photos, enter details, and set asking price. Admin approval within 2 hours.",
    icon: Smartphone,
    color: "blue",
  },
  {
    step: 2,
    title: "Get Bids",
    description: "Verified vendors compete with bids for 24 hours. You choose the best offer.",
    icon: TrendingUp,
    color: "green",
  },
  {
    step: 3,
    title: "Verification",
    description: "Our agent inspects device at your location and confirms final offer.",
    icon: Shield,
    color: "purple",
  },
  {
    step: 4,
    title: "Get Paid",
    description: "Instant payment via UPI or bank transfer. Device handed over to vendor.",
    icon: CheckCircle,
    color: "orange",
  },
];

const colorClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
  green: "bg-green-100 dark:bg-green-900/20 text-green-600",
  purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
  orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
};

export function ProcessSection() {
  return (
    <section id="how-it-works" className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h2 className="mb-4 font-heading text-3xl font-bold sm:text-5xl md:text-6xl">
          How Cellflip Works
        </h2>
        <p className="text-lg text-muted-foreground">
          Simple 4-step process for maximum value
        </p>
      </div>
      
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.step} className="rounded-lg border bg-background p-6">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg mb-4 ${colorClasses[step.color as keyof typeof colorClasses]}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{step.step}. {step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 