import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import devicesImg from "@/../public/MockUp4.1.png";
import { benefits } from "./data";

export default function ValuePropositionSuppliers() {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="container mx-auto">
        <div className="grid items-center grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image - Shows first on mobile and desktop */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
            <Image
              src={devicesImg}
              alt="Medical Supplies for Suppliers"
              fill
              className="rounded-xl object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Text Content - Shows second on mobile and desktop */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center sm:text-left">
            <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-600 dark:text-primary-400 leading-tight">
              Manage Your Patient. <br className="hidden sm:block"/>Expand Your Reach.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 dark:text-gray-300 leading-relaxed">
              Manage all your patient records efficiently, collecting vital patient data to improve care delivery. 
            </p>

            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 dark:text-gray-300 leading-relaxed">
              Our platform streamlines administrative tasks, enabling healthcare providers to focus on what matters most patient outcomes. 
              Access real-time analytics, secure data storage, and seamless integration with existing systems.
            </p>

            <div className="flex justify-center sm:justify-start">
              <Link href="/suppliers" className="inline-block">
                <Button className="hover:cursor-pointer py-4 sm:py-5 md:py-6 bg-[#03C486] hover:bg-[#02b377] text-white rounded-full px-6 sm:px-8 md:px-10 font-semibold text-sm sm:text-base md:text-lg transition-all hover:scale-105 shadow-lg whitespace-nowrap">
                  Become a Supplier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
