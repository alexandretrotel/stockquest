import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { X } from "lucide-react";
import { motion } from "motion/react";

export default function OnboardingHeader() {
  const { updateTutorial } = useOnboardingStore();

  return (
    <motion.div
      className="flex items-center justify-end border-b p-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => updateTutorial("skip")}
        className="gap-1"
      >
        <X className="hidden h-4 w-4 md:block" />
        Skip Tutorial
      </Button>
    </motion.div>
  );
}
