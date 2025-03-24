"use client";

import { authClient } from "@/lib/auth-client";
import { useAchievementsStoreInitializer } from "@/stores/achievements.store";
import { usePushNotificationsInitializer } from "@/stores/push-notification.store";
import { useSavedPortfolioInitialiser } from "@/stores/saved-portfolios.store";

function SyncComponent() {
  usePushNotificationsInitializer();

  return <></>;
}

function AuthSyncComponent() {
  useSavedPortfolioInitialiser();
  useAchievementsStoreInitializer();

  return <></>;
}

export default function Sync() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <SyncComponent />
      {session && <AuthSyncComponent />}
    </>
  );
}
