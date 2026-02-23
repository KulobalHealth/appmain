import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import allKitsImg from "@/../public/allKits.webp";

const categories = [
  "Medications - Wide range of pharmaceutical products with 500+ options available",
  "Rapid Test Kits - COVID-19, Malaria, HIV tests and more with 150+ testing solutions",
  "Medical Devices - Blood pressure monitors, thermometers and 200+ medical instruments",
  "First Aid Supplies - Bandages, antiseptics, emergency kits and 300+ safety items",
  "Personal Care - Health and wellness products with 400+ personal care options",
  "Diagnostic Tools - Essential diagnostic equipment with 100+ professional tools",
];

export default function FeaturedCategories() {
  return (
    <section className="px-4">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600 dark:text-primary-400">
              Featured Product Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Discover our comprehensive range of medical products and supplies,
              carefully curated for pharmacies and healthcare providers
            </p>
            <div className="mb-6 flex gap-10 flex-col">
              <ul className="mt-4 space-y-3">
                {categories.map((category, index) => (
                  <li key={`category-${index}`} className="flex items-start">
                    <div className="flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-5 h-5 rounded-full mr-3 flex-shrink-0 mt-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/marketplace" className="w-fit">
                <Button className="w-fit hover:cursor-pointer py-6">
                  Browse All Categories
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded-lg"
                style={{
                  width: "100%",
                  height: "0",
                  paddingBottom: "95.25%",
                }}
              >
                {" "}
                <Image
                  src={allKitsImg}
                  alt="Featured Product Categories"
                  fill
                  objectFit="cover"
                  className="rounded-[7px]"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
