"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import pharmaImg from "@/../public/MockUp2.1.png";
import { pharmacyBenefits } from "./data";

export default function ValuePropositionPharmacies() {
  return (
    <section className="px-4 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Text Content - appears first on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1 space-y-6 text-center sm:text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-600 dark:text-primary-400 leading-tight">
              Your Pharmacy, Simplified
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Streamline your procurement process with our comprehensive
              marketplace designed specifically for pharmacies. 
            </p>


            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Access verified suppliers,
              manage inventory efficiently, and enjoy seamless ordering with real-time
              tracking and competitive pricing all in one platform built to help your
              pharmacy thrive.
            </p>
            
            <div className="pt-2 flex justify-center sm:justify-start">
              <Link href="/marketplace" className="block">
                <Button className="py-4 sm:py-5 md:py-6 px-6 sm:px-8 md:px-10 hover:cursor-pointer bg-[#03C486] hover:bg-[#02b377] text-white rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 whitespace-nowrap">
                 Start Shopping
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image - appears second on mobile (below text) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-1 lg:order-2 w-full"
          >
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src={pharmaImg}
                alt="Pharmacy Marketplace"
                fill
                className="rounded-lg md:rounded-2xl object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
