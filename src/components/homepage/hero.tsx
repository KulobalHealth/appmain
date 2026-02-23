"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { Icons } from "../ui/icons";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden rounded-b-[30px] md:rounded-b-[50px] lg:rounded-b-[80px] px-4">
      {" "}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Icons.Banner className="w-full h-full opacity-20 object-cover scale-105" />
      </div>
      <div className="w-full container mx-auto max-w-2xl relative text-center flex flex-col items-center justify-center py-20 md:py-0">
        {" "}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white leading-tight text-gray-800 font-urbanist md:mb-6"
        >
          Advancing Ghana&apos;s{" "}
          <span className="text-[#03C486]">Pharmacy Operations</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-sm sm:text-base md:text-lg md:mb-8 max-w-xl mx-auto px-4"
        >
          Connecting Pharmacies with Suppliers Seamlessly. Order Rapid Test
          Kits, Medical Devices, and Supplies with Ease and Get Them Delivered
          Within 48 Hours.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 w-full sm:w-auto px-4 sm:px-0">
          <Link href="/marketplace" className="w-auto mx-auto sm:mx-0">
            <Button className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 bg-[#03C486] rounded-full hover:cursor-pointer text-white hover:bg-[#02b377] font-bold text-xs sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
              Shop as a Pharmacy
            </Button>
          </Link>
          <Link href="/suppliers" className="w-auto mx-auto sm:mx-0">
            <Button
              variant="outline"
              className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-2 border-[#03C486] text-[#03C486] rounded-full hover:bg-[#03C486] hover:text-white font-bold text-xs sm:text-base md:text-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Partner as a Supplier
            </Button>
          </Link>
        </div>
      </div>{" "}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="hidden md:flex absolute bottom-32 right-8 flex-col items-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Scroll to explore
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-300 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-300 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
