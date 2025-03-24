import { OnboardingFlow } from "@/features/onboarding/components/flow";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import Sync from "./sync";

export default function Init() {
  return (
    <>
      <OnboardingFlow />
      <Toaster />
      <Sync />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
