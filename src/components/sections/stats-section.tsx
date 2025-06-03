interface StatCard {
  value: string;
  label: string;
}

const stats: StatCard[] = [
  { value: "1000+", label: "Happy Customers" },
  { value: "₹50L+", label: "Transactions" },
  { value: "24hrs", label: "Avg. Sale Time" },
  { value: "4.8★", label: "User Rating" },
];

export function StatsSection() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-lg border bg-background p-6 text-center">
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 