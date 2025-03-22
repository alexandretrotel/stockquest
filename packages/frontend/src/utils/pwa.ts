"use client";

import webpush from "web-push";

/**
 * Converts a base64-encoded string to a Uint8Array.
 * Adds padding and adjusts URL-safe characters before decoding.
 *
 * @param base64String - The base64-encoded string to convert
 * @returns A Uint8Array containing the decoded binary data
 */
export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Converts an ArrayBuffer to a base64-encoded string.
 * Transforms binary data into a string using UTF-16 characters, then encodes it.
 *
 * @param buffer - The ArrayBuffer containing binary data to encode
 * @returns A base64-encoded string representing the buffer
 */
export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Converts a browser PushSubscription to a web-push compatible PushSubscription object.
 * Extracts the endpoint and keys, converting key buffers to base64 strings.
 *
 * @param subscription - The browser PushSubscription object to convert
 * @returns A web-push compatible PushSubscription object with endpoint and base64-encoded keys
 */
export function subscriptonToWebPushSubscription(
  subscription: PushSubscription,
): webpush.PushSubscription {
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
      auth: arrayBufferToBase64(subscription.getKey("auth")!),
    },
  };
}
