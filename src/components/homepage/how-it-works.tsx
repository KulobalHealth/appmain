import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Suppliers List Inventory",
    description:
      "Suppliers upload their products to our comprehensive marketplace platform with detailed specifications and pricing.",
  },
  {
    number: "02",
    title: "Pharmacies Browse & Order",
    description:
      "Pharmacies easily search, compare, and order the products they need through our user-friendly interface.",
  },
  {
    number: "03",
    title: "AI-Powered Insights",
    description:
      "Our AI provides smart recommendations and market insights for better purchasing decisions.",
  },
  {
    number: "04",
    title: "Fast & Reliable Delivery",
    description:
      "Get your orders delivered within 48 hours with our dependable logistics network.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-8 md:py-12 bg-white dark:bg-background">
      <div className="container mx-auto">
        <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image - appears first on mobile */}
          <div className="order-1 w-full">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/MockUp1.1.png"
                alt="How It Works Process"
                fill
                className="rounded-lg md:rounded-2xl object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Text Content - appears second on mobile */}
          <div className="order-2 space-y-6 text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-600 dark:text-primary-400 leading-tight">
              How Our Platform Works
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Our platform simplifies the entire supply chain process from
              listing to delivery, ensuring efficiency and transparency at every step.
            </p>

            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            From pharmaceutical suppliers to healthcare providers, we connect the entire ecosystem with cutting-edge technology and seamless logistics.
            </p>
            
            <div className="pt-2 flex justify-center sm:justify-start">
              <Button asChild className="w-auto py-5 px-6 sm:py-6 sm:px-8 hover:cursor-pointer bg-[#03C486] hover:bg-[#02b377] text-white rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 whitespace-nowrap">
                <Link href="/marketplace" className="flex items-center justify-center gap-2">
                  Explore Marketplace
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
