import { createAuthClient } from "better-auth/react";
import { BASE_URL } from "@/data/settings";
import {
  passkeyClient,
  usernameClient,
  adminClient,
  anonymousClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    passkeyClient(),
    usernameClient(),
    adminClient(),
    anonymousClient(),
  ],
});
