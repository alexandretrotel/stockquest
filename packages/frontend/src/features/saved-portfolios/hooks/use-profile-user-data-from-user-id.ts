import { fetcher } from "@/lib/swr";
import { ProfileUserData } from "@/schemas/profile.schema";
import useSWR from "swr";

export const useProfileUserDataFromUserId = (userId: string) => {
  return useSWR<ProfileUserData>(`/api/profile/id/${userId}`, fetcher);
};
