import { useOnboardingStore } from "@/stores/onboarding.store";
import { AnimatePresence, motion } from "motion/react";
import { OnboardingSlide } from "./slide";
import { TUTORIAL_SLIDES } from "@/data/tutorial";

export default function OnboardingBody() {
  const { currentTutorialStep, direction } = useOnboardingStore();

  const slideVariants = {
    initial: (direction: number) => ({
      x: direction * 200,
      opacity: 0,
    }),
    animate: () => ({
      x: 0,
      opacity: 1,
    }),
    exit: (direction: number) => ({
      x: direction * -200,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden">
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={currentTutorialStep}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full"
        >
          <OnboardingSlide
            title={TUTORIAL_SLIDES[currentTutorialStep].title}
            description={TUTORIAL_SLIDES[currentTutorialStep].description}
            videoSrc={TUTORIAL_SLIDES[currentTutorialStep].videoSrc}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
