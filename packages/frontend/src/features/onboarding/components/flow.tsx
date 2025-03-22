"use client";

import { authClient } from "@/lib/auth-client";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import OnboardingHeader from "./header";
import OnboardingProgress from "./progress";
import OnboardingBody from "./body";
import OnboardingFooter from "./footer";

export function OnboardingFlow() {
  const [mounted, setMounted] = useState(false);

  const { data: session } = authClient.useSession();
  const { tutorialCompleted } = useOnboardingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || tutorialCompleted || !session) {
    return null;
  }

  const showTutorial = session && !tutorialCompleted;

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          className="bg-background fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <OnboardingHeader />
          <OnboardingBody />
          <OnboardingProgress />
          <OnboardingFooter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
