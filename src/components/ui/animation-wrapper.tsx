"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimationWrapperProps {
  children: ReactNode;
  className?: string;
}

export function AnimationWrapper({
  children,
  className,
}: AnimationWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
