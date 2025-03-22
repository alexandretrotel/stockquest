"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSavedPortfolios } from "./saved-portfolios.action";
import { getNumberOfStocks } from "@/utils/portfolio";
import { getSimulationLogs } from "./user-logs.action";
import { getXPFromAchievements } from "@/utils/achievements";
import {
  ProfileData,
  ProfileDataSchema,
  ProfileUserData,
} from "@/schemas/profile.schema";
import { UserData } from "@/schemas/user.schema";
import { getUsernameFromUserId } from "./users.action";

/**
 * Retrieves core user data from the database by username.
 * Fetches basic user information such as ID, name, and role.
 *
 * @param username - The username of the user to retrieve data for
 * @returns A promise resolving to the user's core data
 */
export const getUserData = async (username: string): Promise<UserData> => {
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.username, username))
    .execute();

  return userData[0];
};

/**
 * Retrieves user data formatted for profile display.
 * Extracts and structures essential user details like name, image, and ban status.
 *
 * @param username - The username of the user to retrieve profile data for
 * @returns A promise resolving to the user's profile-ready data
 */
export const getProfileUserData = async (
  username: string,
): Promise<ProfileUserData> => {
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.username, username))
    .execute();

  const profileData: ProfileUserData = {
    id: userData[0].id,
    name: userData[0].name,
    image: userData[0].image,
    username: userData[0].username,
    displayUsername: userData[0].displayUsername,
    role: userData[0].role,
    banned: userData[0].banned,
    banReason: userData[0].banReason,
    banExpires: userData[0].banExpires,
    createdAt: userData[0].createdAt,
    updatedAt: userData[0].updatedAt,
  };

  return profileData;
};

/**
 * Retrieves comprehensive profile data for a user, including portfolio and achievement stats.
 * Combines user details, saved portfolios, stock counts, and experience points (XP).
 *
 * @param username - The username of the user to retrieve profile data for
 * @returns A promise resolving to the user's complete profile data, validated against the schema
 */
export const getProfileData = async (
  username: string,
): Promise<ProfileData> => {
  const userData = await getProfileUserData(username);
  const [savedPortfolios, simulationLogs] = await Promise.all([
    await getSavedPortfolios(userData.id),
    await getSimulationLogs(userData.id),
  ]);

  const numberOfSavedPortfolios = savedPortfolios.length;
  const numberOfStocks = getNumberOfStocks(savedPortfolios);
  const numberOfSimulations = simulationLogs.length;

  const xp = getXPFromAchievements({
    numberOfSavedPortfolios,
    numberOfStocks,
    savedPortfolios,
    numberOfSimulations,
  });

  const unvalidatedResult: ProfileData = {
    profile: userData,
    savedPortfolios,
    numberOfSavedPortfolios,
    numberOfStocks,
    xp,
  };
  const result = ProfileDataSchema.parse(unvalidatedResult);

  return result;
};

/**
 * Retrieves a user's profile data from their username.
 *
 * @param username - The username of the user to retrieve profile data for
 * @returns A promise resolving to the user's profile data
 */
export const getProfileUserDataFromUserId = async (userId: string) => {
  const username = await getUsernameFromUserId(userId);
  const profileUserData = await getProfileUserData(username);

  return profileUserData;
};
