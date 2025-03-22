"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiGoogleFill } from "@remixicon/react";
import { z } from "zod";
import {
  MAXIMUM_PASSWORD_LENGTH,
  MAXIMUM_USERNAME_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  MINIMUM_USERNAME_LENGTH,
  PASSKEY_ENABLED,
} from "@/data/settings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInSchema = z.object({
  username: z
    .string()
    .min(MINIMUM_USERNAME_LENGTH, "Username is too short")
    .max(MAXIMUM_USERNAME_LENGTH, "Username is too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z
    .string()
    .min(MINIMUM_PASSWORD_LENGTH, "Password is too short")
    .max(MAXIMUM_PASSWORD_LENGTH, "Password is too long"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    void authClient.signIn.passkey({ autoFill: true });
  }, []);

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    await authClient.signIn.username(
      {
        username: data.username,
        password: data.password,
      },
      {
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            toast.error("Please verify your email address");
            router.push("/auth/verify-email");
          } else {
            toast.error("An error occurred. Please check your credentials");
          }
          setIsLoading(false);
          throw ctx.error;
        },
      },
    );

    setIsLoading(false);
    router.push("/");
  };

  const handlePasskeySignIn = async () => {
    setIsLoading(true);

    try {
      const data = await authClient.signIn.passkey();

      if (data?.error) {
        toast.error("An error occurred. Please try again later.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.push("/");
    } catch {
      toast.error("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
      });

      router.push("/");
    } catch {
      toast.error("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-6">
          <div className="text-center">
            <h1 className="text-foreground text-2xl font-bold">Sign In</h1>

            <p className="text-muted-foreground mt-2 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="john_doe"
                {...register("username")}
                required
                autoComplete="username webauthn"
              />
              {errors.username && (
                <p className="text-game-accent text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••••••••••"
                required
                {...register("password")}
                autoComplete="current-password webauthn"
              />
              {errors.password && (
                <p className="text-game-accent text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground bg-card px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {PASSKEY_ENABLED && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handlePasskeySignIn}
                  className="w-full"
                >
                  <Key className="h-4 w-4" />
                  {isLoading ? "Signing in..." : "Sign In with Passkey"}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
              >
                <RiGoogleFill className="h-4 w-4" />
                {isLoading ? "Signing in..." : "Sign In with Google"}
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  type="button"
                  className="text-game-blue font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </div>

              <div className="text-muted-foreground text-center text-sm">
                <Link
                  href="/auth/forgot-password"
                  type="button"
                  className="text-game-blue font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
