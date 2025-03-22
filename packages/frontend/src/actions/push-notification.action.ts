"use server";

import { db } from "@/db";
import { subscriptonToWebPushSubscription } from "@/utils/pwa";
import { eq } from "drizzle-orm";
import webpush from "web-push";
import { pushNotificationSubscriptions } from "@/db/schema";

webpush.setVapidDetails(
  "mailto:trotelalexandre@proton.me",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

/**
 * Sends a push notification to a user’s subscription using the web-push library.
 * Delivers a message with a title, body, and icon, formatted as a StockQuest notification.
 *
 * @param message - The message content to display in the notification
 * @param subscription - The browser PushSubscription object to send the notification to (optional)
 * @throws {Error} If no subscription is provided
 */
export async function sendNotification(
  message: string,
  subscription?: PushSubscription,
) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  await webpush.sendNotification(
    subscriptonToWebPushSubscription(subscription),
    JSON.stringify({
      title: "StockQuest",
      body: message,
      icon: "/web-app-manifest-512x512.png",
    }),
  );
}

/**
 * Removes a user’s push notification subscription from the database.
 * Deletes the subscription record associated with the given user ID.
 *
 * @param userId - The ID of the user to unsubscribe from push notifications
 */
export const unsubscribe = async (userId: string) => {
  await db
    .delete(pushNotificationSubscriptions)
    .where(eq(pushNotificationSubscriptions.userId, userId))
    .execute();
};

/**
 * Retrieves a user’s push notification subscription from the database.
 * Fetches the subscription object tied to the given user ID.
 *
 * @param userId - The ID of the user whose subscription is being retrieved
 * @returns A promise resolving to the user’s web-push subscription object
 */
export const getSubscription = async (
  userId: string,
): Promise<webpush.PushSubscription> => {
  const result = await db
    .select()
    .from(pushNotificationSubscriptions)
    .where(eq(pushNotificationSubscriptions.userId, userId))
    .execute();

  const subscription = result[0].subscription as webpush.PushSubscription;
  return subscription;
};

/**
 * Registers a user for push notifications by saving their subscription.
 * Stores the provided subscription object in the database for the given user.
 *
 * @param userId - The ID of the user to subscribe to push notifications
 * @param subscription - The web-push subscription object to save
 */
export const subscribe = async (
  userId: string,
  subscription: webpush.PushSubscription,
) => {
  await db
    .insert(pushNotificationSubscriptions)
    .values({ subscription, userId })
    .execute();
};
