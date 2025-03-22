import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { useCallback, useEffect } from "react";

export default function OnboardingFooter() {
  const {
    currentTutorialStep,
    totalTutorialSteps,
    updateTutorial,
    setDirection,
  } = useOnboardingStore();

  const isLastStep = currentTutorialStep === totalTutorialSteps - 1;

  const handleNext = useCallback(() => {
    setDirection(1);
    updateTutorial("next");
  }, [setDirection, updateTutorial]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    updateTutorial("prev");
  }, [setDirection, updateTutorial]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (currentTutorialStep > 0) {
            handlePrev();
          }
          break;
        case "ArrowRight":
          if (!isLastStep) {
            handleNext();
          }
          break;
        case "Enter":
        case " ":
          if (isLastStep) {
            updateTutorial("complete");
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTutorialStep, handleNext, handlePrev, isLastStep, updateTutorial]);

  return (
    <motion.div
      className="grid grid-cols-2 border-t p-4 md:flex md:items-center md:justify-between"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      <Button
        variant="outline"
        onClick={handlePrev}
        disabled={currentTutorialStep === 0}
        className="flex-1 sm:flex-initial"
      >
        <ChevronLeft className="mr-1 h-4 w-4 sm:mr-0" />
        Back
      </Button>

      {isLastStep ? (
        <Button
          onClick={() => updateTutorial("skip")}
          className="ml-2 flex-1 sm:flex-initial"
        >
          Finish
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          variant="outline"
          className="ml-2 flex-1 sm:flex-initial"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4 sm:ml-0" />
        </Button>
      )}
    </motion.div>
  );
}
