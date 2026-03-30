// UI/src/components/AnimatedSection.tsx
"use client";
import { motion, Variants } from "framer-motion";
import React from "react";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export const AnimatedItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div variants={itemVariants} className={className}>
    {children}
  </motion.div>
);

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedSection = ({
  children,
  delay = 0,
  stagger = 0.08,
  className,
  style,
}: AnimatedSectionProps) => {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
