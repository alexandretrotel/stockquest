"use client";

import PortfolioShowcase from "@/features/profile/components/portfolio-showcase";
import ProfileCard from "@/features/profile/components/profile-card";
import { authClient } from "@/lib/auth-client";
import { useAchievementsStore } from "@/stores/achievements.store";
import { useSavedPortfoliosStore } from "@/stores/saved-portfolios.store";
import { notFound } from "next/navigation";

export default function ProfilePage() {
  const session = authClient.useSession();
  const { earnedXP } = useAchievementsStore();
  const { numberOfSavedPortfolios, numberOfStocks, savedPortfolios } =
    useSavedPortfoliosStore();

  if (!session.data) {
    return notFound();
  }

  const user = session.data.user;
  const username = user.username ?? "N/A";
  const displayUsername = user.displayUsername ?? username;
  const signUpDate = user.createdAt;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex w-full flex-col gap-8">
        <ProfileCard
          displayUsername={displayUsername}
          username={username}
          xp={earnedXP}
          numberOfSavedPortfolios={numberOfSavedPortfolios}
          numberOfStocks={numberOfStocks}
          signUpDate={signUpDate}
        />

        <PortfolioShowcase savedPortfolios={savedPortfolios} />
      </div>
    </div>
  );
}
