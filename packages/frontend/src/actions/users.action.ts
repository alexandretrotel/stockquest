"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { ilike, eq } from "drizzle-orm";

export type UserSearchResult = Awaited<ReturnType<typeof searchUsers>>;

/**
 * Searches for users in the database by username based on a query string.
 * Performs a case-insensitive partial match on usernames; returns all users if the query is empty.
 *
 * @param query - The search term to match against usernames (e.g., "john")
 * @returns A promise resolving to an array of user objects matching the query
 */
export const searchUsers = async (query: string) => {
  const result = await db
    .select()
    .from(user)
    .where(query.trim() ? ilike(user.username, `%${query}%`) : undefined);
  return result;
};

/**
 * Retrieves a user's username from their ID.
 *
 * @param userId - The ID of the user to retrieve the username for
 * @returns A promise resolving to the user's username
 */
export const getUsernameFromUserId = async (userId: string) => {
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .execute();

  return userData[0].username;
};
