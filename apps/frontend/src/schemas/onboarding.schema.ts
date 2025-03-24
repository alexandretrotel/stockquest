import { z } from "zod";

export const OnboardingChallengeSchema = z.object({
  slug: z.enum(["add-5-stocks", "balance-to-100", "run-simulation"]),
  label: z.string(),
});
export const OnboardingChallengesSchema = z.array(OnboardingChallengeSchema);

export const TutorialSlideSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoSrc: z.string(),
});
export const TutorialSlidesSchema = z.array(TutorialSlideSchema);

export type OnboardingChallengesSlug = OnboardingChallenge["slug"];
export type OnboardingChallenge = z.infer<typeof OnboardingChallengeSchema>;
export type OnboardingChallenges = z.infer<typeof OnboardingChallengesSchema>;

export type TutorialSlide = z.infer<typeof TutorialSlideSchema>;
export type TutorialSlides = z.infer<typeof TutorialSlidesSchema>;
