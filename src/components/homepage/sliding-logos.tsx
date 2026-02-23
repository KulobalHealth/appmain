"use client";

import Image from "next/image";
import { motion } from "motion/react";

const logos = [
  { src: "/logos/raydos.webp", alt: "Raydos" },
  { src: "/logos/royalEng.webp", alt: "Royal Eng" },
  { src: "/logos/point.webp", alt: "Point" },
  { src: "/logos/dotGlasses.webp", alt: "Dot Glasses" },
  { src: "/logos/kowri.webp", alt: "Kowri" },
];

export function SlidingLogos() {
  // Duplicate logos array for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="hidden md:block py-8 md:py-12 bg-gray-50 dark:bg-gray-900 overflow-hidden -mt-[30px] md:-mt-[50px] lg:-mt-[80px]">
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-12 md:gap-16"
          animate={{
            x: [0, -100 * logos.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <div className="relative w-32 h-32 grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
