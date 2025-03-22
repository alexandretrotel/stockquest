"use client";

import { notFound, useParams } from "next/navigation";
import { useProfile } from "@/features/profile/hooks/use-profile";
import ProfileCard from "@/features/profile/components/profile-card";
import PortfolioShowcase from "@/features/profile/components/portfolio-showcase";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const params: { username?: string } = useParams();
  const rawUsername = params.username;
  const username = rawUsername ? decodeURIComponent(rawUsername) : "";

  const { data, isLoading } = useProfile(username);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (session?.user.username === username) {
    router.push("/profile");
  }

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-8">
        <p className="text-foreground animate-pulse text-center">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return notFound();
  }

  const displayUsername = data.profile.displayUsername ?? username;
  const signUpDate = data.profile.createdAt;

  const numberOfSavedPortfolios = data.numberOfSavedPortfolios;
  const numberOfStocks = data.numberOfStocks;
  const finalSavedPortfolios = data.savedPortfolios;
  const xp = data.xp;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex w-full flex-col gap-8">
        <ProfileCard
          displayUsername={displayUsername}
          username={username}
          numberOfSavedPortfolios={numberOfSavedPortfolios}
          numberOfStocks={numberOfStocks}
          signUpDate={signUpDate}
          xp={xp}
        />

        <PortfolioShowcase savedPortfolios={finalSavedPortfolios} />
      </div>
    </div>
  );
}
