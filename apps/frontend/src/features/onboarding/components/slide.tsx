"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface OnboardingSlideProps {
  title: string;
  description: string;
  videoSrc: string;
  children?: ReactNode;
}

export function OnboardingSlide({
  title,
  description,
  videoSrc,
  children,
}: OnboardingSlideProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="mb-6 text-center text-2xl font-bold"
        variants={itemVariants}
      >
        {title}
      </motion.h2>

      <motion.div
        className="bg-muted relative mb-8 aspect-video w-full max-w-2xl overflow-hidden rounded-lg border shadow-lg"
        variants={itemVariants}
      >
        <video
          src={videoSrc}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        />
      </motion.div>

      <motion.p
        className="text-muted-foreground mb-6 max-w-md px-2 text-center"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      {children}
    </motion.div>
  );
}
