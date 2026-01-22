import { motion } from "motion/react";

export function ShimmerLoader() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 h-full"
      initial={{ backgroundPosition: "-200%" }}
      animate={{ backgroundPosition: "200%" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear"
      }}
      style={{ backgroundSize: "200% 100%" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </motion.div>
  );
}
