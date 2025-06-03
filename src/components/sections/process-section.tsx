'use client';

import { Smartphone, TrendingUp, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "List Device",
    description: "Upload photos, enter details, and set asking price. Admin approval within 2 hours.",
    icon: Smartphone,
  },
  {
    step: 2,
    title: "Get Bids",
    description: "Verified vendors compete with bids for 24 hours. You choose the best offer.",
    icon: TrendingUp,
  },
  {
    step: 3,
    title: "Verification",
    description: "Our agent inspects device at your location and confirms final offer.",
    icon: Shield,
  },
  {
    step: 4,
    title: "Get Paid",
    description: "Instant payment via UPI or bank transfer. Device handed over to vendor.",
    icon: CheckCircle,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

export function ProcessSection() {
  return (
    <section id="how-it-works" className="relative py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mx-auto max-w-4xl text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-display-lg font-bold text-foreground mb-6">
            How Cellflip Works
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Simple 4-step process designed for maximum value and complete transparency
          </p>
        </motion.div>
        
        <motion.div 
          className="mx-auto max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === processSteps.length - 1;
              
              return (
                <motion.div 
                  key={step.step} 
                  className="group relative"
                  variants={itemVariants}
                >
                  {/* Connection line for desktop */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-border z-0">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary/60 to-primary/20"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.8, duration: 0.5 }}
                      />
                      
                      {/* Animated arrow */}
                      <ArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-primary/60" />
                    </div>
                  )}
                  
                  <div className="relative overflow-hidden rounded-2xl bg-background border border-border/50 p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/20 group-hover:-translate-y-1">
                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative">
                      {/* Step number + icon */}
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div 
                          className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"
                          variants={iconVariants}
                        >
                          <IconComponent className="h-7 w-7 text-primary" />
                        </motion.div>
                        
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {step.step}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-display-md font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-body text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Bottom CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-body-lg text-muted-foreground mb-6">
              Ready to get started?
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-soft hover:shadow-medium transition-all duration-200 hover:bg-primary/90"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              List Your Device Now
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 