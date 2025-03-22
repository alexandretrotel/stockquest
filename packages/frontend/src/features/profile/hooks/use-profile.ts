import { fetcher } from "@/lib/swr";
import { ProfileData } from "@/schemas/profile.schema";
import useSWR from "swr";

export const useProfile = (username: string) => {
  return useSWR<ProfileData>(
    username ? `/api/profile/${username}` : null,
    fetcher,
  );
};
