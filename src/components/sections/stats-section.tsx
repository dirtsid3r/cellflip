'use client';

import { motion } from "framer-motion";

interface StatCard {
  value: string;
  label: string;
  icon?: string;
}

const stats: StatCard[] = [
  { value: "1000+", label: "Happy Customers" },
  { value: "₹50L+", label: "Transactions" },
  { value: "24hrs", label: "Avg. Sale Time" },
  { value: "4.8★", label: "User Rating" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export function StatsSection() {
  return (
    <section className="relative py-16 md:py-20">
      {/* Background with subtle texture */}
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container relative mx-auto px-4">
        <motion.div 
          className="mx-auto max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section header */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-display-md font-bold text-foreground mb-4">
              Trusted by Kerala
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who've chosen Cellflip for their mobile resale needs
            </p>
          </motion.div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="group relative"
                variants={itemVariants}
              >
                <div className="relative overflow-hidden rounded-xl bg-background border border-border/50 p-8 text-center shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/20">
                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    <motion.h3 
                      className="text-display-md font-bold text-foreground mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1 + 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-body text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 