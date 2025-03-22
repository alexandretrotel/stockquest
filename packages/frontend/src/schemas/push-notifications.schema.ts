import { z } from "zod";

export const PushNotificationSchema = z.object({
  id: z.string(),
  subscription: z.any(),
  userId: z.string(),
});
export const PushNotificationsSchema = z.array(PushNotificationSchema);

export type PushNotification = z.infer<typeof PushNotificationSchema>;
export type PushNotifications = z.infer<typeof PushNotificationsSchema>;
