import { useOnboardingStore } from "@/stores/onboarding.store";
import { motion } from "motion/react";

export default function OnboardingProgress() {
  const { totalTutorialSteps, currentTutorialStep } = useOnboardingStore();

  return (
    <motion.div
      className="flex justify-center py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.2 }}
    >
      <div className="flex space-x-2">
        {Array.from({ length: totalTutorialSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentTutorialStep ? "bg-primary" : "bg-muted"
            }`}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: index === currentTutorialStep ? 1.2 : 1,
              opacity: index === currentTutorialStep ? 1 : 0.7,
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
