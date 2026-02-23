import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const benefits = [
  "Extensive Marketplace - Wide range of products including rapid test kits, first aid supplies, and medical devices",
  "Compare & Choose - Filter by price, manufacturer, brand, and other criteria to find exactly what you need",
  "Simplified Ordering - No more dealing with multiple suppliers daily. One platform for all your needs",
  "Reliable Delivery - Get your orders delivered within 48 hours with our dependable logistics network",
];

export default function ValuePropositionPharmacies() {
  return (
    <section className="px-4 bg-gray-50">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600">
              Everything Your Pharmacy Needs, All in One Place
            </h2>
            <p className="text-gray-600 mb-6">
              Streamline your procurement process with our comprehensive
              marketplace designed specifically for pharmacies
            </p>
            <div className="mb-6 flex gap-4 flex-col">
              <ul className="mt-4 space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex justify-center items-center bg-primary-600 w-5 h-5 rounded-full mr-3 flex-shrink-0 mt-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/marketplace" className="w-fit">
                <Button className="w-fit hover:cursor-pointer">
                  Explore the Marketplace
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded-lg"
                style={{ width: "100%", height: "0", paddingBottom: "95.25%" }}
              >
                <Image
                  src="/images/pharmaImage.webp"
                  alt="Pharmacy Marketplace"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
